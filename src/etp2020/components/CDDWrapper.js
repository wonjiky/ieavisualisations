import React from 'react'
import { useGridMap } from '../../components/customHooks';


function WeatherByGrid_Vector() {
  const mapConfig = {
    center: [0.729,15.359],
    minZoom: 2.2,
    maxZoom: 4,
    style: "mapbox://styles/iea/ckdh6yknk0x0g1imq28egpctx"
  } 

  const layers = [
    {
      url: "mapbox://iea.ckhvxerv", sourceLayer: "cdd18_2018_1-9vvp9e"
    },
    {
      url: "mapbox://iea.csw70yvz", sourceLayer: "cdd18_2018_2-asamyi"
    },
    {
      url: "mapbox://iea.59ms6zyh", sourceLayer: "cdd18_2018_3-49tr8s"
    },
    {
      url: "mapbox://iea.dws1xk16", sourceLayer: "cdd18_2018_4-clkxsh"
    },
    {
      url: "mapbox://iea.2shoco9c", sourceLayer: "cdd18_2018_5-82u1z9"
    }
  ]

  const { map, popUp, mapContainerRef } = useGridMap({ mapConfig, layers });
  
  React.useEffect(() => {
    if(!map) return;
    for ( let i in layers ) {
      map
        .on('mousemove', `hdd-${i}`, function(e) {
          map.getCanvas().style.cursor = 'pointer';
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
