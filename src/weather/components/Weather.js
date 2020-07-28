import React, { useEffect } from 'react';
import { colorsByVariables, getCountryPopupInfo } from './util';
import { useMap } from '../../components/customHooks';

export default function({data, time, interval }) {
	
	const { timeRange, tempData, type } = data;
	const mapConfig = { center: [1, 1], minZoom: 1} //maxBounds: [[-179, -58],[179, 84]], };
	const { map, popUp, mapContainerRef } = useMap({mapConfig});


	useEffect (() => {
		let currData = [];
		let currTimeIdx = timeRange.indexOf(time);
		if ( !map || currTimeIdx === -1  ) return;
		tempData.forEach(country => 
			currData.push({ ID: country.ISO3, value: parseFloat(country.data[currTimeIdx]) })
		);
		map.setPaintProperty( "country", "fill-color", colorsByVariables(currData, type, interval));

	},  [map, type, time, timeRange, tempData, interval]);

	
	useEffect (() => {
		if ( !map ) return;
		map
			.on('mousemove', 'country', mouseOver)
			.on('mouseleave', 'country', mouseLeave)
		return () => {
			map.off('mousemove', 'country', mouseOver)
			map.off('mouseleave', 'country', mouseLeave)
		}
	})

	function mouseOver(e) {
		let currTimeIdx = timeRange.indexOf(time);
		let mousePos = [e.lngLat.lng, e.lngLat.lat];
		let selected = e.features[0].properties.ISO3_CODE;
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