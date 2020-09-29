import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import { MapContainer } from '../../../components/container'
import { countryToIso3 as ISO } from '../../../global'
import { ControlContainer, Controls, Slider, Dropdown } from '../../../components/controls'
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
				function getData(data){
					return data.reduce((result, country) => {
						let iso =  ISO[country[0]];
						let duplicate = result.find(item => item.ISO3 === iso);
						if (!duplicate && iso) {
							result.push({ 
								country: country.splice(0,1)[0], 
								ISO3: iso,
								data: country
							});
						}
						return result;
					},[])
				}

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
	}, [URL, indicator, viewType])

	

  if (!data) return <div>Loading...</div>

	let currTime = `${time.substring(0,3)} 20${time.substring(4)}`;

	function open(e) {
		setActive({ open: true, target: e.target.value })
	}

	function hide(e) {
		if(e && e.relatedTarget) e.relatedTarget.click();
		setActive({ open: false, target: null })
	}

 
	return (
		<MapContainer>
			<Weather
				data={data}
				time={time}
				interval={interval}
				changeViewUnit={value => setInterval(value)}
			/>
			<ControlContainer>
				<Controls
						column
						style={{
							top: '20px',
							left: '20px',
							padding: '0',
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
					{/* <Dropdown 
						label={'Indicators'}
						options={INDICATOR_LIST}
						click={e => setIndicator(e)}
						selected={indicator}
						active={active}
						open={e => open(e)}
						hide={e => hide(e)}
					/> */}
					{/* <div>
						<button onClick={_ => toggleFullScreen()}>
							Hello
						</button>
					</div> */}
					{/* <Drop
					/> */}
					{/* <Dropdown 
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
					/> */}
					{/* <Slider
						height={10}
						label={'Time'}
						currTime={currTime}
						width={'100%'}
						time={50}
						range={[0, data.timeRange.length -1]}
						change={value => setTime(data.timeRange[value])}
					/> */}
					{/* {controls.map(control => 
						<Control key={control.label} {...control} /> )} */}
				</Controls>
			</ControlContainer>
		</MapContainer>
  )
};