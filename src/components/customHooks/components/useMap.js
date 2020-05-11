import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
export default ({ mapConfig }) => {

    const [map, setMap] = useState(null);
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
            
            map.on("load", () => {
                
                setMap(map);
                map
                    .addSource('countries-shape', {
                        'type': 'vector',
                        'url': 'mapbox://iea.c4nivi17'
                    })
                    .addLayer({
                        'id': 'country',
                        'source':'countries-shape',
                        'type': 'fill',
                        'source-layer':'countries_shape-6azfdp',
                        'paint': {
                            'fill-opacity': 1,
                        }
                    })
                    .addLayer({
                        'id': 'country-line',
                        'source':'countries-shape',
                        'type': 'line',
                        'source-layer':'countries_shape-6azfdp',
                        'paint': {
                            'line-width': .2,
                            'line-color': 'black',
                        }
                    });

            });
        }
        console.log(mounted)
        return () => {
            mounted = false;
            if(mounted) map.remove();
        }
    }, [])

    return {
        map,
        mapContainerRef
    }
            
}


