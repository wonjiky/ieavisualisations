import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useMap } from '../../components/customHooks';
import axios from 'axios';
import { 
    borderPoints, 
    getCountryColor, 
    countryShape, 
    getCountryInfo, 
    getBorderPointInfo,
    getBorderPointCountriesColor 
} from './util';

export default () => {
    
	const mapConfig = {
			center: [0, 0],
			minZoom: 4.1,
			maxZoom: 7,
			maxBounds: [[-15, 23],[50, 65]]
	}
	const { map, popUp, mapContainerRef } = useMap({ mapConfig });
	const colors = [ 'case', '#00CDB0', '#00B3C5', '#0076C0', '#0095CB', '#1355A3', 'red' ];
	const [data, setData] = useState({ borderPoints: null, countryShape: null });

	let baseURL = process.env.REACT_APP_DEV;
	if (process.env.NODE_ENV === 'production') baseURL = process.env.REACT_APP_PROD;
	useEffect(() => {
		axios.get(`${baseURL}flowdata.csv`)
		.then(response => {
			const results = Papa.parse(response.data, { header: true }),
			data = [...results.data];
			setData({ borderPoints: borderPoints(data), countryShape: countryShape(data) })
		})
	}, [baseURL])
		
	useEffect (() => {
		if(!map || !data) return;
		const { borderPoints, countryShape } = data;

		// Define border points buffer animation 
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
		};
        
		let borderpoints = {
			'type': 'FeatureCollection',
			'features': borderPoints.map((point, idx) => (
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

		map // Add images for border points buffer
			.addImage('borderPointsBuffer', borderPointsBuffer, { pixelRatio: 2 });
		
		map // Add source
			.addSource('border-points', {
					'type': 'geojson',
					'data': borderpoints
			});
		
		map // Add layers
			.addLayer({
					'id': 'border-point',
					'type': 'circle',
					'source': 'border-points',
					'paint': {
							'circle-radius': 4,
							'circle-color': 'yellow'
					}
			})
			.addLayer({
					'id': 'border-point-buffers',
					'type': 'symbol',
					'source': 'border-points',
					'layout': {
							'icon-image': 'borderPointsBuffer',
							'icon-size':[ "step", ["get", "totalValue"], 0.3, 20000, 0.5, 100000, 0.7, 200000, 1, ],
							'icon-allow-overlap': true
					}
			});

		let countries = [];
		countryShape.forEach(d => countries.push(d.ISO3))
		map
			.setFilter('country',[ "all", [ "match", ["get", "ISO3_CODE"], countries, true, false ]])
			.setPaintProperty('country', 'fill-color', getCountryColor(countryShape, colors));
	});


	useEffect (() => {
		if(!map) return;
		map
			.on('mousemove', 'country', function(e) {
				map.getCanvas().style.cursor = 'pointer';
				let mousePos = [e.lngLat.lng, e.lngLat.lat];
				let selected = e.features[0].properties.ISO3_CODE;
				while (Math.abs(e.lngLat.lng - mousePos[0]) > 180) {
					mousePos[0] += e.lngLat.lng > mousePos[0] ? 360 : -360;
				}
				popUp   
					.setLngLat(mousePos)
					.setHTML(getCountryInfo(data.countryShape, selected))
					.addTo(map);
			})
			.on('mouseleave', 'country', function() {
				map.getCanvas().style.cursor = '';
				popUp.remove();
			})
			.on('mousemove', 'border-point', function(e) {
				map.getCanvas().style.cursor = 'pointer';
				let coordinates = e.features[0].geometry.coordinates;
				let selected = e.features[0].properties;
				popUp.addClassName('borderpoint')
				popUp   
						.setLngLat(coordinates)
						.setHTML(getBorderPointInfo(selected))
						.addTo(map);
				if (e.features.length > 0) {
						map.setPaintProperty( "country", "fill-color", getBorderPointCountriesColor(e.features[0].properties.tx) );
				}
			})
			.on('mouseleave', 'border-point', function() {
				map.getCanvas().style.cursor = '';
				popUp.remove();
				map.setPaintProperty("country", "fill-color", getCountryColor(data.countryShape, colors)
				);
			});
	})
    
    return <div ref={mapContainerRef} className='map' />;
};