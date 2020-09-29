import React, { useEffect } from 'react'
import { colorsByVariables, getCountryPopupInfo } from './util'
import { useMap } from '../../../components/customHooks'

export default function({data, time, interval }) {
	
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

	useEffect(() => {
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
	}, [map, config.minZoom, config.maxZoom ])

	useEffect (() => {
		let currData = [];
		let currTimeIdx = timeRange.indexOf(time);
		if ( !map || currTimeIdx === -1  ) return;
		tempData.forEach(country => 
			currData.push({ ID: country.ISO3, value: parseFloat(country.data[currTimeIdx]) })
		);
		map.setPaintProperty( "shapes-0", "fill-color", colorsByVariables(currData, type, interval));

	},  [map, type, time, timeRange, tempData, interval]);

	
	useEffect (() => {
		if ( !map ) return;
		map
			.on('mousemove', 'shapes-0', mouseOver)
			.on('mouseleave', 'shapes-0', mouseLeave)
		return () => {
			map.off('mousemove', 'shapes-0', mouseOver)
			map.off('mouseleave', 'shapes-0', mouseLeave)
		}
	})

	function mouseOver(e) {
		let currTimeIdx = timeRange.indexOf(time);
		let mousePos = [e.lngLat.lng, e.lngLat.lat];
		let selected = e.features[0].properties.ISO3;
		map
			.getCanvas().style.cursor = 'pointer';
		popUp   
			.setLngLat(mousePos)
			.setHTML(getCountryPopupInfo(tempData, selected, currTimeIdx))
			.addTo(map);
	}

	function mouseLeave() {
		map.getCanvas().style.cursor = '';
		popUp.remove();
	}

	return <div ref={mapContainerRef} className='map' />;
}