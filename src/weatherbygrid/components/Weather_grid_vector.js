import React from 'react'
import { useGridMap } from '../../components/customHooks';


function WeatherByGrid_Vector() {
  const mapConfig = {
    center: [0.729,15.359],
    minZoom: 2.2,
    maxZoom: 4
  } 

  const layers = [
    {
      url: "mapbox://iea.cq9ld9rb", sourceLayer: "hdd_5_1-3cbp61"
    },
    {
      url: "mapbox://iea.598u8h3j", sourceLayer: "hdd_5_2-9oom4t"
    },
    {
      url: "mapbox://iea.9jr49vhf", sourceLayer: "hdd_5_3-dgyhg6"
    },
    {
      url: "mapbox://iea.2hb1cigo", sourceLayer: "hdd_5_4-5ug53j"
    },
    {
      url: "mapbox://iea.a6my9de2", sourceLayer: "hdd_5_5-cjeb0p"
    }
  ]

  const { map, popUp, mapContainerRef } = useGridMap({ mapConfig, layers });
  
  React.useEffect(() => {
    if(!map) return;
    for ( let i in layers ) {
      map
        .on('mousemove', `hdd-${i}`, function(e) {
          let mousePos = [e.lngLat.lng, e.lngLat.lat];
          while (Math.abs(e.lngLat.lng - mousePos[0]) > 180) {
              mousePos[0] += e.lngLat.lng > mousePos[0] ? 360 : -360;
          }
          let val = parseFloat(e.features[0].properties.val.toFixed(2))
          popUp
            .setLngLat(mousePos)
            .setHTML(val)
            .addTo(map);
        })
        .on('mouseleave', `hdd-${i}`, function() {
          map.getCanvas().style.cursor = '';
          popUp.remove();
        })
    }
  })
  return <div ref={mapContainerRef} className='map'/>
}

export default WeatherByGrid_Vector
