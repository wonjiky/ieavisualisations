import React from 'react'
import { useEtpMap } from '../../components/customHooks';

export default function({ layer, overlay, population, years }) {

  const mapConfig = {
    center: [0.729,15.359],
    minZoom: 2,
    maxZoom: 4,
    style: "mapbox://styles/iea/ckdh6yknk0x0g1imq28egpctx"
  } 

  const { map, popUp, mapContainerRef } = useEtpMap({ mapConfig });

  React.useEffect(() => {
    if(!map) return;
    const { data, year, type, layers } = layer;

    for ( let l in layers ) {
      map.addLayer({
        id: `LAYER-${data}-${type}-${year}-${l}`,
        source: `${data}-${type}-${year}-${l}`,
        'source-layer': layers[l].sourceLayer,
        type: 'circle',
        paint: {
          'circle-opacity': .8,
          'circle-radius': 4,
          'circle-color': colorsByValues(data)
        },
      })  
    }

    map.addLayer({
      id: 'world-shape',
      source: 'shape',
      'source-layer': "World_map_by_Region-6plcrh",
      type: 'line',
      paint: {
        'line-color': 'black',
        'line-width': 0.7,
        // 'line-dasharray': [3,4]
      }
    })

    function colorsByValues(type) {
      const colorTypes = {
        CDD: {
          colors: ['#006837','#1a9850','#66bd63','#a6d96a', '#d9ef8b','#ffffbf', '#fee08b','#fdae61','#f46d43','#d73027','#a50026'],
          range: [0, 100, 200, 400, 600, 800, 1000, 1600, 2600, 3500, 6000]
        },
        HDD: {
          colors: ['#ffffe0', '#ccf0df', '#afdcd8', '#98c7d1', '#83b2c8', '#719cc0', '#5f87b7', '#4e72ad', '#3b5ea3', '#264a9a', '#003790'],
          range: [0, 30, 100, 200, 400, 800, 1000, 1600, 2600, 3500, 6000]
        }
      }
    
      let result = ["step", ["get","val"], "black"];
      for ( let i in colorTypes[type].colors ){
        let colorIdx = (Number(i) * 2) + 4, rangeIdx = (Number(i) * 2) + 3;
        result.splice(colorIdx, 0, colorTypes[type].colors[i])
        result.splice(rangeIdx, 0, colorTypes[type].range[i])
      }
      return result;
    }

    return () => {
      map.removeLayer('world-shape')
      for ( let l in layers ) {
        map.removeLayer(`LAYER-${data}-${type}-${year}-${l}`)
      }
    }
  }, [map, layer])

  React.useEffect(() => {
    if(!map) return;
    console.log(years);
    const { data, year, type, layers } = population;
    for (let i in layers) {
      map.addLayer({
        id: `LAYER-POP-${i}`,
        source: `${data}-${type}-${year}-${i}`,
        'source-layer': layers[i].sourceLayer,
        type: 'circle',
        layout: {
          visibility: 'none'
        },
        paint: {
          'circle-radius': 3,
          'circle-color': colorsByValues(years),
        }
      })
    }
    
    function colorsByValues(year) {
      const colorTypes = {
          colors: ['#006837','#1a9850','#66bd63','#a6d96a', '#d9ef8b','#ffffbf', '#fee08b','#fdae61','#f46d43','#d73027','#a50026'],
          range: [0, 100, 200, 400, 600, 800, 1000, 1600, 2600, 3500, 6000]
      }
    
      let result = ["step", ["get", year.toString()], "black"];
      for ( let i in colorTypes.colors ) {
        let colorIdx = (Number(i) * 2) + 4, rangeIdx = (Number(i) * 2) + 3;
        result.splice(colorIdx, 0, colorTypes.colors[i])
        result.splice(rangeIdx, 0, colorTypes.range[i])
      }
      return result;
    }

    return () => {
      for (let i in layers) {
        map.removeLayer(`LAYER-POP-${i}`)
      }
    }
  }, [map, population, years])

  React.useEffect(() => {
    if (!map) return;
    for ( let i = 0; i < 3; i ++ ) {
      map.setLayoutProperty(`LAYER-POP-${i}`, 'visibility', overlay === 'Population'  ? 'visible' : 'none');
    }
  }, [map, overlay]);
  

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