import React, { useEffect } from 'react'
import { colorsByVariables, getCountryPopupInfo, GRID_LAYERS, setGridColor } from './util'
import { useMap } from '../../../components/customHooks'

export default function({ data, time, interval, viewType }) {
	
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
	const { timeRange, tempData, type } = data;
	const { map, popUp, mapContainerRef } = useMap(config);


	useEffect(setDefaultStyle, [map]);
	useEffect(addGridData, [map]);
	
	function setDefaultStyle() {
		if (!map) return;
		let borders = ['solid', 'dotted']
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
		let layers = GRID_LAYERS;
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

	useEffect (() => {
		let currData = [];
		let currTimeIdx = timeRange.indexOf(time);
		if ( !map || currTimeIdx === -1  ) return;
		tempData.forEach(country => 
			currData.push({ ID: country.ISO3, value: parseFloat(country.data[currTimeIdx]) })
		);
		map.setPaintProperty( "shapes-0", "fill-color", colorsByVariables(currData, type, interval));

	},  [map, type, time, timeRange, tempData, interval]);


	// Toggle between Grid and Country view
	useEffect (() => {
		if(!map) return ;
		let type = viewType === 'country';
		let setVisibilty = view => view  ? 'visible' : 'none';
		map.setLayoutProperty("shapes-0", "visibility", setVisibilty(type))
		for (let i = 0; i <= 4; i++ ) {
			map.setLayoutProperty(`grid-${i}`, "visibility", setVisibilty(!type))
		}

	}, [map, viewType])

	
	// Mouse hover events
	useEffect (() => {
		if ( !map ) return;

		let layerType = viewType === 'country' 
			? { layerLength: 1, layer: 'shapes' } : { layerLength: 4, layer: 'grid' };	

		for (let i = 0; i <= layerType.layerLength; i++ ) {
			map
				.on('mousemove', `${layerType.layer}-${i}`, mouseOver)
				.on('mouseleave', `${layerType.layer}-${i}`, mouseLeave)
		}

		return () => {
			map.off('mousemove', 'shapes-0', mouseOver)
			map.off('mouseleave', 'shapes-0', mouseLeave)
		}
	})

	function mouseOver(e) {
		let mousePos = [e.lngLat.lng, e.lngLat.lat];
		let currTimeIdx = timeRange.indexOf(time);
		let selected = e.features[0].properties.ISO3;
		let value = viewType === 'country' 
			? getCountryPopupInfo(tempData, selected, currTimeIdx)
			: parseFloat(e.features[0].properties.val.toFixed(2));
		
		map
			.getCanvas().style.cursor = 'pointer';
		popUp   
			.setLngLat(mousePos)
			.setHTML(value)
			.addTo(map);
	}

	function mouseLeave() {
		map.getCanvas().style.cursor = '';
		popUp.remove();
	}

	return <div ref={mapContainerRef} className='map' />;
}