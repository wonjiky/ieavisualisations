import React from 'react'
import { useMap } from '../../../components/customHooks'

export default ({ data, regions, toggle }) => {
  
  const config = { 
		map: 'custom',
		style: "mapbox://styles/iea/ck9mv6pv834351ipiu0p02w80",
    maxZoom: 5,
    maxBounds: regions.bounds,
	}

  const { map, mapContainerRef } = useMap(config);

  React.useEffect(() => {
    if(!map) return;
    
    const colors = ['#B187EF', '#6f6f6f', '#3E7AD3', '#1DBE62', '#FF684D'];
    const { types, minMax, 'Oil and gas reservoirs': reservoirs, hubs, ...rest } = data;
    
    for ( let reservoir in reservoirs ) {
      map
        .addSource(`${regions.region}-Reservoir-${reservoir}`, {
          type: "vector", url: reservoirs[reservoir].url
        })
    }
    for ( let source in rest ) {
      map
        .addSource(`${regions.region}-${source}`, {
          'type': 'geojson',
          'data': rest[source]
        })
    }

    // ADD RESERVOIR LAYER
    for ( let reservoir in reservoirs ) {
      map
        .addLayer({
          'id': `${regions.region}-Rsv-${reservoir}`,
          'source': `${regions.region}-Reservoir-${reservoir}`,
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
        source: `${regions.region}-Saline aquifers`,
        layout: {
          visibility: 'visible'
        },
        paint: {
          'fill-pattern': 'aquifer-layer-01',
          'fill-opacity': {
            stops: [
              [4, 0.2],
              [5, 0.2]
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
        });
      
      map
        .addSource('US-projects', {
          'type': 'vector',
          'url': "mapbox://iea.8n47ko4s"
        })
        .addSource('US-pipelines', {
          'type': 'vector',
          'url': "mapbox://iea.2eoddisy"
        })
        .addLayer({
          'id': 'US-pipeline-layer',
          'source': 'US-pipelines',
          'source-layer': "US_CO2_pipelines-ctl6c0",
          'type': 'line',
          'paint': {
            'line-color': 'black',
            'line-width': 1.5,
            'line-opacity': {
              stops: [
                [3.6, 0],
                [5, 1]
              ]
            },
          },
          layout: {
            visibility: 'visible'
          },
        })
        .addLayer({
          'id': 'US-project-layer',
          'source': 'US-projects',
          'source-layer': "US_projects-4ru9cu",
          'type': 'circle',
          'paint': {
            'circle-radius': 8,
            'circle-color': [
              "match",
              ["get", "status"],
              ["Operating"],
              "#0044ff", "#49d3ff"
            ],
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
            }
          }
        })
        .addLayer({
          'id': 'US-project-layer2',
          'source': 'US-projects',
          'source-layer': "US_projects-4ru9cu",
          'type': 'circle',
          'paint': {
            'circle-radius': 4,
            'circle-color': '#fff',
            'circle-opacity': {
              stops: [
                [4.5, 0],
                [5, 1]
              ]
            },
          }
        });

    // ADD HEATMAP LAYER
    map
      .addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: `${regions.region}-heatmap`,
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
              [0, 0],
              [225, 1]
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
        source: `${regions.region}-heatmap`,
        paint: {
          'circle-radius': 3,
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
          .removeLayer(`${regions.region}-Rsv-${reservoir}`)
          .removeSource(`${regions.region}-Reservoir-${reservoir}`);
      }
      map
        .removeLayer('heatmap-circle')
        .removeLayer('heatmap-layer')
        .removeLayer('aquifer-layer')
        .removeLayer('EU-hubs')
        .removeLayer('EU-hubs2')
        .removeLayer('US-project-layer')
        .removeLayer('US-project-layer2')
        .removeLayer('US-pipeline-layer')
        .removeSource('EU-CO2-hubs')
        .removeSource('US-pipelines')
        .removeSource('US-projects')
        .removeSource(`${regions.region}-Saline aquifers`)
        .removeSource(`${regions.region}-heatmap`);
    }
    
  }, [map, regions.region, data]);

  React.useEffect(() => {
    if (!map) return;
    
    const { 
      "Oil and gas reservoirs": reservoir, 
      "Saline aquifers":aquifer, 
      pipelines, 
      hubs, 
      sources,
      projects 
    } = toggle;


    let projLen = projects.length < 1;
    let sourceLen = sources.length < 1;
    if (projLen || sourceLen) {
      map
        .setLayoutProperty('US-project-layer', 'visibility', projLen ? 'none' : 'visible')
        .setLayoutProperty('US-project-layer2', 'visibility', projLen ? 'none' : 'visible')
        .setLayoutProperty('heatmap-circle', 'visibility', sourceLen ? 'none' : 'visible')
        .setLayoutProperty('heatmap-layer', 'visibility', sourceLen ? 'none' : 'visible')
    } else {
      map
        .setLayoutProperty('US-project-layer', 'visibility', 'visible')
        .setLayoutProperty('US-project-layer2', 'visibility', 'visible')
        .setLayoutProperty('heatmap-circle', 'visibility', 'visible')
        .setLayoutProperty('heatmap-layer', 'visibility', 'visible')
        .setFilter('US-project-layer',[ 'match', ['get', 'status'], projects, true, false ])
        .setFilter('US-project-layer2',['match', ['get', 'status'], projects, true, false ])  
        .setFilter('heatmap-circle', ['match',['get', 'type'], sources, true, false])
        .setFilter('heatmap-layer', ['match', ['get', 'type'], sources, true, false])
    }

    map
      .setLayoutProperty('aquifer-layer', 'visibility', aquifer ? 'visible' : 'none')
      .setLayoutProperty('EU-hubs', 'visibility', hubs ? 'visible' : 'none')
      .setLayoutProperty('EU-hubs2', 'visibility', hubs ? 'visible' : 'none')
      .setLayoutProperty('US-pipeline-layer', 'visibility', pipelines ? 'visible' : 'none')
      
    for ( let rsv in data['Oil and gas reservoirs'] ) {
      map.setLayoutProperty(`${regions.region}-Rsv-${rsv}`, 'visibility', reservoir ? 'visible' : 'none');
    }
  }, [map, toggle, data, regions.region]);
  
  return <div ref={mapContainerRef} className='map' />
}