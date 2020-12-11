import React, { useEffect } from 'react'
import { disputedRegionsISO, disputedRegionsID } from '../../../components/customHooks/components/util/util'
import { getPopupInfo, colorsByVariables, countriesWithNoValue } from './assets/util'
import { useMap } from '../../../components/customHooks'
import { ETP_LAYERS } from './assets/EtpLayers'

function CDD({ 
  colors,
  mapData,
  mapType,
  minMax,
	region,
	currMain,
	currOverlay,
  click,
}) {
	
  const config = {
    map: 'oecd',
		centroids: true,
		style: "mapbox://styles/iea/ckh4xd5wp0tzs19qt9ixaidvb",
		center: [0,30], 
		minZoom: 1.5,
		maxZoom: 5.5,
  } 
  const { map, mapContainerRef, popUp  } = useMap(config);

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
		let isVisible = mapData.map(d => d.ISO);
		for (let layer in layers) {
			map.setFilter(layers[layer], [ "all", 
				["match", ["get", "ISO3"], disputedRegionsISO, false, true],
				["match", ["get", "ISO3"], isVisible, true, false],
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
	
	const addMainLayer = React.useCallback(e => {
		if (!map || mapType !== 'service') return;
		map
			.addSource(`grid-tiles`, {
				'type': 'image',
				'url': `${currMain}.png`,
				'coordinates': [ [-180,85], [180, 85.06], [180, -85], [-180, -85.06] ]	
			})
			.addLayer({
				'id': `grid-layer`,
				'type': 'raster',
				'source': `grid-tiles`,
				'paint':{'raster-fade-duration': 0},
			}, 'shapes-layer')
		return () => {
				map
					.removeLayer(`grid-layer`)
					.removeSource(`grid-tiles`)
		}
	},[map, mapType, currMain])
	useEffect(addMainLayer, [map, mapType])

	const addOverlayLayer = React.useCallback(_ => {
		let hasOverlay = currOverlay.substr(currOverlay.lastIndexOf("_")+1) === 'none';
		if (!map || mapType === 'territory' || hasOverlay) return;
			map
				.addSource(`grid-tiles-layer`, {
					'type': 'image',
					'url': `${currOverlay}.png`,
					'coordinates': [ [-180,85], [180, 85.06], [180, -85], [-180, -85.06] ]	
				})
				.addLayer({
					'id': `grid-layer-layer`,
					'type': 'raster',
					'source': `grid-tiles-layer`,
					'paint':{'raster-fade-duration': 0},
				}, 'shapes-layer')
		return () => {
				map
					.removeLayer(`grid-layer-layer`)
					.removeSource(`grid-tiles-layer`)
		}
	},[map, mapType, currOverlay])
	useEffect(addOverlayLayer, [map, mapType, currOverlay])

	useEffect(() => {
		if (!map || mapType !== 'service') return;
		map.getSource('grid-tiles').updateImage({ 'url': `${currMain}.png` })
	},[map, mapType, currMain])
  
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


  useEffect (() => {
    if (!map || mapType === 'service') return;
		
		let mapColors = colorsByVariables(mapData, minMax, colors);
		
		map
			.setPaintProperty( "shapes-layer", "fill-color", [
				'interpolate', ['exponential', 0.5], ['zoom'],
				2.3, mapColors,
				3, '#fff',
			])
			.setPaintProperty('centroids-layer', 'circle-radius', [
				'interpolate', ['exponential', 0.5], ['zoom'],
				2.2, 0,
				2.9, 16,
				3.1, 12,
			])
			.setPaintProperty( "centroids-layer", "circle-opacity", [
				'interpolate', ['exponential', 0.5], ['zoom'],
				2.3, 0, 
				3, 1
			])
			.setPaintProperty( "centroids-layer", "circle-stroke-opacity", [
				'interpolate', ['exponential', 0.5],
				['zoom'],
				2.3, 0,
				3, 1
			])
			.setPaintProperty( 'label-layer', "text-opacity", [
				'interpolate', ['exponential', 0.5],
				['zoom'],
				2.3, 0,
				3, 1
			])
			.setLayoutProperty('label-layer', 'text-size', [
				'interpolate', ['exponential', 0.5],
				['zoom'],
				2.3, 1,
				3, 16
			])
			.setPaintProperty('label-layer', "text-translate", [0,20])
			.setPaintProperty('label-layer', 'text-halo-color', "hsl(0, 0%, 100%)")
      .setPaintProperty('label-layer', 'text-halo-width', 1)
			.setLayoutProperty('label-layer', 'text-field', ["to-string", ["get", "region"]])
			.setPaintProperty('centroids-layer', 'circle-color', mapColors)
			.setPaintProperty('centroids-layer', 'circle-stroke-color', '#000')
			.setPaintProperty('centroids-layer', 'circle-stroke-width', 1);

	}, [map, mapType, mapData, minMax, colors])
  
  useEffect (() => {
		if ( !map ) return;
		map
			.on('mousemove', `shapes-layer`, mouseOver)
			.on('mouseleave', `shapes-layer`, mouseLeave)
			.on('click', `shapes-layer`, mouseClick)
			.on('click', `centroids-layer`, mouseClick)
			.on('mousemove', `centroids-layer`, mouseOver)
			.on('mouseleave', `centroids-layer`, mouseLeave);
		return () => {
			map
				.off('mousemove', `shapes-layer`, mouseOver)
				.off('mouseleave', `shapes-layer`, mouseLeave)
				.off('click', `shapes-layer`, mouseClick)
				.off('mousemove', `centroids-layer`, mouseOver)
				.off('mouseleave', `centroids-layer`, mouseLeave)
				.off('click', `centroids-layer`, mouseClick);
		}
	})

	function mouseClick(e) {
		let selected = e.features[0].properties.ISO3;
		let test = countriesWithNoValue.findIndex(d => d === selected)
		if (test === -1) click(selected)
	}

	function mouseOver(e) {
		let mousePos = [e.lngLat.lng, e.lngLat.lat];
		let selected = e.features[0].properties.ISO3;
    let value = getPopupInfo(mapData, selected)
		let noPopup = ['ABCD', 'ABCDE', 'ABCD-PSE'];
		for (let i in noPopup) if (selected === noPopup[i]) return;

		map.getCanvas().style.cursor = 'pointer';
		popUp
			.addClassName('weather');
		popUp
			.setLngLat(mousePos)
			.setHTML(value)
			.addTo(map);
	}

	function mouseLeave() {
		map.getCanvas().style.cursor = ''
		popUp.remove();
	}

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
    
    if (region !== 'World') {
      map
        .setPaintProperty('etp-region-0', 'line-opacity', ['case',['match', ['get', 'region'], [region], true, false], 1, 0.5])
        .flyTo({
          center: coords[region].center,
          zoom: coords[region].zoom,
          essential: true 
        });

    } else {
      map
        .setPaintProperty('etp-region-0', 'line-opacity', ['case',['match', ['get', 'region'], all, true, false], 1, 0.3])
        .flyTo({
          center: [-35,42],
          zoom: 1.1,
          essential: true 
        });
    }
  }, [map, region])
  
  return <div ref={mapContainerRef} className='map'/>
}

export default CDD;