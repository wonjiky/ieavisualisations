import React, { useEffect } from 'react'
import { disputedRegionsISO, disputedRegionsID } from '../../../components/customHooks/components/util/util'
import { useMap } from '../../../components/customHooks'
import { ETP_LAYERS } from './assets/EtpLayers'

function CDD({ 
  years,
  type,
  hdd,
  region,
  mapType,
  needFor,
}) {

  const config = {
    map: 'oecd',
		centroids: true,
		style: "mapbox://styles/iea/ckh4xd5wp0tzs19qt9ixaidvb",
		center: [0,30], 
		minZoom: 1.5,
		maxZoom: 5.5,
  } 
  const { map, mapContainerRef  } = useMap(config);

  useEffect(setDefaultStyle, [map]);
	function setDefaultStyle() {
		if (!map) return;
    const borders = ['solid-border', 'dotted-border'], layers = ['centroids-layer', 'label-layer'];
    
		for ( let i in borders){
			map
				.setPaintProperty( `${borders[i]}-layer`, "line-width", [
					'interpolate',
					['exponential', 0.5],
					['zoom'],
					config.minZoom, 0.5,
					config.maxZoom, 0.3
				]);
		}

		// Remove all centroids for disputed regions
		for (let layer in layers) {
			map.setFilter(layers[layer], [ "all", 
				["match", ["get", "ISO3"], disputedRegionsISO, false, true],
				["match", ["id"], disputedRegionsID, false,true]
			])
    }
    
    
    for (let i in ETP_LAYERS) {
      let tempSources = ETP_LAYERS[i].layers;
      let type = ETP_LAYERS[i];
      for ( let t in tempSources ) {
        map.addSource(`${type.data}-${t}`, { type: "vector", url: tempSources[t].url });  
      }
    }

    for ( let i in ETP_LAYERS[0].layers) {
      map
        .addLayer({
          id: `etp-region-${i}`,
          source: `${ETP_LAYERS[0].data}-${i}`,
          'source-layer': ETP_LAYERS[0].layers[i].sourceLayer,
          type: ETP_LAYERS[0].type,
          paint: {
            'line-color': 'black',
            'line-width': 0.7,
          }
        })
    }
  }
  
  	// Toggle between Grid and Country view.
	useEffect (() => {
    if(!map) return ;
		let type = mapType === 'service';
		let borders = ['solid-border', 'dotted-border'];
    let setVisibility = view => view  ? 'none' : 'visible';
		let borderColor =  '#000';

		for (let i in borders) {
			map.setPaintProperty( `${borders[i]}-layer`, "line-color", borderColor)
			map.setLayoutProperty( `${borders[i]}-layer`, "visibility", setVisibility(type))
    }
		map
			.setLayoutProperty("etp-region-0", "visibility", setVisibility(!type))
			.setLayoutProperty("shapes-layer", "visibility", setVisibility(type))
			.setLayoutProperty("centroids-layer", "visibility", setVisibility(type))
			.setLayoutProperty("label-layer", "visibility", setVisibility(type))
  }, [map, mapType]);
  



  
  // React.useEffect(addSourceLayers, [map]);
  
  // function addSourceLayers() {
  //   if(!map) return;
  //   for (let i in layers) {
  //     let tempSources = layers[i].layers;
  //     let type = layers[i];
  //     for ( let t in tempSources ) {
  //       map.addSource(`${type.data}-${t}`, { type: "vector", url: tempSources[t].url });  
  //     }
  //   }

  //   for ( let i in layers[0].layers) {
  //     map
  //     .addLayer({
  //       id: `etp-region-${i}`,
  //       source: `${layers[0].data}-${i}`,
  //       'source-layer': layers[0].layers[i].sourceLayer,
  //       type: layers[0].type,
  //       paint: {
  //         'line-color': 'black',
  //         'line-width': 0.7,
  //       }
  //     })
  //   }
  // }

  // React.useEffect(() => {
  //   if (!map) return;
  //   let all = ['Africa', 'Asia Pacific', 'Central & South America', 'Eurasia', 'Europe', 'Middle East', 'North America'];
  //   let coords = {
  //     'North America': {zoom: 2.7, center: [-120.133,55.728]},
  //     'Central & South America': {zoom: 2.6, center: [-64.401,-26.183]},
  //     'Africa': { zoom: 2.7, center: [15.744, 3]},
  //     'Eurasia': { zoom: 2.4, center: [95.941,58.163] },
  //     'Middle East': { zoom: 3.1, center: [43.204, 24.357]},
  //     'Asia Pacific': { zoom: 2.2, center: [110.760, 10.204] },
  //     'Europe': { zoom: 3, center: [17.374,56.708]},
  //   }
    
  //   if (region !== 'World') {
  //     map
  //       .setPaintProperty('etp-region-0', 'line-opacity', ['case',['match', ['get', 'Aggregated'], [region], true, false], 1, 0.1])
  //       .flyTo({
  //         center: coords[region].center,
  //         zoom: coords[region].zoom,
  //         essential: true 
  //       });

  //   } else {
  //     map
  //       .setPaintProperty('etp-region-0', 'line-opacity', ['case',['match', ['get', 'Aggregated'], all, true, false], 1, 0.1])
  //       .flyTo({
  //         center: [-35,42],
  //         zoom: 1.1,
  //         essential: true 
  //       });
  //   }
  // }, [map, region])
  
  return <div ref={mapContainerRef} className='map'/>
}

export default CDD;