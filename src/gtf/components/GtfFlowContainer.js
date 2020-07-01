import React from 'react';
import Flowmap from './GtfFlowMap';
import Papa from 'papaparse';
import axios from 'axios';

export default function GTFContainer(props) {

  const [data, setData] = React.useState({ locations: [], flows: [] });
  const [loaded, setLoaded] = React.useState(false);
  const [viewState, setViewState] = React.useState({
    latitude: 40,
    longitude: 0,
    zoom: 2.3,
    minZoom: 3.5,
    maxZoom: 7,
    maxBounds: [[-15, 23],[50, 65]]
  });
  
  const colors = {
    // locationAreas:{
    //   normal: 'rgba(48,48,48,0.5)',
    //   highlighted: 'rgba(48,48,48,0.7)',
    // },
  }
	
  React.useEffect(() => {
    let calls = [
      axios.get(`${props.baseURL}gtf/flow.json`),
      axios.get(`${props.baseURL}gtf/places.csv`),
      axios.get(`${props.baseURL}gtf/Europe3.json`),
    ]
    axios.all(calls)
		.then(response => {
      let flows = [ ...response[0].data ];
      const locations = Papa.parse(response[1].data, { header:true }).data.map(d => ({...d, lon: +d.lon, lat: +d.lat }));
      let locationWithShape = response[2].data;

      locations.forEach(d => {
        if ( !d.ISO3 ) {
          locationWithShape.features.push({
            type: "Feature",
            properties: { name: d.name, lon: d.lon, lat: d.lat },
            geometry: { type:"Polygon", coordinates: []}
          })
        }
      })

      let result = locationWithShape.features.map(d => 
        ({ ...d, 
          properties: { 
            ISO3: d.properties.ISO3, 
            name: d.properties.name, 
            centroid: [parseFloat(d.properties.lon), parseFloat(d.properties.lat)] 
          }
        })
      );

      setData({
        locations: {type: 'FeatureCollection', features: result},
        flows: flows,
      });
      setLoaded(true);
		})
	}, [props.baseURL])

  if(loaded){
    return (
      <Flowmap 
        width='100vw' 
        height='100vh' 
        data={data}
        viewState={viewState} 
        colors={colors}
        onViewStateChange={({ viewState }) => setViewState(viewState)}/>
    )
  } else {
    return <div>Loading...</div>
  }
  
}
