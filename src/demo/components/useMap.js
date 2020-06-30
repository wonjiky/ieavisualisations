import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import {ScatterplotLayer} from '@deck.gl/layers';
import {MapboxLayer} from '@deck.gl/mapbox';
import "mapbox-gl/dist/mapbox-gl.css";


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
export default ({ mapConfig }) => {

	const [map, setMap] = useState(null);
	const [popUp, setPopUp] = useState(null);
	const mapContainerRef = useRef(null);

	useEffect (() => {
		let mounted = true;
		if(!map) {
				
			const map = new mapboxgl.Map({
				container: mapContainerRef.current,
				style: "mapbox://styles/iea/ck9jt8mxx028m1ip9gih9yod6",
				center: mapConfig.center ? mapConfig.center : [0, 0],
				minZoom: mapConfig.minZoom ? mapConfig.minZoom : 0,
				maxZoom: mapConfig.maxZoom ? mapConfig.maxZoom : 22,
				maxBounds: mapConfig.maxBounds ? mapConfig.maxBounds : null,
      })
      
      // const myDeckLayer = new MapboxLayer({
      //   id: 'my-scatterplot',
      //   type: ScatterplotLayer,
      //   data: [
      //       {position: [0,0], size: 1000000}
      //   ],
      //   getPosition: d => d.position,
      //   getRadius: d => d.size,
      //   getColor: [255, 0, 0]
      // }); 
			
			map.on("load", () => {
        setMap(map);
        // map.addLayer(myDeckLayer);        
      });
    } 

		return () => {
      mounted = false;
      if(mounted) map.remove();
		}
	}, [])

	return {
			map,
      popUp,
			mapContainerRef
	}
            
}


