import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CO2 from './CO2'

export default props => {

  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    let URL = [
      axios.get('./ETP2020/CO2/CO2_Storage.geojson'),
      axios.get('./ETP2020/CO2/CO2_USA_2017_GIS.csv'),
    ];
    let indicatorList = ['IRON STEEL', 'CEMENT', 'REFINING', 'CHEMICALS', 'POWER', 'heatmap'];
    let indicators = indicatorList.reduce((acc, obj) => {
      acc[obj] = {
        'type': 'FeatureCollection',
        'features': []
      };
      return acc;
    },{})    
    axios.all(URL)
      .then(responses => {
        let data = Papa.parse(responses[1].data, { header: true }).data;

        function findType(el) {
          indicatorList.splice(5,1)
          for ( let indicator in indicatorList) {
            if ( el[indicatorList[indicator]] !== '0') {
              return indicatorList[indicator]
            }
          }
        }

        for ( let i in data ) {
          indicators['heatmap'].features.push({
            'type': 'Feature',
            'geometry': {
              'type': 'Point', 
              'coordinates': [
                parseFloat(data[i].LONGITUDE),
                parseFloat(data[i].LATITUDE)
              ]
            },
            'properties': {
              value: parseInt(data[i].TOTAL_REPORTED_CO2_tCO2) || 0,
              type: findType(data[i])
            }
          })
          for ( let indicator in indicatorList ) {
            if ( data[i][indicatorList[indicator]] !== '0' && indicatorList[indicator] !== 'heatmap') {
              indicators[indicatorList[indicator]].features.push({
                'type': 'Feature',
                'geometry': { 
                  type: 'Point', 
                  coordinates:[ 
                    parseFloat(data[i].LONGITUDE),
                    parseFloat(data[i].LATITUDE)
                  ]
                }
              })
          }}
        }; 
        indicators.location = responses[0].data;
        setData(indicators)
      })
  },[]);


  if ( !data ) return <div>Loading...</div>
  return <CO2 data={data}/>
}