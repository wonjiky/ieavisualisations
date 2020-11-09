import React from 'react'
import { useMap } from '../../../components/customHooks'

function CDD({ 
  years,
  type,
  hdd,
  layers,
  selectedRegion,
  needFor,
  // selectedPop,
}) {

  const config = {
    map: 'custom',
    style: "mapbox://styles/iea/ckh4xd5wp0tzs19qt9ixaidvb",
    center: [0.729,15.359],
    minZoom: 1.01,
    maxZoom: 4,
    custom: {
      sources: layers,
    }
  } 
  const { map, mapContainerRef  } = useMap(config);
  
  React.useEffect(addSourceLayers, [map]);
  
  function addSourceLayers() {
    if(!map) return;
    for (let i in layers) {
      let tempSources = layers[i].layers;
      let type = layers[i];
      for ( let t in tempSources ) {
        map.addSource(`${type.data}-${t}`, { type: "vector", url: tempSources[t].url });  
      }
    }

    for ( let i in layers[0].layers ) {
      map.addLayer({
        id: `${layers[0].data}-${i}`,
        source: `${layers[0].data}-${i}`,
        'source-layer': layers[0].layers[i].sourceLayer,
        type: layers[0].type,
        paint: {
          'circle-opacity': 1,
          'circle-radius': {
            stops: [
              [2, 1.2],
              [4, 4.2]
            ]
          },
        },
      })
    }

    for ( let i in layers[1].layers) {
      map
      .addLayer({
        id: `etp-region-${i}`,
        source: `${layers[1].data}-${i}`,
        'source-layer': layers[1].layers[i].sourceLayer,
        type: layers[1].type,
        paint: {
          'line-color': 'black',
          'line-width': 0.7,
        }
      })
    }
  }

  React.useEffect(() => {
    if (!map) return;

    for ( let i = 0; i <= 5; i ++ ) {
      
      let layer = `LAYERS-${i}`; //popLayer = `POP-${i}`;
      let year = years.toString().substring(2,4);
      let mainColor = years === 2019 ? `${hdd}_${year}` : `${hdd}_${type}_${year}`; //popColor = `POP_${years}`;
      let nf = hdd === 'HDD' ? 'NFH' : 'NFC', nfColor = years === 2019 ? `${nf}_${year}` : `${nf}_${type}_${year}`;

      if (needFor) {
        map
          .setPaintProperty(layer, 'circle-opacity',["case", ["==", ["get", nfColor ], nf === 'NFC' ? 0 : -1], 0.2, 1])
          .setPaintProperty(layer, 'circle-color', mainLayerColors(mainColor, hdd))
          // .setLayoutProperty(popLayer, 'visibility', 'none');
      } 
      // else if (selectedPop) {
      //   map
      //     .setLayoutProperty(popLayer, 'visibility', 'visible')
      //     .setPaintProperty(popLayer, 'circle-color', popColors(popColor))
      // } 
      else {
        map
          .setPaintProperty(layer, 'circle-opacity', ["case", ["==", ["get", mainColor ],0], 1, 1])
          .setPaintProperty(layer, 'circle-color', mainLayerColors(mainColor, hdd))
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

    // function popColors(valueType) {
    //   const colorScheme = {
    //       colors: ["#363636", '#ffffe0', '#ededd3', '#dcdbc6', '#cacab9', '#b9b9ac', '#a9a8a0', '#989794', '#888787', '#78777b', '#686770', '#595864', '#4a4958', '#3b3b4d', '#2d2e42', '#1e2137', '#10142d', '#000023'],
    //       range: [1, 10, 1000, 5000, 35000, 70000, 130000, 300000, 650000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000, 7000000, 8000000]
    //   }
    //   let result = ["step", ["get", valueType], "#363636"];
    //   for ( let i in colorScheme.colors ) {
    //     let colorIdx = (Number(i) * 2) + 4, rangeIdx = (Number(i) * 2) + 3;
    //     result.splice(colorIdx, 0, colorScheme.colors[i])
    //     result.splice(rangeIdx, 0, colorScheme.range[i])
    //   }
    //   return result;
    // }

  },[map, type, hdd, years, needFor])

  React.useEffect(() => {
    if (!map) return;
    let all = ['Africa', 'Asia Pacific', 'Central & South America', 'Eurasia', 'Europe', 'Middle East', 'North America'];
    let coords = {
      'North America': {zoom: 2.7, center: [-120.133,55.728]},
      'Central & South America': {zoom: 2.6, center: [-64.401,-26.183]},
      'Africa': { zoom: 2.7, center: [15.744, 3]},
      'Eurasia': { zoom: 2.4, center: [95.941,58.163] },
      'Middle East': { zoom: 3.1, center: [43.204, 24.357]},
      'Asia Pacific': { zoom: 2.2, center: [110.760, 10.204] },
      'Europe': { zoom: 3, center: [17.374,56.708]},
    }
    
    if (selectedRegion !== 'World') {
      map
        .setPaintProperty('etp-region-0', 'line-opacity', ['case',['match', ['get', 'Aggregated'], [selectedRegion], true, false], 1, 0.1])
        .flyTo({
          center: coords[selectedRegion].center,
          zoom: coords[selectedRegion].zoom,
          essential: true 
        });

    } else {
      map
        .setPaintProperty('etp-region-0', 'line-opacity', ['case',['match', ['get', 'Aggregated'], all, true, false], 1, 0.1])
        .flyTo({
          center: [-35,42],
          zoom: 1.1,
          essential: true 
        });
    }
  }, [map, selectedRegion])
  
  return <div ref={mapContainerRef} className='map'/>
}

export default CDD;