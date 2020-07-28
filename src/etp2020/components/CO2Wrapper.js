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
  let colors = ['#F2F2F2', '#6f6f6f', '#1DBE62', '#FED324', '#E34946'];

  React.useEffect(() => {

    let types = region.region === 'China'
      ? ['Iron steel', 'Cement', 'Refining', 'Chemicals', 'Coal']
      : ['Iron steel', 'Cement', 'Refining', 'Chemicals', 'Power']
    
    let scale = region.region === 'China'
      ? 0.05
      : 0.7;

    let URL = [
      axios.get(`${props.baseURL}ETP2020/CO2/${region.region}_Saline.json`),
      axios.get(`${props.baseURL}ETP2020/CO2/${region.region}_emissions.csv`),
    ];

    axios.all(URL)
      .then(responses => {
        let tempData = Papa.parse(responses[1].data, { header: true }).data;
        let data = {
          heatmap: {
            'type': 'FeatureCollection',
            'features': []
          },
          location: responses[0].data,
          types: types,
          minMax: [
            Math.min(...tempData.map(d=> parseFloat(d.value))),
            Math.max(...tempData.map(d=> parseFloat(d.value))) * scale
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
          region={region.bounds}
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