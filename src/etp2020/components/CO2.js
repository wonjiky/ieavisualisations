import React from 'react'
// import mapboxgl from 'mapbox-gl';
import { useCO2Map } from '../../components/customHooks'

export default ({ data, region }) => {
  
  const { map, popUp, mapContainerRef } = useCO2Map({ mapConfig: { maxBounds: region.bounds } });
  React.useEffect(() => {
    if(!map) return;
    
    let colors = ['#F2F2F2', '#6f6f6f', '#1DBE62', '#FED324', '#E34946'];
    let { types, minMax, reservoirs, ...rest } = data;
    // let highlightColors = ['black','black','black','black','black'];
    // let canvas = map.getCanvasContainer();
    // let start, current, box;
    // if ( map.getSource(`${region.region}-${source}`))

    // Adding sources

    for ( let reservoir in reservoirs ) {
      map.addSource(`${region.region}-Reservoir-${reservoir}`, {
        type: "vector", url: reservoirs[reservoir].url
      })
    }

    for ( let source in rest ) {
      map.addSource(`${region.region}-${source}`, {
        'type': 'geojson',
        'data': rest[source]
      })
    }

    // Adding Layers

    for ( let reservoir in reservoirs ) {
      map.addLayer({
        'id': `${region.region}-OilGasRsv-${reservoir}`,
        'source': `${region.region}-Reservoir-${reservoir}`,
        'source-layer': reservoirs[reservoir].sourceLayer,
        'type': 'fill',
        'paint': {
          'fill-color': 'red'
        }
      })
    }
    
    map
      .addLayer({
        id: 'location-layer',
        type: 'fill',
        source: `${region.region}-location`,
        // source: 'location',
        paint: {
          'fill-pattern': 'pedestrian-polygon',
          'fill-opacity': 0.5
        }
      })
      .addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        // source: 'heatmap',
        source: `${region.region}-heatmap`,
        maxzoom: 5,
        paint: {
          // increase weight as diameter breast height increases
          'heatmap-weight': {
            property: 'value',
            type: 'exponential',
            stops: [
              [minMax[0], 0],
              [minMax[1], 1]
            ]
          },
          // increase intensity as zoom level increases
          'heatmap-intensity': {
            stops: [
              [11, 1],
              [15, 19]
            ]
          },
          // assign color values be applied to points depending on their density
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, 'rgb(208,209,230)',
            0.4, 'rgb(166,189,219)',
            0.6, 'rgb(104,243,148)',
            0.8, 'rgb(29,190,98)'
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
        // source: 'heatmap',
        source: `${region.region}-heatmap`,
        paint: {
          'circle-radius': 4.5,
          'circle-color': setColors(types, colors),
          'circle-opacity': {
            stops: [
              [4.5, 0],
              [5, 0.7]
            ]
          },
          'circle-stroke-color': 'white',
          'circle-stroke-width': .5,
          'circle-stroke-opacity': {
            stops: [
              [4.5, 0],
              [5, 1]
            ]
          },
        }
      })
    
    function setColors(type, colors) {
      colors.forEach((color, idx) => {
        let pos = (idx * 2);
		    colors.splice(pos, 0, ["match", ["get", "type"], [type[idx]], true, false ])
      })
      colors.splice(0,0, 'case');
      colors.splice((colors.length * 2) + 1, 0, '#a3a3a3');
      return colors;
    }
    
    return () => {
      console.log('source remove')
      map.removeLayer('heatmap-circle')
      map.removeLayer('heatmap-layer')
      map.removeLayer('location-layer')
      map.removeSource(`${region.region}-location`)
      map.removeSource(`${region.region}-heatmap`)
    }
  }, [map, region.region, data])
  
  return <div ref={mapContainerRef} className='map' />
}
