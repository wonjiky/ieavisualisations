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
        for ( let i in data ) {
          for ( let indicator in indicatorList ) {
            if ( data[i][indicatorList[indicator]] !== '0' ) {
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
          console.log(data[i])
          // indicators['heatmap'].features.push({
          //   'type': 'Feature',
          //   'geometry': { 
          //     type: 'Point',
          //     properties: {

          //     },
          //     coordinates:[ 
          //       parseFloat(data[i].LONGITUDE),
          //       parseFloat(data[i].LATITUDE)
          //     ]
          //   }
          // })
        }; 
        indicators.location = responses[0].data;
        // indicators.heatmap = 
        setData(indicators)
      })
  },[]);


  if ( !data ) return <div>Loading...</div>
  return (
    <CO2 
      data={data}
    />
  ) 
  
}