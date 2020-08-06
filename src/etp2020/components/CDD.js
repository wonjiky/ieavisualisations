import React from 'react'
import { useEtpMap } from '../../components/customHooks';
import { ETP_LAYERS } from '../../components/customHooks/components/util/EtpLayers';

export default function({ layer }) {

  const mapConfig = {
    center: [0.729,15.359],
    minZoom: 2.2,
    maxZoom: 4,
    style: "mapbox://styles/iea/ckdh6yknk0x0g1imq28egpctx"
  } 

  const { map, popUp, mapContainerRef } = useEtpMap({ mapConfig });

  React.useEffect(() => {
    if(!map) return;
    
    const { data, year, type } = layer;
    for ( let l in layer.layers ) {
      map.addLayer({
        id: `LAYER-${data}-${type}-${year}-${l}`,
        source: `${data}-${type}-${year}-${l}`,
        'source-layer': layer.layers[l].sourceLayer,
        type: 'circle',
        paint: {
          'circle-radius': 3,
          'circle-color': 'red'
        }
      })  
    }

    return () => {
      for ( let l in layer.layers ) {
        map.removeLayer(`LAYER-${data}-${type}-${year}-${l}`)
      }
    }
  }, [map, layer])

  React.useEffect(() => {
    if(!map) return;
    map.addLayer({
      id: 'world-shape',
      source: 'shape',
      'source-layer': "World_map_by_Region-6plcrh",
      type: 'line',
      paint: {
        'line-color': '#fdf787',
        'line-width': 0.5,
        'line-dasharray': [2,4]
      }
    })
    return () => map.removeLayer('world-shape')
  }, [map, layer])
  

  return <div ref={mapContainerRef} className='map'/>
}



// map
    //   .on('mousemove', `hdd-${i}`, function(e) {
    //     map.getCanvas().style.cursor = 'pointer';
    //     let mousePos = [e.lngLat.lng, e.lngLat.lat];
    //     while (Math.abs(e.lngLat.lng - mousePos[0]) > 180) {
    //         mousePos[0] += e.lngLat.lng > mousePos[0] ? 360 : -360;
    //     }
    //     let val = parseFloat(e.features[0].properties.val.toFixed(2))
    //     popUp
    //       .setLngLat(mousePos)
    //       .setHTML(val)
    //       .addTo(map);
    //   })
    //   .on('mouseleave', `hdd-${i}`, function() {
    //     map.getCanvas().style.cursor = '';
    //     popUp.remove();
    //   })