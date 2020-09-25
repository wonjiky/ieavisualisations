import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

export default (mapConfig) => {
	const [map, setMap] = useState(null);
	const mapContainerRef = useRef(null);
	
	useEffect (() => {
		
		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: "mapbox://styles/iea/ck9mv6pv834351ipiu0p02w80",
			maxBounds: mapConfig,
			maxZoom: 5
		})
		
		map.on("load", () => {
			setMap(map);
			map.addControl(new mapboxgl.NavigationControl());
		});

	}, [])

	return { map, mapContainerRef }
            
}


