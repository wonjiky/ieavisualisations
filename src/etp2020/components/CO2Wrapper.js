import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CO2 from './CO2'
import { Controls, Control, ControlContainer } from '../../components/controls'
import { Legends } from '../../components/legends'
import classes from './css/ETP.module.css'

export default props => {
  
  const regionBounds ={
    US: [[-180, 10],[-45, 74]],
    China: [[50, 9],[155, 55]],
    Europe : [[-33, 26],[64, 66]]
  };
  const [data, setData] = React.useState(null);
  const [active, setActive] = React.useState({ open: false, target: null });
  const [regions, setRegions] = React.useState({region: 'US', bounds: regionBounds['US']});
  const [legendToggle, setLegendToggle] = React.useState({ 
    'Oil and gas reservoirs': true, 
    'Saline aquifers': true, 
    hubs: false, 
    pipelines: true, 
    sources: [], 
    projects: [],
  });
  const regionArr = [ 'US', 'Europe', 'China' ];
  const colors = ['#B187EF', '#6f6f6f', '#3E7AD3', '#1DBE62', '#FF684D'];

  React.useEffect(() => {
    const{ region }= regions;

    const URL = [
      axios.get(`${props.baseURL}ETP2020/CO2/${region}_Saline.json`),
      axios.get(`${props.baseURL}ETP2020/CO2/${region}_emissions.csv`),
    ];

    const types =  ['Iron and steel', 'Cement', 'Fuel refining', 'Chemicals', 'Power'];
    const regionParam = {
      US: {
        'Oil and gas reservoirs': [
          { url: "mapbox://iea.63h5unlk", sourceLayer: "US_Reservoir_1458-45y6ui" },
          { url: "mapbox://iea.733wblb1", sourceLayer: "US_Reservoir_23-b0hrl2" },
          { url: "mapbox://iea.092dk9uv", sourceLayer: "US_Reservoir_67-1u3cbn" },
          { url: "mapbox://iea.47kfi170", sourceLayer: "US_Reservoir_9101112-1x96uc" }
        ],
        types: types,
        scale: 1
      },
      Europe: {
        'Oil and gas reservoirs': [{ url: "mapbox://iea.d4w60p1l", sourceLayer: "Europe_reservoir-5lg77n" },],
        types: types,
        scale: 1
      },
      China: {
        'Oil and gas reservoirs': [{ url: "mapbox://iea.0nkpwvw6", sourceLayer: "China_Reservoir-4sfg1q" },],
        types: types,
        scale: 0.5
      }
    }

    axios.all(URL)
      .then(responses => {
        let temporaryData = Papa.parse(responses[1].data, { header: true }).data;
        let tempData = hello(temporaryData);
        let data = {
          heatmap: {
            'type': 'FeatureCollection',
            'features': []
          },
          'Oil and gas reservoirs': regionParam[regions.region]['Oil and gas reservoirs'],
          'Saline aquifers': responses[0].data,
          types: regionParam[regions.region].types,
          minMax: [
            Math.min(...tempData.map(d=> parseFloat(d.value))),
            Math.max(...tempData.map(d=> parseFloat(d.value))) * regionParam[region].scale
          ]
        };

        function hello(data) {
          let newData = [];
          for (let i in data) {
            if (isNaN(parseFloat(data[i].value))) {
            } else {
              newData.push(data[i])
            }
          } 
          return newData;
        }

        for ( let i in tempData ) {
          data.heatmap.features.push({
            'type': 'Feature',
            'geometry': {
              'type': 'Point', 
              'coordinates': [
                parseFloat(tempData[i].LONGITUDE),
                parseFloat(tempData[i].LATITUDE)
              ]
            },
            'properties': {
              value: parseFloat(tempData[i].value) || 0,
              type: tempData[i].SECTOR,
            }
          })
        };

        setLegendToggle({ 'Oil and gas reservoirs': true, 'Saline aquifers': true, pipelines: true,  projects:['Under development', 'Operating'], hubs: true, sources: regionParam[region].types })
        setData(data)
      })
  
  }, [ props.baseURL, regions ]);

  function open(e) {
		setActive({ open: true, target: e.target.value })
	}

  const hide = React.useCallback(() => {
    setActive({ open: false, target: null })
    document.removeEventListener('click', hide)
  },[])

  React.useEffect(() => {
    if (!active.open) return;
    document.addEventListener('click', hide)
  },[ active.open, hide ])

  let controls = [
		{ 
			id: 1,
			type: 'radio',
      flow: 'row',
      options: regionArr,
			click: value => setRegions({region: value, bounds: regionBounds[value]}),
			open: e => open(e),
			hide: e => hide(e),
			active: active,
			selected: regions.region
    }
  ];

  function arrayGetValue(arr) {
    let activeStorage = [];
    for ( let el in arr) {
      if ( legendToggle[arr[el]] ) {
        activeStorage.push(arr[el])
      }
    }
    return activeStorage;
  }

  if ( !data ) return <div>Loading...</div>

  return (
    <div className='container'>
      <CO2 
        data={data}
        toggle={legendToggle}
        regions={regions}
      />
      <ControlContainer>
        <Controls
          style={{
            top: '20px',
            left: '20px',
            padding: '0',
            width: '230px'
          }}
        >
          {controls.map((control, idx) => <Control key={idx} {...control} /> )}
        </Controls>
        <Controls
          column
          bg
          style={{
            flexFlow: 'column',
            bottom: '35px',
            left: '20px',
            width: '230px'
          }}
        >
          <Legends
            type={'continuous'}
            header={['CO2 emissions (Mt/year)', '2']}
            labels={[0, 225]}
            colors={['#e3a850', '#da8142', '#d36337', '#ce5030', '#c21e1e', '#a02115', '#8a230f', '#78240a', '#522700']}
            round={false}
          />
          <Legends
            type={'category'}
            header={['Potential CO2 storage', '2']}
            labels={['Oil and gas reservoirs', 'Saline aquifers']}
            colors={['#5b6162', 'stripe']}
            selected={arrayGetValue(['Oil and gas reservoirs', 'Saline aquifers'])}
            round={false}
            click={val => {
              setLegendToggle(prev => ({
                ...prev,
                [val]: !legendToggle[val]
              }))
            }}
          />
          <Legends 
            type={'category'}
            header={['CO2 sources', '2']}
            labels={data.types}
            colors={colors}
            selected={legendToggle.sources}
            round={true}
            click={val => { 
              setLegendToggle(
                !legendToggle.sources.includes(val)
                ? prev => ({ ...prev, sources: [...prev.sources, val] })
                : prev => ({ ...prev, sources: legendToggle.sources.filter(d => d !== val) })
              )
            }}
          />
          {regions.region === 'Europe' 
            ? <Legends 
              type={'category'}
              header={[`CO2 storage hubs`, '2']}
              labels={['Hubs']}
              colors={['symbol']}
              symbolColor={['#000']}
              selected={legendToggle.hubs ? ['Hubs'] : [] }
              round
              click={_ => {
                setLegendToggle(prev => ({
                  ...prev,
                  hubs: !legendToggle.hubs
                }))
              }}
            />
            : null
          }
          {regions.region === 'US' 
            ? <Legends 
              round
              type={'category'}
              header={['US projects']}
              labels={['Operating', 'Under development']}
              colors={['symbol', 'symbol']}
              symbolColor={["#0052e0", "#a7c7ff"]}
              selected={legendToggle.projects}
              click={val => {
                setLegendToggle(
                  !legendToggle.projects.includes(val)
                  ? prev => ({ ...prev, projects: [...prev.projects, val] })
                  : prev => ({ ...prev, projects: legendToggle.projects.filter(d => d !== val) })
                )
              }}
            />
            : null
          }
          {regions.region === 'US' 
            ? <Legends 
              type={'category'}
              header={['CO2 pipelines', '2']}
              labels={['Pipelines']}
              symbolColor={['#000']}
              colors={['line']}
              selected={legendToggle.pipelines ? ['Pipelines']:[]}
              click={_ => {
                setLegendToggle(prev => ({
                  ...prev,
                  pipelines: !legendToggle.pipelines
                }))
              }}
            />
            : null
          }
          <div className={classes.Introduction}>
            <p>
              * Click on legend to switch on/off layers<br/>
              * Zoom in to view CO<sub>2</sub> storage and plants<br/>
              {regions.region === 'US' ? '* Includes 50 US States and Puerto Rico': null}
            </p>
          </div>
        </Controls>
      </ControlContainer>
    </div>
  )
}