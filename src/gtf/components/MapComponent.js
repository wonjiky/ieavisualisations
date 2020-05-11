import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getCountryColor } from "./util";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
export const mapComponent = ({ setMap, mapContainer, data }) => {
    const { borderPoints, countryShape } = data;
    const bounds = [[-15, 23],[50, 65]];

    const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/iea/ck9jt8mxx028m1ip9gih9yod6",
        center: [15, 50],
        minZoom: 4.1,
        maxZoom: 7,
        maxBounds: bounds
    });

    let size = 100;
    let borderPointsBuffer = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        
        // get rendering context for the map canvas when layer is added to the map
        onAdd() {
            let canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
        },

        // called once before every frame where the icon will be used
        render() {
            let duration = 1000;
            let t = (performance.now() % duration) / duration;
            let outerRadius = (size / 2) * t;
            let ctx = this.context;

            // draw outer circle
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.beginPath();
            ctx.arc( this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
            ctx.fillStyle =  'rgba(255,255,0,' + (1 - t) + ')';
            ctx.fill();
            
            // update this image's data with data from the canvas
            this.data = ctx.getImageData( 0, 0, this.width, this.height ).data;
            map.triggerRepaint();
            return true;
        }
    }
    
    if(borderPoints && countryShape) {
        
        let countries = [];
        countryShape.forEach(d => countries.push(d.ISO3))

        let borderpoints = {
            'type': 'FeatureCollection',
            'features': data.borderPoints.map((point, idx) => (
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [point.lonlat[0], point.lonlat[1]]
                    },
                    'id': idx,
                    'properties': {
                        ...point,
                        lonlat: point.lonlat,
                        totalValue: point.totalValue,
                        tx: point.tx
                    }
                }
            ))
        };

        map.on("load", () => {
            setMap(map);
            // Add Countries shape source and Layer
            map.addSource('countries-shape', {
                'type': 'vector',
                'url': 'mapbox://iea.c4nivi17'
            });

            map.addLayer({
                'id': 'country',
                'source':'countries-shape',
                'type': 'fill',
                'source-layer':'countries_shape-6azfdp',
                'filter': [
                    "all",
                    [
                      "match",
                      ["get", "ISO3_CODE"],
                      countries,
                      true,
                      false
                    ]
                  ],
                'paint': {
                    'fill-opacity': 1,
                    'fill-color': getCountryColor(countryShape),
                }
            });

            map.addLayer({
                'id': 'country-line',
                'source':'countries-shape',
                'type': 'line',
                'source-layer':'countries_shape-6azfdp',
                'filter': [
                    "all",
                    [
                      "match",
                      ["get", "ISO3_CODE"],
                      countries,
                      true,
                      false
                    ]
                  ],
                'paint': {
                    'line-width': .2,
                    'line-color': 'black',
                }
            });
        
            // Border points Source & Layer
            map.addImage('borderPointsBuffer', borderPointsBuffer, { pixelRatio: 2 });
            map.addSource('border-points', {
                'type': 'geojson',
                'data': borderpoints
            });
            map.addLayer({
                'id': 'border-point',
                'type': 'circle',
                'source': 'border-points',
                'paint': {
                    'circle-radius': 4,
                    'circle-color': 'yellow'
                }
            })
        
            // Draw image of buffer for border-points & add Layer
            map.addLayer({
                'id': 'border-point-buffers',
                'type': 'symbol',
                'source': 'border-points',
                'layout': {
                    'icon-image': 'borderPointsBuffer',
                    'icon-size':[
                        "step",
                        ["get", "totalValue"],
                        0.3,
                        20000,
                        0.5,
                        100000,
                        0.7,
                        200000,
                        1,
                    ],
                    'icon-allow-overlap': true
                }
            });
        });
    }

}

