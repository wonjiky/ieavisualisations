import React from 'react'
import { useCDDMap } from '../../components/customHooks'
import PropTypes from 'prop-types'

function CDD({ 
  years,
  mainOverlayLayer, 
  popLayer, 
  needLayer,
  overlayToggle,
  type,
  hdd,
  allLayers, 
  layers,
  selectedRegion,
}) {

  const mapConfig = {
    center: [0.729,15.359],
    minZoom: 2,
    maxZoom: 4,
    style: "mapbox://styles/iea/ckdh6yknk0x0g1imq28egpctx",
  } 

  const { map, popUp, mapContainerRef } = useCDDMap({ mapConfig });
  
  React.useEffect(() => {
    
    if(!map) return;
    // const { data, year, type, layers } = mainOverlayLayer;
    
    for ( let i in layers.layers ) {
      map.addLayer({
        id: `${layers.data}-${i}`,
        source: `${layers.data}-${layers.type}-${layers.year}-${i}`,
        'source-layer': layers.layers[i].sourceLayer,
        type: 'circle',
        paint: {
          'circle-opacity': 1,
          'circle-radius': {
            stops: [
              [2, 1.2],
              [4, 3]
            ]
          },
          'circle-color': 'black'
        },
      })
    }

    for ( let i in allLayers.layers ) {
      map.addLayer({
        id: `POP-${i}`,
        source: `${allLayers.data}-${allLayers.type}-${allLayers.year}-${i}`,
        'source-layer': allLayers.layers[i].sourceLayer,
        type: 'circle',
        layout: {
          visibility: 'none'
        },
        paint: {
          'circle-opacity': 1,
          'circle-radius': {
            stops: [
              [2, 1.2],
              [4, 3]
            ]
          },
          'circle-color': 'black'
        },
      })
    }
    
    // HDD &  CDD Layers
    // for ( let l in layers ) {
    //   map.addLayer({
    //     id: `LAYER-${data}-${type}-${year}-${l}`,
    //     source: `${data}-${type}-${year}-${l}`,
    //     'source-layer': layers[l].sourceLayer,
    //     type: 'circle',
    //     paint: {
    //       'circle-opacity': .9,
    //       'circle-radius': {
    //         stops: [
    //           [2, 1.2],
    //           [4, 3]
    //         ]
    //       },
    //       'circle-color': colorsByValues(data)
    //     },
    //   })  
    // }

    // // Population Layer
    // for (let i in popLayer.layers) {
    //   map.addLayer({
    //     id: `LAYER-POP-${year}-${i}`,
    //     source: `${popLayer.data}-${popLayer.type}-${popLayer.year}-${i}`,
    //     'source-layer': popLayer.layers[i].sourceLayer,
    //     type: 'circle',
    //     layout: {
    //       visibility: 'none'
    //     },
    //     paint: {
    //       'circle-radius': {
    //         stops: [
    //           [2, 1.2],
    //           [4, 3.5]
    //         ]
    //       },
    //       'circle-color': popColorsByValues(years),
    //     }
    //   })
    // }

    // for (let i in needLayer.layers) {
    //   map.addLayer({
    //     id: `LAYER-NEED-${i}`,
    //     source: `${needLayer.data}-${needLayer.type}-${needLayer.year}-${i}`,
    //     'source-layer': needLayer.layers[i].sourceLayer,
    //     type: 'circle',
    //     layout: {
    //       visibility: 'none'
    //     },
    //     paint: {
    //       'circle-radius': {
    //         stops: [
    //           [2, 1.2],
    //           [4, 3.5]
    //         ]
    //       },
    //       // 'circle-color': '#8aaaad',
    //       'circle-color': '#363636',
    //       'circle-opacity': 0.9,
    //       // 'circle-stroke-width': 0.5,
    //       // 'circle-stroke-color': color,
    //     }
    //   })
    // }
    
    // World Shape (Outline)
    map
      .addLayer({
        id: 'world-shape',
        source: 'shape',
        'source-layer': "World_map_by_Region-6plcrh",
        type: 'line',
        paint: {
          'line-color': 'black',
          // 'line-opacity': 1,
          'line-width': 0.7,
        }
      })

    // function popColorsByValues(year) {
    //   const colorTypes = {
    //       colors: ['#ffffe0', '#ededd3', '#dcdbc6', '#cacab9', '#b9b9ac', '#a9a8a0', '#989794', '#888787', '#78777b', '#686770', '#595864', '#4a4958', '#3b3b4d', '#2d2e42', '#1e2137', '#10142d', '#000023'],
    //       range: [0, 1000, 5000, 35000, 70000, 130000, 300000, 650000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000, 7000000, 8000000,]
    //   }
    
    //   let result = ["step", ["get", 'value'], "black"];
    //   for ( let i in colorTypes.colors ) {
    //     let colorIdx = (Number(i) * 2) + 4, rangeIdx = (Number(i) * 2) + 3;
    //     result.splice(colorIdx, 0, colorTypes.colors[i])
    //     result.splice(rangeIdx, 0, colorTypes.range[i])
    //   }
    //   return result;
    // }

    // function colorsByValues(type) {
    //   const colorTypes = {
    //     CDD: {
    //       colors: ['#008712', '#99b95e', '#b3c661', '#ccd45f', '#e5e25a', '#ffe06d', '#ffc42a', '#f1ac32', '#e4932f', '#d67a29', '#c96122', '#bb461a', '#b93326'],
          
    //       range: [0, 100, 180, 350, 700, 1500, 2600, 3400, 4200, 4600, 4800, 5000, 5200]
    //     },
    //     HDD: {
    //       colors: ['#ffffe0', '#ccf0df', '#afdcd8', '#98c7d1', '#83b2c8', '#719cc0', '#5f87b7', '#4e72ad', '#3b5ea3', '#264a9a', '#003790'],
    //       range: [0, 250, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]
    //     }
    //   }

    //   let result = ["step", ["get","val"], "black"];
    //   for ( let i in colorTypes[type].colors ){
    //     let colorIdx = (Number(i) * 2) + 4, rangeIdx = (Number(i) * 2) + 3;
    //     result.splice(colorIdx, 0, colorTypes[type].colors[i])
    //     result.splice(rangeIdx, 0, colorTypes[type].range[i])
    //   }
    //   return result;
    // }

    return () => {
      map.removeLayer('world-shape')
      
      // for ( let l in layers ) {
      //   map.removeLayer(`LAYER-${data}-${type}-${year}-${l}`)
      // }
      
      // for (let i in layers) {
      //   map.removeLayer(`LAYER-POP-${year}-${i}`)
      // }

      // for (let i in needLayer.layers) {
      //   map.removeLayer(`LAYER-NEED-${i}`)
      // }
    }
  // }, [map, popLayer, needLayer, mainOverlayLayer, allLayers, years])
  }, [map, allLayers]);

  React.useEffect(() => {
    if (!map) return;

    for ( let i = 0; i <= 4; i ++ ) {
      
      let layer = `LAYERS-${i}`, popLayer = `POP-${i}`;
      let year = years.toString().substring(2,4);
      let mainColor = years === 2019 ? `${hdd}_${year}` : `${hdd}_${type}_${year}`,  popColor = `POP_${years}`;
      let nf = hdd === 'HDD' ? 'NFH' : 'NFC', nfColor = years === 2019 ? `${nf}_${year}` : `${nf}_${type}_${year}`;

      if ( overlayToggle === 'Need of heating' || overlayToggle === 'Need of cooling' ) {
        map
          .setPaintProperty(layer, 'circle-opacity',["case", ["==", ["get", nfColor ], 
          nf === 'NFC' ? 0 : -1], 0.2, 1])
          .setLayoutProperty(popLayer, 'visibility', 'none');
      } 
      else if ( overlayToggle === 'Population') {
        map
          .setLayoutProperty(popLayer, 'visibility', 'visible')
          .setPaintProperty(popLayer, 'circle-color', popColors(popColor))
      } 
      else {
        map
          .setPaintProperty(layer, 'circle-opacity', ["case", ["==", ["get", mainColor ],0], 1, 1])
          .setPaintProperty(layer, 'circle-color', mainLayerColors(mainColor, hdd))
          .setLayoutProperty(popLayer, 'visibility', 'none');
      }
    }

    function mainLayerColors(valueType, hdd) {
      const colorTypes = {
        CDD: {
          colors: ['#008712', '#99b95e', '#b3c661', '#ccd45f', '#e5e25a', '#ffe06d', '#ffc42a', '#f1ac32', '#e4932f', '#d67a29', '#c96122', '#bb461a', '#b93326'],
          range: [0, 100, 180, 350, 700, 1500, 2600, 3400, 4200, 4600, 4800, 5000, 5200]
        },
        HDD: {
          colors: ['#ffffe0', '#ccf0df', '#afdcd8', '#98c7d1', '#83b2c8', '#719cc0', '#5f87b7', '#4e72ad', '#3b5ea3', '#264a9a', '#003790'],
          range: [0, 250, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]
        }
      }
      let result = ["step", ["get", valueType], "#363636"];
      for ( let i in colorTypes[hdd].colors ){
        let colorIdx = (Number(i) * 2) + 4, rangeIdx = (Number(i) * 2) + 3;
        result.splice(colorIdx, 0, colorTypes[hdd].colors[i])
        result.splice(rangeIdx, 0, colorTypes[hdd].range[i])
      }
      return result;
    }

    function popColors(valueType) {
      const colorScheme = {
          colors: ["#363636", '#ffffe0', '#ededd3', '#dcdbc6', '#cacab9', '#b9b9ac', '#a9a8a0', '#989794', '#888787', '#78777b', '#686770', '#595864', '#4a4958', '#3b3b4d', '#2d2e42', '#1e2137', '#10142d', '#000023'],
          range: [1, 10, 1000, 5000, 35000, 70000, 130000, 300000, 650000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000, 7000000, 8000000]
      }
      let result = ["step", ["get", valueType], "#363636"];
      for ( let i in colorScheme.colors ) {
        let colorIdx = (Number(i) * 2) + 4, rangeIdx = (Number(i) * 2) + 3;
        result.splice(colorIdx, 0, colorScheme.colors[i])
        result.splice(rangeIdx, 0, colorScheme.range[i])
      }
      return result;
    }

  },[map, type, hdd, overlayToggle, years])

  React.useEffect(() => {
    if (!map) return;

      // const { data, year, type, layers } = mainOverlayLayer;
      // for ( let i in layers ) {
      //   map.setPaintProperty(`LAYER-${data}-${type}-${year}-${i}`, 'circle-opacity', overlayToggle === 'Population'  ? 0.1 : 1);  
      // }  

      // for ( let i = 0; i < 3; i ++ ) {
      //   map.setLayoutProperty( `LAYER-POP-${years}-${i}`, 'visibility', overlayToggle === 'Population'  ? 'visible' : 'none');
      // }

      // for ( let i = 0; i < 1; i ++ ) {
      //   map.setLayoutProperty(`LAYER-NEED-${i}`, 'visibility', overlayToggle === 'Need of heating' || overlayToggle === 'Need of cooling'  ? 'visible' : 'none');
      // }

  }, [map, overlayToggle]);

  React.useEffect(() => {
    if (!map) return;
    let all = ['Africa', 'Asia Pacific', 'Central & South America', 'Eurasia', 'Europe', 'Middle East', 'North America'];

    let coords = {
      'North America': {zoom: 3, center: [-112.133,55.728]},
      'Central & South America': {zoom: 3.19, center: [-62.401,-21.183]},
      'Africa': { zoom: 3.39, center: [20.744, 0.649]},
      'Eurasia': { zoom: 3.18, center: [104.941,63.163] },
      'Middle East': { zoom: 4, center: [51.204, 24.357]},
      'Asia Pacific': { zoom: 2.78, center: [123.760, 10.204] },
      'Europe': { zoom: 3.7, center: [20.374,56.708]},
    }
    
    if (selectedRegion !== 'World') {
      map
        .setPaintProperty('world-shape', 'line-opacity', ['case',['match', ['get', 'Aggregated'], [selectedRegion], true, false], 1, 0.1])
        .flyTo({
          center: coords[selectedRegion].center,
          zoom: coords[selectedRegion].zoom,
          essential: true 
        });

    } else {
      map
        .setPaintProperty('world-shape', 'line-opacity', ['case',['match', ['get', 'Aggregated'], all, true, false], 1, 0.1])
        .flyTo({
          center: [-20,35],
          zoom: 2,
          essential: true 
        });
    }
  }, [map, selectedRegion])
  
  return <div ref={mapContainerRef} className='map'/>
}

export default CDD;

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