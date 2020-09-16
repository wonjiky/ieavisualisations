import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CO2 from './CO2'
import { Controls, Control } from '../../components/controls'
import { Legends } from '../../components/legends'
import { Wrapper, NewControls } from '../../components/newControls'
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
  const [legendToggle, setLegendToggle] = React.useState({ reservoir: true, hubs: false, aquifer: true, sources: [] });
  const regionArr = [ 'US', 'Europe', 'China' ];
  const colors = ['#F2F2F2', '#6f6f6f', '#3E7AD3', '#1DBE62', '#FF684D'];

  React.useEffect(() => {
    const{ region }= regions;

    const URL = [
      axios.get(`${props.baseURL}ETP2020/CO2/${region}_Saline.json`),
      axios.get(`${props.baseURL}ETP2020/CO2/${region}_emissions.csv`),
    ];

    const types =  ['Iron and steel', 'Cement', 'Fuel refining', 'Chemicals', 'Power'];
    const regionParam = {
      US: {
        reservoirs: [
          { url: "mapbox://iea.63h5unlk", sourceLayer: "US_Reservoir_1458-45y6ui" },
          { url: "mapbox://iea.733wblb1", sourceLayer: "US_Reservoir_23-b0hrl2" },
          { url: "mapbox://iea.092dk9uv", sourceLayer: "US_Reservoir_67-1u3cbn" },
          { url: "mapbox://iea.47kfi170", sourceLayer: "US_Reservoir_9101112-1x96uc" }
        ],
        types: types,
        scale: 1
      },
      Europe: {
        reservoirs: [{ url: "mapbox://iea.93t29jsi", sourceLayer: "Europe_Reservoir-2x3vs4" },],
        types: types,
        scale: 1
      },
      China: {
        reservoirs: [{ url: "mapbox://iea.0nkpwvw6", sourceLayer: "China_Reservoir-4sfg1q" },],
        types: types,
        scale: 0.5
      }
    }

    axios.all(URL)
      .then(responses => {
        let tempData = Papa.parse(responses[1].data, { header: true }).data;
        let data = {
          heatmap: {
            'type': 'FeatureCollection',
            'features': []
          },
          reservoirs: regionParam[regions.region].reservoirs,
          aquifer: responses[0].data,
          types: regionParam[regions.region].types,
          minMax: [
            Math.min(...tempData.map(d=> parseFloat(d.value))),
            Math.max(...tempData.map(d=> parseFloat(d.value))) * regionParam[region].scale
          ]
        };

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

        setLegendToggle({ reservoir: true, aquifer: true,  hubs: true, sources: regionParam[region].types })
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
			options: regionArr,
			click: value => setRegions({region: value, bounds: regionBounds[value]}),
			open: e => open(e),
			hide: e => hide(e),
			active: active,
			selected: regions.region
    }
  ]

  function storageToggle(storages) {
    let activeStorage = [];
    let { pipelines, sources, ...rest } = storages;
    for (let storage in rest) {
      if ( storage !== 'sources' && storages[storage] ) {
        let value = storage.substring(0,1) === 'a' ? 'Saline aquifers' : 'Oil and gas reservoirs';
        activeStorage.push(value);
      } 
    }
    return activeStorage;
  }

  function hubsToggle(storages) {
    let activeStorage = [];
    if ( storages.hubs ) {
      activeStorage.push('Hubs');
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
      <Controls
        style={{
          flexFlow: 'column',
          top: '20px',
          left: '20px',
          background:'none',
          padding: '0',
          width: '229px'
        }}
      >
        {controls.map((control, idx) => <Control key={idx} {...control} /> )}
      </Controls>
      <Controls
        style={{
          flexFlow: 'column',
          bottom: '35px',
          left: '20px',
          width: '229px'
        }}
      >
        <Legends
          type={'continuous'}
          header={'CO2 emission (Mt/year)'}
          labels={[0, 225]}
          colors={['#e3a850', '#da8142', '#d36337', '#ce5030', '#c21e1e', '#a02115', '#8a230f', '#78240a', '#522700']}
          round={false}
        />
        <Legends
          type={'category'}
          header={'Potential CO2 storage'}
          labels={['Oil and gas reservoirs', 'Saline aquifers']}
          colors={['#5b6162', 'stripe']}
          selected={storageToggle(legendToggle)}
          round={false}
          click={val => {
            let layer = val.substring(0,1) === 'O' ? 'reservoir' : 'aquifer';
            setLegendToggle(prev => ({
              ...prev,
              [layer]: !legendToggle[layer]
            }))
          }}
        />
        <Legends 
          type={'category'}
          header={'CO2 sources'}
          labels={data.types}
          colors={colors}
          selected={legendToggle.sources}
          round={true}
          click={val => { 
            if ( legendToggle.sources.length === 1 && val === legendToggle.sources[0] ){
              return;
            } else {
              setLegendToggle(
                !legendToggle.sources.includes(val)
                ? prev => ({ ...prev, sources: [...prev.sources, val] })
                : prev => ({ ...prev, sources: legendToggle.sources.filter(d => d !== val) })
              )
            }
          }}
        />
        {regions.region === 'Europe' 
          ? <Legends 
            type={'category'}
            header={`CO2 Hubs`}
            labels={['Hubs']}
            colors={['symbol']}
            selected={hubsToggle(legendToggle)}
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
        <div className={classes.Introduction}>
          <p>
            * Zoom in to view CO<sub>2</sub> storage and plants<br/>
            * Click on legend to switch on/off layers
          </p>
        </div>
      </Controls>
    </div>
  )
}