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
  const [legendToggle, setLegendToggle] = React.useState({ reservoir: true, aquifier: true, sources: [] });
  const regionArr = [ 'US', 'Europe', 'China' ];
  const colors = ['#F2F2F2', '#6f6f6f', '#3E7AD3', '#1DBE62', '#FF684D'];

  React.useEffect(() => {
    
    const URL = [
      axios.get(`${props.baseURL}ETP2020/CO2/${regions.region}_Saline.json`),
      axios.get(`${props.baseURL}ETP2020/CO2/${regions.region}_emissions.csv`),
    ];

    const regionParam = {
      US: {
        reservoirs: [
          { url: "mapbox://iea.63h5unlk", sourceLayer: "US_Reservoir_1458-45y6ui" },
          { url: "mapbox://iea.733wblb1", sourceLayer: "US_Reservoir_23-b0hrl2" },
          { url: "mapbox://iea.092dk9uv", sourceLayer: "US_Reservoir_67-1u3cbn" },
          { url: "mapbox://iea.47kfi170", sourceLayer: "US_Reservoir_9101112-1x96uc" }
        ],
        scale: 0.7,
        types: ['Iron steel', 'Cement', 'Refining', 'Chemicals', 'Power'],
      },
      Europe: {
        reservoirs: [
          { url: "mapbox://iea.93t29jsi", sourceLayer: "Europe_Reservoir-2x3vs4" },
        ],
        scale: 0.7,
        types: ['Iron steel', 'Cement', 'Refining', 'Chemicals', 'Power'],
      },
      China: {
        reservoirs: [
          { url: "mapbox://iea.0nkpwvw6", sourceLayer: "China_Reservoir-4sfg1q" },
        ],
        scale: 0.05,
        types: ['Iron steel', 'Cement', 'Refining', 'Chemicals', 'Coal'],
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
          aquifier: responses[0].data,
          types: regionParam[regions.region].types,
          minMax: [
            Math.min(...tempData.map(d=> parseFloat(d.value))),
            Math.max(...tempData.map(d=> parseFloat(d.value))) * regionParam[regions.region].scale
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
        setLegendToggle({ reservoir: true, aquifier: true, sources: regionParam[regions.region].types })
        setData(data)
      })
  
  }, [ props.baseURL, regions.region ]);

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
    for (let storage in storages) {
      if ( storage !== 'sources' && storages[storage] ) {
        let value = storage.substring(0,1) === 'a' ? 'Saline aquifiers' : 'Oil and Gas reservoirs';
        activeStorage.push(value);
      } 
    }
    return activeStorage;
  }
  
  if ( !data ) return <div>Loading...</div>
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
        {controls.map(control => 
					<Control key={control.label} {...control} /> )}
        <Legends
          type={'continuous'}
          header={'CO2 Emission (Gt)'}
          labels={[0,Math.max(...data.heatmap.features.map(d => parseFloat(d.properties.value)))]}
          colors={['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15']}
          round={false}
        />
        <Legends
          type={'category'}
          toggle={legendToggle}
          header={'Potential CO2 Storage'}
          labels={['Oil and Gas reservoirs', 'Saline aquifiers']}
          colors={['#ffe3a3', 'stripe']}
          selected={storageToggle(legendToggle)}
          round={false}
          click={val => {
            let layer = val.substring(0,1) === 'O' ? 'reservoir' : 'aquifier';
            setLegendToggle(prev => ({
              ...prev,
              [layer]: !legendToggle[layer]
            }))
          }}
        />
        <Legends 
          type={'category'}
          toggle={legendToggle}
          header={'CO2 Sources'}
          labels={data.types}
          colors={colors}
          selected={legendToggle.sources}
          round={true}
          click={val => setLegendToggle(
            !legendToggle.sources.includes(val)
            ? prev => ({ ...prev, sources: [...prev.sources, val] })
            : prev => ({ ...prev, sources: legendToggle.sources.filter(d => d !== val) })
          )}
        />
        <div className={classes.Introduction}>
          <p>
            * Zoom in to view CO2 storage <br/>
            * Click on legend to toggle on/off layers
          </p>
        </div>
      </Controls>
    </>
  )
}