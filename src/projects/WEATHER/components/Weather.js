import React, { useEffect } from 'react'
import { colorsByVariables, getPopupInfo, getCentroidLabelByISO, disputedRegionsID, disputedRegionsISO } from './util'
import { useMap } from '../../../components/customHooks'

export default function({ 
	data, 
	mapType, 
	click,
	decimal,
	colType,
	unit,
	variable,
	month,
	gridURL,
 }) {
	
	const config = { 
		map: 'oecd',
		centroids: true,
		style: "mapbox://styles/iea/ckh4xd5wp0tzs19qt9ixaidvb",
		center: [0,30], 
		minZoom: 1.3,
		maxZoom: 5.5,
		maxBounds: [
      [-180, -74],
      [180, 84],
    ]
	};

	const { map, mapContainerRef, popUp } = useMap(config);

	useEffect(setDefaultStyle, [map]);
	function setDefaultStyle() {
		if (!map) return;
		const borders = ['solid', 'dotted'], layers = ['centroids-layer', 'label-layer'];
		
		// Set default border line color and width
		for ( let i in borders){
			let idx = parseInt(i) + 1;
			map
				.setPaintProperty( `${borders[i]}-${idx}`, "line-color",  '#404040')
				.setPaintProperty( `${borders[i]}-${idx}`, "line-width", [
					'interpolate',
					['exponential', 0.5],
					['zoom'],
					config.minZoom, 0.3,
					config.maxZoom, 0.4
				]);
		}

		// Remove all centroids for disputed regions
		for (let layer in layers) {
			map.setFilter(layers[layer], [ "all", 
				["match", ["get", "ISO3"], disputedRegionsISO, false, true],
				["match", ["id"], disputedRegionsID, false,true]
			])
		}
	}

	const addGridLayers = React.useCallback(e => {
		if (!map || mapType === 'territory') return;
			map
				.addSource(`grid-tiles`, {
					'type': 'image',
					'url': gridURL,
					'coordinates': [ [-180,85], [180, 85.06], [180, -85], [-180, -85.06] ]	
				})
				.addLayer({
					'id': `grid-layer`,
					'type': 'raster',
					'source': `grid-tiles`,
					'paint':{'raster-fade-duration': 0},
				}, 'shapes-0')

		return () => {
				map
					.removeLayer(`grid-layer`)
					.removeSource(`grid-tiles`)
		}
	},[map, mapType, gridURL])
	
	useEffect(addGridLayers, [map, mapType])
	
	useEffect(() => {
		if (!map || mapType === 'territory') return;
		map.getSource('grid-tiles').updateImage({
			'url': gridURL
		})
	},[map, mapType, gridURL, month, variable])


	// Toggle between Grid and Country view.
	useEffect (() => {
		if(!map) return ;
		let type = mapType === 'territory';
		let setVisibility = view => view  ? 'visible' : 'none';
		map
			.setLayoutProperty("shapes-0", "visibility", setVisibility(type))
			.setLayoutProperty("centroids-layer", "visibility", setVisibility(type))
			.setLayoutProperty("label-layer", "visibility", setVisibility(type))
	}, [map, mapType]);


	// Change country fill based on new variable data or selectedCountries.
	useEffect (() => {
		if (!map) return;
		map
			.setPaintProperty( "shapes-0", "fill-color", [
				'interpolate', ['exponential', 0.5], ['zoom'],
				2.4, colorsByVariables(data, colType, 'ISO3'),
				3, '#fff',
			])
			.setPaintProperty('centroids-layer', 'circle-radius', [
				'interpolate', ['exponential', 0.5], ['zoom'],
				2, 0,
				3, 12
			])
			.setPaintProperty( "centroids-layer", "circle-opacity", [
				'interpolate', ['exponential', 0.5], ['zoom'],
				2, 0, 
				3, 1
			])
			.setPaintProperty( "centroids-layer", "circle-stroke-opacity", [
				'interpolate', ['exponential', 0.5],
				['zoom'],
				2, 0,
				3, 1
			])
			.setPaintProperty( 'label-layer', "text-opacity", [
				'interpolate', ['exponential', 0.5],
				['zoom'],
				2, 0,
				3, 1
			])
			.setLayoutProperty('label-layer', 'text-size', [
				'interpolate', ['exponential', 0.5],
				['zoom'],
				2, 1,
				3, 14
			])
			.setPaintProperty('label-layer', "text-translate", [0,20])
			.setPaintProperty('label-layer', 'text-halo-color', "hsl(0, 0%, 100%)")
			.setPaintProperty('label-layer', 'text-halo-width', 1)
			.setLayoutProperty('label-layer', 'text-field', getCentroidLabelByISO(data))
			.setPaintProperty('centroids-layer', 'circle-color', colorsByVariables(data, colType, 'ISO3'))
			.setPaintProperty('centroids-layer', 'circle-stroke-color', '#000')
			.setPaintProperty('centroids-layer', 'circle-stroke-width', 1);

	}, [map, config.minZoom, config.maxZoom, data, colType])
	

	// Mouse hover events
	useEffect (() => {
		if ( !map ) return;
		map
			.on('mousemove', `shapes-0`, mouseOver)
			.on('mouseleave', `shapes-0`, mouseLeave)
			.on('click', `shapes-0`, mouseClick)
			.on('click', `centroids-layer`, mouseClick)
			.on('mousemove', `centroids-layer`, mouseOver)
			.on('mouseleave', `centroids-layer`, mouseLeave);
		return () => {
			map
				.off('mousemove', `shapes-0`, mouseOver)
				.off('mouseleave', `shapes-0`, mouseLeave)
				.off('click', `shapes-0`, mouseClick)
				.off('mousemove', `centroids-layer`, mouseOver)
				.off('mouseleave', `centroids-layer`, mouseLeave)
				.off('click', `centroids-layer`, mouseClick);
		}
	})

	function mouseClick(e) {
		let selected = e.features[0].properties.ISO3;
		click(selected)
	}

	function mouseOver(e) {
		let mousePos = [e.lngLat.lng, e.lngLat.lat];
		let selected = e.features[0].properties.ISO3;
		let value = getPopupInfo(data, selected, unit, decimal)
		let noPopup = ['ABCD', 'ABCDE', 'ABCD-PSE'];
		for (let i in noPopup) if (selected === noPopup[i]) return;

		map.getCanvas().style.cursor = 'pointer';
		popUp.addClassName('weather');
		popUp
			.setLngLat(mousePos)
			.setHTML(value)
			.addTo(map);
	}

	function mouseLeave() {
		map.getCanvas().style.cursor = ''
		popUp.remove();
	}

	return <div ref={mapContainerRef} className='map' />;
} 