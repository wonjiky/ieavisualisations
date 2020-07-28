import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CO2 from './CO2'
import { Controls, Control } from '../../components/controls'
import classes from './css/ETP.module.css'

export default props => {

  const [data, setData] = React.useState(null);
  const regions = [ 'US', 'Europe', 'China' ];
  const [active, setActive] = React.useState({ open: false, target: null });
  const [region, setRegion] = React.useState('US');
  let colors = ['#F2F2F2', '#6f6f6f', '#1DBE62', '#FED324', '#E34946'];

  React.useEffect(() => {

    let types = ['IRON STEEL', 'CEMENT', 'REFINING', 'CHEMICALS', 'POWER', 'heatmap'];
    let URL = [
      axios.get(`${props.baseURL}ETP2020/CO2/CO2_Storage.json`),
      axios.get(`${props.baseURL}ETP2020/CO2/CO2_USA_2017_GIS.csv`),
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
          types: types
        };

        function findType(el) {
          types.splice(5,1)
          for ( let type in types) {
            if ( el[types[type]] !== '0') {
              return types[type]
            }
          }
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
              value: parseInt(tempData[i].TOTAL_REPORTED_CO2_tCO2) || 0,
              type: findType(tempData[i]),
              facility: tempData[i].FACILITY_NAME
            }
          })
        };
         
        setData(data)
      })
  
  }, []);

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
			label: 'View by', 
			options: regions,
			click: value => setRegion(value),
			open: e => open(e),
			hide: e => hide(e),
			active: active,
			selected: region
    }
  ]
  
  if ( !data ) return <div>Loading...</div>
  return (
    <>
      <CO2 
        data={data}
        region={region}
      />
      <Controls
        style={{
          // width: '500px',
          flexFlow: 'column',
          bottom: '40px',
          paddingRight: '20px',
          paddingLeft: '20px',
          right: '40px',
        }}
      >
        {controls.map(control => 
					<Control key={control.label} {...control} /> )}
        <div className={classes.Legend}>
          {data.types.map((d, i) => console.log(i) || (
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