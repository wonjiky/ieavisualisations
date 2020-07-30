import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CO2 from './CO2'
import { Controls, Control } from '../../components/controls'
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
  const colors = ['#F2F2F2', '#6f6f6f', '#1DBE62', '#FED324', '#E34946'];

  React.useEffect(() => {
    
    const URL = [
      axios.get(`${props.baseURL}ETP2020/CO2/${region.region}_Saline.json`),
      axios.get(`${props.baseURL}ETP2020/CO2/${region.region}_emissions.csv`),
    ];

    const regionParam = {
      US: {
        reservoirs: [
          { url: "mapbox://iea.14tgvncx", sourceLayer: "US_Reservoir_1-76ycw8" },
          { url: "mapbox://iea.1xmyhl9q", sourceLayer: "US_Reservoir_2-1l8efp" }
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
        <div className={classes.Legend}>
          {data.types.map((d, i) => (
            <div key={i} className={classes.LegendItem}>
              <div style={{background: `${colors[i]}`}}></div>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </Controls>
    </>
  )
}