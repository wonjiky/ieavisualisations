import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { ETP_LAYERS } from './util/EtpLayers'
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
export default ({ mapConfig }) => {

	const [map, setMap] = useState(null);
	const [popUp, setPopUp] = useState(null);
	const mapContainerRef = useRef(null);

  useEffect (() => {
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapConfig.style,// ? mapConfig.style : "mapbox://styles/iea/ckas69pof1o2c1ioys10kqej6",
      center: mapConfig.center ? mapConfig.center : [0, 0],
      minZoom: mapConfig.minZoom ? mapConfig.minZoom : 0,
      maxZoom: mapConfig.maxZoom ? mapConfig.maxZoom : 22,
      maxBounds: mapConfig.maxBounds ? mapConfig.maxBounds : null,
    })

    const popUp = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    
    map.on("load", () => {
      setPopUp(popUp);
      setMap(map);

      for (let hdd_layers in ETP_LAYERS) {
        let tempLayers = ETP_LAYERS[hdd_layers].layers;
        let type = ETP_LAYERS[hdd_layers];
        for ( let layer in tempLayers ) {
          map.addSource(`${type.data}-${type.type}-${type.year}-${layer}`, { type: "vector", url: tempLayers[layer].url });  
        }
      }

      map.addSource('shape', { type: "vector", url:  "mapbox://iea.6etmm149" });  

    });
	}, [])

	return {
			map,
			popUp,
			mapContainerRef
	}
            
}


