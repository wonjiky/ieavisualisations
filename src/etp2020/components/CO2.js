import React from 'react'
import { useCO2Map } from '../../components/customHooks'

export default ({ data, regions, toggle }) => {
  
  const { map, popUp, mapContainerRef } = useCO2Map({ mapConfig: { maxBounds: regions.bounds } });
  
  React.useEffect(() => {
    if(!map) return;
    const colors = ['#F2F2F2', '#6f6f6f', '#3E7AD3', '#1DBE62', '#FF684D'];
    const { region, bounds } = regions;
    const { types, minMax, reservoirs, hubs, ...rest } = data; //pipelines
    
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
            'fill-color': '#b1b2a8',
          }
        })
    }

    // ADD SALINE aquifer LAYER
    map
      .addLayer({
        id: 'aquifer-layer',
        type: 'fill',
        source: `${region}-aquifer`,
        layout: {
          visibility: 'visible'
        },
        paint: {
          'fill-pattern': 'aquifer-layer-01',
          'fill-opacity': {
            stops: [
              [4, 0.2],
              [5, 0.6]
            ]
          }
        }
      });
    
    map
      .addSource('EU-CO2-hubs', {
        'type': 'vector',
        'url': "mapbox://iea.a28h96yl"
      })
      .addLayer({
        'id': 'EU-hubs2',
        'source': 'EU-CO2-hubs',
        'source-layer': "Europe_hubs-7liayx",
        'type': 'circle',
        'paint': {
          'circle-radius': 10,
          'circle-color': 'black',
          'circle-opacity': {
            stops: [
              [4.5, 0],
              [5, .6]
            ]
          },
          'circle-stroke-color': 'white',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': {
            stops: [
              [4.5, 0],
              [5, 1]
            ]
          },
        },
        layout: {
          visibility: 'visible'
        },
      })
      .addLayer({
        'id': 'EU-hubs',
        'source': 'EU-CO2-hubs',
        'source-layer': "Europe_hubs-7liayx",
        'type': 'circle',
        'paint': {
          'circle-color': 'white',
          'circle-radius': 5,
          'circle-opacity': {
            stops: [
              [4.5, 0],
              [5, 1]
            ]
          },
        },
        layout: {
          visibility: 'visible'
        },
      })

    // ADD HEATMAP LAYER
    map
      .addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: `${region}-heatmap`,
        maxzoom: 5,
        paint: {
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            2,
            3,
            4,
            10
          ],
          'heatmap-weight': {
            property: 'value',
            type: 'exponential',
            stops: [
              [minMax[0], 0],
              [225, 1]
              // [minMax[1], 1]
            ]
          },
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            2,
            5,
            4,
            25
            ],
          // assign color values be applied to points depending on their density
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            .1,'#e3a850',
            .2,'#da8142',
            .3,'#d36337',
            .5,'#ce5030',
            .6,'#c21e1e',
            .7,'#a02115',
            .8,'#8a230f',
            .9,'#78240a',
            1,'#522700'
          ],
          // increase radius as zoom increases
          // 'heatmap-radius': {
          //   stops: [
          //     [3, 15],
          //     [5, 20]
          //   ]
          // },
          // decrease opacity to transition into the circle layer
          'heatmap-opacity': {
            default: 1,
            stops: [
              [4.5, 1],
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
              [5, 1]
            ]
          },
          'circle-stroke-color': 'black',
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
      map
        .removeLayer('heatmap-circle')
        .removeLayer('heatmap-layer')
        .removeLayer('aquifer-layer')
        .removeLayer('EU-hubs')
        .removeLayer('EU-hubs2')
        .removeSource('EU-CO2-hubs')
        .removeSource(`${region}-aquifer`)
        .removeSource(`${region}-heatmap`);
    }
  }, [map, regions, data]);

  React.useEffect(() => {
    if (!map) return;
    const { reservoir, aquifer, hubs, sources } = toggle;
    map
      .setLayoutProperty('aquifer-layer', 'visibility', aquifer ? 'visible' : 'none')
      .setLayoutProperty('EU-hubs', 'visibility', hubs ? 'visible' : 'none')
      .setLayoutProperty('EU-hubs2', 'visibility', hubs ? 'visible' : 'none')
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