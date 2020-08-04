import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CO2 from './CO2'
import { Controls, Control } from '../../components/controls'
import { Legends } from '../../components/legends'
import classes from './css/ETP.module.css'

export default props => {
  
  const regionBounds ={
    US: [[-190, 10],[-40, 74]],
    China: [[50, 9],[155, 55]],
    Europe : [[-33, 26],[64, 66]]
  };
  const [data, setData] = React.useState(null);
  const [active, setActive] = React.useState({ open: false, target: null });
  const [region, setRegion] = React.useState({region: 'US', bounds: regionBounds['US']});
  const regions = [ 'US', 'Europe', 'China' ];
  const colors = ['#F2F2F2', '#6f6f6f', '#3E7AD3', '#1DBE62', '#FF684D'];

  React.useEffect(() => {
    
    const URL = [
      axios.get(`${props.baseURL}ETP2020/CO2/${region.region}_Saline.json`),
      axios.get(`${props.baseURL}ETP2020/CO2/${region.region}_emissions.csv`),
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
          reservoirs: regionParam[region.region].reservoirs,
          location: responses[0].data,
          types: regionParam[region.region].types,
          minMax: [
            Math.min(...tempData.map(d=> parseFloat(d.value))),
            Math.max(...tempData.map(d=> parseFloat(d.value))) * regionParam[region.region].scale
          ]
        };
        console.log(
          Math.min(...tempData.map(d=> parseFloat(d.value))),
          Math.max(...tempData.map(d=> parseFloat(d.value)))
        )

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

        setData(data)
      })
  
  }, [
    props.baseURL, 
    region.region
  ]);

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
			options: regions,
			click: value => setRegion({region: value, bounds: regionBounds[value]}),
			open: e => open(e),
			hide: e => hide(e),
			active: active,
			selected: region.region
    }
  ]
  
  if ( !data ) return <div>Loading...</div>
  return (
    <>
      {regions.map((reg, key) => (
        region.region === reg ? <CO2
          key={key} 
          data={data}
          region={region}
        />
        : null
      ))}
      <Controls
        style={{
          flexFlow: 'column',
          top: '40px',
          paddingRight: '20px',
          paddingLeft: '20px',
          right: '40px',
        }}
      >
        {controls.map(control => 
					<Control key={control.label} {...control} /> )}
        <Legends 
          type={'category'}
          header={'CO2 Sources'}
          labels={data.types}
          colors={colors}
          round={true}
        />
        <Legends
          type={'category'}
          header={'Potential CO2 Storage'}
          labels={['Oil and Gas reservoirs', 'Saline aquifiers']}
          colors={['#ffe3a3', 'stripe']}
          round={false}
        />
        <Legends
          type={'continuous'}
          header={'CO2 Emission'}
          labels={['0','10']}
          colors={['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15']}
          round={false}
        />
      </Controls>
    </>
  )
}