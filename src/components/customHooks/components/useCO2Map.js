import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import { dottedBorderA, dottedBorderB, solidBorder } from './util/useMapStyle';
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

export default ({ mapConfig }) => {

	const [map, setMap] = useState(null);
	const [popUp, setPopUp] = useState(null);
	const mapContainerRef = useRef(null);

	useEffect (() => {
		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: "mapbox://styles/iea/ckd8t01qv11hn1iqb8gg7a58w",
			center: [-103, 39],
			zoom: 4,
			minZoom: mapConfig.minZoom ? mapConfig.minZoom : 0,
			maxZoom: 5,
			// maxBounds: [[-180, 10],[-45, 74]]
		})
		
		const popUp = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});
		
		map.on("load", () => {
			const lineWidth = .3;
			const lineColor = 'black';
			const invertLineColor = 'white';
			setPopUp(popUp);
			setMap(map);

			// map
			// 	.addSource('borders', { 'type': 'vector', 'url': 'mapbox://mapbox.mapbox-streets-v8' })
			// 	.addSource('dottedborder', { 'type': 'vector', 'url': 'mapbox://iea.a4n5445m' })
			// 	.addLayer({
			// 		'id': 'solid-border',
			// 		'source':'borders',
			// 		'type': 'line',
			// 		'source-layer': 'admin',
			// 		'paint': {
			// 				'line-width': lineWidth,
			// 				'line-color': lineColor,
			// 		},
			// 		'filter': solidBorder.filter
			// 	})
			// 	.addLayer({
			// 		'id': 'dotted-border-A',
			// 		'source':'borders',
			// 		'type': 'line',
			// 		'source-layer': 'admin',
			// 		'paint': {
			// 				'line-width': lineWidth,
			// 				'line-color': invertLineColor,
			// 				'line-dasharray': dottedBorderA.lineDashArray
			// 		},
			// 		'filter': dottedBorderA.filter
			// 	})
			// 	.addLayer({
			// 		'id': 'dotted-border-B',
			// 		'source':'borders',
			// 		'type': 'line',
			// 		'source-layer': 'admin',
			// 		'paint': {
			// 				'line-width': lineWidth,
			// 				'line-color': lineColor,
			// 				'line-dasharray': dottedBorderA.lineDashArray
			// 		},
			// 		'filter': dottedBorderB.filter
			// 	})
			// 	.addLayer({
			// 		'id': 'dotted-border-oecd',
			// 		'source':'dottedborder',
			// 		'type': 'line',
			// 		'source-layer': 'dottedborder_1-a7o3op',
			// 		'paint': {
			// 				'line-width': lineWidth,
			// 				'line-color': invertLineColor,
			// 				'line-dasharray': dottedBorderA.lineDashArray
			// 		},
			// 		'filter':[
			// 			"match",
			// 			["get", "OBJECTID"],
			// 			[127],
			// 			true,
			// 			false
			// 		]
			// 	});
		});
		// return () =>  console.log('Map Remove') || map.remove();
	}, [])

	return {
			map,
			popUp,
			mapContainerRef
	}
            
}


