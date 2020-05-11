import React, { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import mapboxgl from "mapbox-gl";
import axios from 'axios';
import _ from 'lodash';
import { 
    borderPoints, 
    getCountryColor, 
    countryShape, 
    getCountryInfo, 
    getBorderPointInfo,
    getBorderPointCountriesColor } from './util';
import { mapComponent } from './MapComponent';

export default () => {
    const mapContainer = useRef(null); // Set ref for mapbox
    const [map, setMap] = useState(null); // Set state to store mapbox tile as map
    const [data, setData] = useState({ borderPoints: null, countryShape: null }) 
    
    // // Fetch flow data and parse
    let baseURL = process.env.REACT_APP_DEV;
    if (process.env.NODE_ENV === 'production') baseURL = process.env.REACT_APP_PROD;
    const url = `${baseURL}flowdata.csv`

    useEffect(() => {
        axios.get(`${url}`)
        .then(response => {
            const results = Papa.parse(response.data, { header: true }),
            data = [...results.data];
            setData({ borderPoints: borderPoints(data), countryShape: countryShape(data) })
        })
    }, [url])
    
    // If map doesn't exist, set state 'map' through mapComponent
    useEffect(() => {
        if (!map) mapComponent({ setMap, mapContainer, data });
    }, [map, data])

    useEffect(() => {
        if (map) {

            let borderPointPopup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'borderpoint'
            });

            let countryPopUp = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
            
            let hoverState = null;

            // TOOLTIP for Countries
            map.on('mousemove', 'country', function(e) {
                
                map.getCanvas().style.cursor = 'pointer';
                let mousePos = [e.lngLat.lng, e.lngLat.lat];
                let selected = e.features[0].properties.ISO3_CODE;
                
                while (Math.abs(e.lngLat.lng - mousePos[0]) > 180) {
                    mousePos[0] += e.lngLat.lng > mousePos[0] ? 360 : -360;
                }
                countryPopUp   
                    .setLngLat(mousePos)
                    .setHTML(getCountryInfo(data.countryShape, selected))
                    .addTo(map);
            });
                 
            map.on('mouseleave', 'country', function() {
                map.getCanvas().style.cursor = '';
                countryPopUp.remove();
            });

            // TOOLTIP for Borderpoints
            map.on('mousemove', 'border-point', function(e) {

                countryPopUp.remove();
                map.getCanvas().style.cursor = 'pointer';

                let coordinates = e.features[0].geometry.coordinates;
                let selected = e.features[0].properties;
                
                borderPointPopup   
                    .setLngLat(coordinates)
                    .setHTML(getBorderPointInfo(selected))
                    .addTo(map);

                if (e.features.length > 0) {
                    // let one = JSON.parse(e.features[0].properties.tx)[0].exit_ISO3;
                    // let two = JSON.parse(e.features[0].properties.tx)[0].entry_ISO3;
                    // hoverState=[one, two];
                    map.setPaintProperty(
                        "country",
                        "fill-color",
                        getBorderPointCountriesColor(e.features[0].properties.tx)
                    );
                }
            });
            
            map.on('mouseleave', 'border-point', function(e) {
                map.getCanvas().style.cursor = '';
                borderPointPopup.remove();
                map.setPaintProperty(
                    "country",
                    "fill-color",
                    getCountryColor(data.countryShape)
                );
            });
        }
    }, [map])

    return <div ref={mapContainer} className='map' />;
}