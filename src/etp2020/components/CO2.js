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
          'fill-opacity': 0.3
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

    const colors = ['yellow', 'purple', 'blue', 'orange', 'red'];

    const { heatmap, location, ...rest } = data;
    for ( let source in rest ) {
      map.addSource(source, {
        'type': 'geojson',
        'data': data[source]
      })
    }
    map
      .addSource('heatmap', {
        'type': 'geojson',
        'data': heatmap
      })
      .addSource('location', {
        'type': 'geojson',
        'data': location
      })

    map
      .addLayer({
        id: 'location-layer',
        type: 'fill',
        source: 'location',
        paint: {
          'fill-color': 'white',
          'fill-opacity': 0.3
        }

      })
      .addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: 'heatmap',
        maxzoom: 5,
        paint: {
          // increase weight as diameter breast height increases
          'heatmap-weight': {
            property: 'value',
            type: 'exponential',
            stops: [
              [1, 0],
              [1000000, 1]
              // [15391540, 1]
            ]
          },
          // increase intensity as zoom level increases
          'heatmap-intensity': {
            stops: [
              [11, 1],
              [15, 3]
            ]
          },
          // assign color values be applied to points depending on their density
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(236,222,239,0)',
            0.2, 'rgb(208,209,230)',
            0.4, 'rgb(166,189,219)',
            0.6, 'rgb(103,169,207)',
            0.8, 'rgb(28,144,153)'
          ],
          // increase radius as zoom increases
          'heatmap-radius': {
            stops: [
              [3, 15],
              [5, 20]
            ]
          },
          // decrease opacity to transition into the circle layer
          'heatmap-opacity': {
            default: 1,
            stops: [
              [4, 1],
              [5, 0]
            ]
          },
        }
      })
      .addLayer({
        id: 'heatmap-circle',
        type: 'circle',
        source: 'heatmap',
        paint: {
          'circle-radius': 3,
          'circle-color': setColors(rest, colors),
          'circle-opacity': {
            stops: [
              [4.5, 0],
              [5, 1]
            ]
          }
        }
      });

    function setColors(type, colors) {
      colors.forEach((color, idx) => {
        let pos = (idx * 2);
		    colors.splice(pos, 0, ["match", ["get", "type"], [Object.keys(type)[idx]], true, false ])
      })
      colors.splice(0,0, 'case');
      colors.splice((colors.length * 2) + 1, 0, '#a3a3a3');
      return colors;
    }
    
  }, [map, data])
  
  return <div ref={mapContainerRef} className='map' />
}
