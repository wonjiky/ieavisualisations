import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CO2 from './CO2'
import { Controls, Control } from '../../components/controls'
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
  const [legendToggle, setLegendToggle] = React.useState({ reservoir: true, hubs: false, aquifer: true, sources: [] });
  const regionArr = [ 'US', 'Europe', 'China' ];
  const colors = ['#F2F2F2', '#6f6f6f', '#3E7AD3', '#1DBE62', '#FF684D'];

  React.useEffect(() => {
    const{ region, bounds }= regions;
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

	function hide(e) {
		if(e && e.relatedTarget) e.relatedTarget.click();
		setActive({ open: false, target: null })
	}

  let controls = [
		{ 
			id: 1,
			type: 'dropdown',
			label: 'Regions', 
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

  // function pipelineToggle(storages) {
  //   let activeStorage = [];
  //   if ( storages.pipelines ) {
  //     activeStorage.push('Pipelines');
  //   } 
  //   return activeStorage;
  // }
  
  function hubsToggle(storages) {
    let activeStorage = [];
    if ( storages.hubs ) {
      activeStorage.push('Hubs');
    }

    return activeStorage;
  }

  if ( !data ) return <div>Loading...</div>
  const maxVal = Math.max(...data.heatmap.features.map(d => parseFloat(d.properties.value))).toFixed(0);
  return (
    <>
      <CO2 
        data={data}
        toggle={legendToggle}
        regions={regions}
      />
      <Controls
        style={{
          flexFlow: 'column',
          top: '40px',
          paddingRight: '20px',
          paddingLeft: '20px',
          left: '40px',
        }}
      >
        {controls.map(control => <Control key={control.label} {...control} /> )}
        <Legends
          type={'continuous'}
          header={'CO2 emission (Mt/year)'}
          // labels={[0, `${`]}
          labels={[0, maxVal]}
          colors={['#ebad50', '#d29844', '#bb8439', '#a3702e', '#855720', '#704516', '#5a330c', '#442101']}
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
    </>
  )
}

        {/* {regions.region === 'US' 
          ? <Legends 
            type={'category'}
            header={`CO2 Pipelines`}
            labels={['Pipelines']}
            colors={['line']}
            selected={pipelineToggle(legendToggle)}
            round={true}
            click={_ => {
              setLegendToggle(prev => ({
                ...prev,
                pipelines: !legendToggle.pipelines
              }))
            }}
          />
          : null
        } */}