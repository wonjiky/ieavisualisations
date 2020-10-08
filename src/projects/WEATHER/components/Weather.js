import React, { useEffect } from 'react'
import { colorsByVariables, getCountryPopupInfo, GRID_LAYERS, setGridColor } from './util'
import { useMap } from '../../../components/customHooks'

export default function({ data, mapType, selectedCountry, click }) {
	
	const config = { 
		map: 'oecd',
		style: "mapbox://styles/iea/ckdh6yknk0x0g1imq28egpctx",
		center: [0,30], 
		minZoom: 1.3,
		maxZoom: 3,
		maxBounds: [
      [-180, -70],
      [180, 84],
    ]
	};

	const { map, mapContainerRef, popUp } = useMap(config);

	useEffect(setDefaultStyle, [map]);
	useEffect(addGridData, [map]);
	
	function setDefaultStyle() {
		if (!map) return;

		const borders = ['solid', 'dotted'];

		for ( let i in borders){
			let idx = parseInt(i) + 1;
			map
				.setPaintProperty( `${borders[i]}-${idx}`, "line-color", '#404040')
				.setPaintProperty( `${borders[i]}-${idx}`, "line-width", [
					'interpolate',
					['exponential', 0.5],
					['zoom'],
					config.minZoom, 0.3,
					config.maxZoom, 0.4
				]);
		}
	}

	function addGridData() {
		if (!map) return;

		const layers = GRID_LAYERS;
		
		for ( let i in layers ) {
      map.addSource(`hdd-grid-${i}`, { type: "vector", url: layers[i].url });
		}
		
    for ( let i in layers) {
      map.addLayer({
        'id': `grid-${i}`,
        'source': `hdd-grid-${i}`,
        'type': 'circle',
        'source-layer': layers[i].sourceLayer,
        'paint': {
          'circle-radius': [
            'interpolate',
            ['exponential', 0.5],
            ['zoom'],
            config.minZoom, 1.8,
            config.maxZoom, 2.6
          ],
          'circle-opacity': .8,
          'circle-color': setGridColor()
        }
      }, 'shapes-0')
    }
	}

	// Change country fill based on new variable data.
	useEffect (() => {
		if ( !map  ) return;
		map.setPaintProperty("shapes-0", "fill-color", colorsByVariables(data));
	},  [map, data]);


	// Toggle between Grid and Country view.
	useEffect (() => {
		if(!map) return ;
		let type = mapType === 'country';
		let setVisibility = view => view  ? 'visible' : 'none';
		map.setLayoutProperty("shapes-0", "visibility", setVisibility(type))
		for (let i = 0; i <= 4; i++ ) {
			map.setLayoutProperty(`grid-${i}`, "visibility", setVisibility(!type))
		}
	}, [map, mapType])

	// useEffect (() => {
	// 	if(!map || !selectedCountry) return;
	// 	map.setPaintProperty("shapes-0", "fill-opacity", ["match", ["get", "ISO3"], [selectedCountry], 0.5, 1])	
	// }, [map, selectedCountry])
	
	// Mouse hover events
	useEffect (() => {
		if ( !map ) return;
		let layerType = mapType === 'country' 
			? { layerLength: 1, layer: 'shapes' } : { layerLength: 4, layer: 'grid' };	

		for (let i = 0; i <= layerType.layerLength; i++ ) {
			map.on('mousemove', `${layerType.layer}-${i}`, mouseOver)
			map.on('mouseleave', `${layerType.layer}-${i}`, mouseLeave)
			map.on('click', `${layerType.layer}-${i}`, mouseClick)
		}
		
		return () => {
			for (let i = 0; i <= layerType.layerLength; i++ ) {
				map.off('mousemove', `${layerType.layer}-${i}`, mouseOver)
				map.off('mouseleave', `${layerType.layer}-${i}`, mouseLeave)
				map.off('click', `${layerType.layer}-${i}`, mouseClick)
			}
		}
	})

	function mouseClick(e) {
		let selected = e.features[0].properties.ISO3;
		click(selected)
		map.setPaintProperty("shapes-0", "fill-opacity", ["match", ["get", "ISO3"], [selected], 0.2, 1])	
	}

	function mouseOver(e) {
		let mousePos = [e.lngLat.lng, e.lngLat.lat];
		let selected = e.features[0].properties.ISO3;
		let value = mapType === 'country' 
			? getCountryPopupInfo(data, selected)
			: parseFloat(e.features[0].properties.val.toFixed(2));
		
		map
		// .setPaintProperty("shapes-0", "fill-opacity", ["match", ["get", "ISO3"], [selected], 0.5, 1])
		.getCanvas().style.cursor = 'pointer';
		popUp   
			.setLngLat(mousePos)
			.setHTML(value)
			.addTo(map);

	}

	function mouseLeave() {
		map
			// .setPaintProperty("shapes-0", "fill-opacity", 1)
			.getCanvas().style.cursor = ''
		popUp.remove();
	}

	return <div ref={mapContainerRef} className='map' />;
} 