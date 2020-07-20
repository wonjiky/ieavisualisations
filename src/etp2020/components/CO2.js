import React from 'react'
import { useCO2Map } from '../../components/customHooks'

export default ({ data }) => {

  const mapConfig ={
    US: {
      maxBounds: [[-190, 10],[-40, 74]]
    }
  }

  const { map, popUp, mapContainerRef } = useCO2Map({ mapConfig: mapConfig.US });



  React.useEffect(() => {
    if(!map) return;
    
    const circleRadius = 2;
    let layerParams = {
      'location': {
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.8
        },
        type: 'fill',
      },
      'IRON STEEL': {
        paint: {
          'circle-color': 'yellow',
          'circle-radius': circleRadius
        },
        type: 'circle',
      },
      'CEMENT': {
        paint: {
          'circle-color': 'purple',
          'circle-radius': circleRadius
        },
        type: 'circle',
      },
      'REFINING': {
        paint: {
          'circle-color': 'blue',
          'circle-radius': circleRadius
        },
        type: 'circle',
      },
      'CHEMICALS': {
        paint: {
          'circle-color': 'orange',
          'circle-radius': circleRadius
        },
        type: 'circle',
      },
      'POWER': {
        paint: {
          'circle-color': 'red',
          'circle-radius': circleRadius
        },
        type: 'circle',
      }
    }

    for ( let source in data ) {
      map.addSource(source, {
        'type': 'geojson',
        'data': data[source]
      })
    }

    for ( let layer in layerParams ) {
      let l = layerParams[layer];
      map.addLayer({
        'id': `${layer}-layer`,
        'type': l.type,
        'source': layer,
        'paint': l.paint
      })
    }
    
  }, [map, data])
  
  return <div ref={mapContainerRef} className='map' />
}
