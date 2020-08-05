import React from 'react'
// import mapboxgl from 'mapbox-gl';
import { useCO2Map } from '../../components/customHooks'

export default ({ data, regions, toggle }) => {
  const { map, popUp, mapContainerRef } = useCO2Map({ mapConfig: { maxBounds: regions.bounds } });
  
  React.useEffect(() => {
    if(!map) return;
    const colors = ['#F2F2F2', '#6f6f6f', '#3E7AD3', '#1DBE62', '#FF684D'];
    const { region, bounds } = regions;
    const { types, minMax, reservoirs, ...rest } = data;
    
    map.setMaxBounds(bounds);

    // ADDING SOURCES
    for ( let reservoir in reservoirs ) {
      map
        .addSource(`${region}-Reservoir-${reservoir}`, {
          type: "vector", url: reservoirs[reservoir].url
        })
    }

    for ( let source in rest ) {
      map
        .addSource(`${region}-${source}`, {
          'type': 'geojson',
          'data': rest[source]
        })
    }

    // ADD RESERVOIR LAYER
    for ( let reservoir in reservoirs ) {
      map
        .addLayer({
          'id': `${region}-Rsv-${reservoir}`,
          'source': `${region}-Reservoir-${reservoir}`,
          'source-layer': reservoirs[reservoir].sourceLayer,
          'type': 'fill',
          'paint': {
            'fill-color': '#ffe3a3',
            'fill-opacity': {
              stops: [
                [4, 0.6],
                [5, 0.2]
              ]
            }
          }
        })
    }

    // ADD SALINE AQUIFIER LAYER
    map
      .addLayer({
        id: 'aquifier-layer',
        type: 'fill',
        source: `${region}-aquifier`,
        layout: {
          visibility: 'visible'
        },
        paint: {
          'fill-pattern': 'pedestrian-polygon',
          'fill-opacity': {
            stops: [
              [4, 0.6],
              [5, 0.2]
            ]
          }
        }
      });

    // ADD HEATMAP LAYER
    map
      .addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: `${region}-heatmap`,
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
          // ['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15']
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, '#fee5d9',
            0.4, '#fcae91',
            0.6, '#fb6a4a',
            0.8, '#de2d26',
            1, '#a50f15'
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
        source: `${region}-heatmap`,
        paint: {
          'circle-radius': 4,
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
      });
    
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
      for ( let reservoir in reservoirs ) {
        map
          .removeLayer(`${region}-Rsv-${reservoir}`)
          .removeSource(`${region}-Reservoir-${reservoir}`);
      }
      map.removeLayer('heatmap-circle')
        .removeLayer('heatmap-layer')
        .removeLayer('aquifier-layer')
        .removeSource(`${region}-aquifier`)
        .removeSource(`${region}-heatmap`);
      
    }
  }, [map, regions, data]);

  React.useEffect(() => {
    if (!map) return;
    const { reservoir, aquifier, sources } = toggle;

    map
      .setLayoutProperty('aquifier-layer', 'visibility', aquifier ? 'visible' : 'none')
      .setFilter('heatmap-circle', [
        'match',
        ['get', 'type'],
        sources,
        true,
        false
      ])
      .setFilter('heatmap-layer', [
        'match',
        ['get', 'type'],
        sources,
        true,
        false
      ]);

    for ( let rsv in data.reservoirs ) {
      map.setLayoutProperty(`${regions.region}-Rsv-${rsv}`, 'visibility', reservoir ? 'visible' : 'none');
    }

    
  }, [map, toggle, data.reservoirs, regions.region]);
  
  return <div ref={mapContainerRef} className='map' />
}