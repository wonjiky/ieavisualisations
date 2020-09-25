import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import { countryToIso3 as ISO } from '../../../global'
import { Controls, Slider, Dropdown } from '../../../components/controls'
import Weather from './Weather'

export default function(props) {

  const [data, setData] = useState(null);
	const [interval, setInterval] = useState('month');
	const [indicator, setIndicator] = useState('hdd');
	const [viewType, setViewType] = useState('country');
	const [time, setTime] = useState('Jun-20');
	const [active, setActive] = useState({ open: false, target: null });
	let month='Apr';
	const INDICATOR_LIST = [ 'hdd', 'cdd', 'solar radiation']; 
	let URL = `${props.baseURL}weather/country/${interval}/${indicator}.csv`;
	if ( interval === 'day') URL = `${props.baseURL}weather/country/day/solar radiation/${month}.csv`;
  
  useEffect (() => {
		if ( viewType !== 'country') return;
		axios.get(URL)
			.then(response => {
				
				const fetchResult = Papa.parse(response.data, { header: false }).data;
				console.log(URL);
				function getData(data){
					return data.reduce((result, country) => {
						let ws = country[0] === 'Western Sahara';
						let iso =  ISO[country[0]];
						let duplicate = result.find(item => item.ISO3 === iso);
				
						if (!duplicate && !ws && iso) {
							result.push({ 
								country: country.splice(0,1)[0], 
								ISO3: iso,
								data: country
							});
						}
						return result;
					},[])
				}

				// Get time range of data
				function getTimeRange() {
					let temp = [...fetchResult[0]],
					idx = temp.indexOf('country');
					temp.splice(idx, 1)
					return temp;
				}
				setData({
					tempData: getData(fetchResult),
					timeRange: getTimeRange(),
					type: indicator,
        })				
			})
	}, [URL, indicator, viewType, ISO])

	

  if (!data) return <div>Loading...</div>

	let currTime = `${time.substring(0,3)} 20${time.substring(4)}`;
	let controls = [
		{ 
			id: 1,
			type: 'dropdown',
			label: 'View by', 
			options: ['country', 'grid'],
			active: active,
			click: value => setViewType(value),
			open: e => open(e),
			hide: e => hide(e),
			selected: viewType
		},
		{ 
			id: 2, 
			type: 'dropdown',
			label: 'Indicators', 
			options: INDICATOR_LIST,
			active: active,
			click: value => setIndicator(value),
			open: e => open(e),
			hide: e => hide(e),
			selected: indicator,
		},
		{ 
			id: 3, 
			type: 'dropdown',
			label: 'Interval', 
			options: ['day', 'month'],
			active: active,
			click: value => {
				if((time.substring(0,3) === 'Apr' && indicator === 'solar radiation') 
				|| (data.timeRange.length > 10 && indicator === 'solar radiation')) {
						setInterval(value)
				} else {
				 alert('Data by day does not exist. Please select (April, Solar Radiation)')
				}
				
			},
			open: e => open(e),
			hide: e => hide(e),
			selected: interval
		},
		{
			id: 4,
			type: 'slider',
			label: 'Time',
			width: '100%',
			height: 10,
			currTime: currTime,
			time: 50,
			range: [0, data.timeRange.length - 1],
			change: value => setTime(data.timeRange[value])
		}
	];

	function open(e) {
		setActive({ open: true, target: e.target.value })
	}

	function hide(e) {
		if(e && e.relatedTarget) e.relatedTarget.click();
		setActive({ open: false, target: null })
	}

	return (
		<div className='container'>
			<Weather
				data={data}
				time={time}
				interval={interval}
				changeViewUnit={value => setInterval(value)}
			/>
			<Controls
				style={{
						width: '100%',
						bottom: '0',
				}}
			>
			<Dropdown 
				label={'View by'}
				options={['country', 'grid']}
				click={e => setViewType(e)}
				selected={viewType}
				active={active}
				open={e => open(e)}
				hide={e => hide(e)}
      />
			<Dropdown 
				label={'Indicators'}
				options={INDICATOR_LIST}
				click={e => setIndicator(e)}
				selected={indicator}
				active={active}
				open={e => open(e)}
				hide={e => hide(e)}
      />
			<Dropdown 
				label={'Interval'}
				options={['day', 'month']}
				click={value => {
					if((time.substring(0,3) === 'Apr' && indicator === 'solar radiation') 
					|| (data.timeRange.length > 10 && indicator === 'solar radiation')) {
							setInterval(value)
					} else {
					 alert('Data by day does not exist. Please select (April, Solar Radiation)')
					}}
				}
				selected={interval}
				active={active}
				open={e => open(e)}
				hide={e => hide(e)}
      />
			<Slider
				height={10}
        label={'Time'}
        currTime={currTime}
        width={'100%'}
        time={50}
        range={[0, data.timeRange.length -1]}
        change={value => setTime(data.timeRange[value])}
			/>
				
				{/* {controls.map(control => 
					<Control key={control.label} {...control} /> )} */}
			</Controls>
		</div>
  )
};