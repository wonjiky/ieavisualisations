import React, { useEffect, useState } from 'react';
import { Slider } from '../../components/slider';
import { colorsByVariables, getCountryPopupInfo } from './util';
import { useMap } from '../../components/customHooks';
import classes from './css/Weather.module.css';

export default function({data, indicators, viewUnit, monthOfDayView, ...props}) {
	
	const { timeRange, tempData, type } = data;
	const mapConfig = { center: [1, 1], minZoom: 1} //maxBounds: [[-179, -58],[179, 84]], };
	const { map, popUp, mapContainerRef } = useMap({mapConfig});
	const [ time, setTime ] = useState(timeRange[timeRange.length-1])

	useEffect (() => {
		let currData = [];
		let currTimeIdx = timeRange.indexOf(time);
		if ( !map || currTimeIdx === -1  ) return;
		tempData.forEach(country => 
			currData.push({ ID: country.ISO3, value: parseFloat(country.data[currTimeIdx]) })
		);
		map.setPaintProperty( "country", "fill-color", colorsByVariables(currData, type, viewUnit));

	},  [map, type, time, timeRange, tempData, viewUnit]);


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

	const viewUnits = ['day', 'month'];
	let controls = null;
	
	if ( timeRange.length > 0 ) {
		controls =(
			<>
				<div className={classes.Slider}>
					<h1>{viewUnit === 'day' ? `${monthOfDayView}-${time}-2020` : time}</h1>
					<Slider 
						width={'100%'}
						height={10}
						margin={10}
						time={50}
						range={[0, timeRange.length - 1]}
						toggleChange={value => setTime(timeRange[value])}
					/>
				</div>
				<ul className={classes.SliderType}>
					{viewUnits.map(viewType =>
						<li 
							key={viewType}
							className={ viewUnit === viewType ? [classes.Options, classes.selected].join(' ') : classes.Options } 
							onClick={ _ =>
								 (time.substring(0,3) === 'Apr' && type === 'solar radiation') || (timeRange.length > 10 && type === 'solar radiation')
								 ? props.changeViewUnit(viewType) 
								 : alert('Data by day does not exist. Please select (April, Solar Radiation)') }> 
							{viewType}
							</li>
						)}
				</ul>
				<ul className={classes.Indicator}>
					{indicators.map((indicator, i) => 
						<li
							key={i}
							className={type === indicator ? [classes.Options, classes.selected].join(' ') : classes.Options }
							onClick={ _ =>
								timeRange.length > 10 && type === 'solar radiation'
								? alert('Please select by month') 
								: props.changeIndicator(indicator) } 
						> 
							{indicator}
						</li>
					)}
				</ul>
			</>
		)
	}

	return <div ref={mapContainerRef} className='map' />;
}