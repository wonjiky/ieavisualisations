import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import { dottedBorderA, dottedBorderB, solidBorder } from './util/useMapStyle';
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
export default ({ mapConfig, layers }) => {

	const [map, setMap] = useState(null);
	const [popUp, setPopUp] = useState(null);
	const mapContainerRef = useRef(null);

	useEffect (() => {
			const map = new mapboxgl.Map({
				container: mapContainerRef.current,
        style: "mapbox://styles/iea/ckas69pof1o2c1ioys10kqej6",
				center: mapConfig.center ? mapConfig.center : [0, 0],
				minZoom: mapConfig.minZoom ? mapConfig.minZoom : 0,
				maxZoom: mapConfig.maxZoom ? mapConfig.maxZoom : 22,
				maxBounds: mapConfig.maxBounds ? mapConfig.maxBounds : null,
			})

			let popUp = new mapboxgl.Popup({
				closeButton: false,
				closeOnClick: false
      });
			
			map.on("load", () => {
        const lineWidth = .3;
        const lineColor = 'black';
        const invertLineColor = 'white';
        setPopUp(popUp);
        setMap(map);
        // ['#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd']
        
        for ( let i in layers ) {
            map.addSource(`hdd-grid-${i}`, { type: "vector", url: layers[i].url });
        }

        for ( let i in layers) {
          map.addLayer({
            'id': `hdd-${i}`,
            'source': `hdd-grid-${i}`,
            'type': 'circle',
            'source-layer': layers[i].sourceLayer,
            'paint': {
              'circle-radius': 2.3,
              'circle-opacity': .3,
              'circle-color': [
                "step",
                ["get", "val"],
                "hsla(0, 0%, 8%, 0.5)",
                0,
                "#d53e4f",
                100,
                "#f46d43",
                300,
                "#fdae61",
                600,
                "#fee08b",
                1000,
                "#ffffbf",
                1400,
                "#e6f598",
                1600,
                "#abdda4",
                1800,
                "#66c2a5",
                2300,
                "#3288bd"
               ]
            }
          })
        }

        map
          .addSource('borders', { 'type': 'vector', 'url': 'mapbox://mapbox.mapbox-streets-v8' })
          .addSource('dottedborder', { 'type': 'vector', 'url': 'mapbox://iea.a4n5445m' });
        map
          .addLayer({
            'id': 'solid-border',
            'source':'borders',
            'type': 'line',
            'source-layer': 'admin',
            'paint': {
                'line-width': lineWidth,
                'line-color': lineColor,
            },
            'filter': solidBorder.filter
          })
          .addLayer({
            'id': 'dotted-border-A',
            'source':'borders',
            'type': 'line',
            'source-layer': 'admin',
            'paint': {
                'line-width': lineWidth,
                'line-color': invertLineColor,
                'line-dasharray': dottedBorderA.lineDashArray
            },
            'filter': dottedBorderA.filter
          })
          .addLayer({
            'id': 'dotted-border-B',
            'source':'borders',
            'type': 'line',
            'source-layer': 'admin',
            'paint': {
                'line-width': lineWidth,
                'line-color': lineColor,
                'line-dasharray': dottedBorderA.lineDashArray
            },
            'filter': dottedBorderB.filter
          })
          .addLayer({
            'id': 'dotted-border-oecd',
            'source':'dottedborder',
            'type': 'line',
            'source-layer': 'dottedborder_1-a7o3op',
            'paint': {
                'line-width': lineWidth,
                'line-color': invertLineColor,
                'line-dasharray': dottedBorderA.lineDashArray
            },
            'filter':[
              "match",
              ["get", "OBJECTID"],
              [127],
              true,
              false
            ]
          });
      });
      
      

	}, [])

	return {
			map,
			popUp,
			mapContainerRef
	}
            
}


