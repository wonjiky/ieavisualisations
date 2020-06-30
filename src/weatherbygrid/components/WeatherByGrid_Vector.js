import React from 'react'
import { useGridMap } from '../../components/customHooks';


function WeatherByGrid_Vector() {
  const mapConfig = {
    center: [155, 24],
    minZoom: 1.8,
    maxZoom: 4,
  } 
  const { map, popUp, mapContainerRef } = useGridMap({ mapConfig });
  
  React.useEffect(() => {
    if(!map) return;
    map
      .on('mousemove', 'hdd', function(e) {
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
      .on('mouseleave', 'hdd', function() {
        map.getCanvas().style.cursor = '';
        popUp.remove();
      })
  })
  return <div ref={mapContainerRef} className='map'/>
}

export default WeatherByGrid_Vector
