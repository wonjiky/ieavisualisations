import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MapContainer } from '../../../components/container'
import { ControlContainer, Controls, Control } from '../../../components/controls'
import { getCountryNameByISO, getMonthString, uppercase } from './util'
import variables from './assets/variables.json'
import Weather from './Weather'

export default function() {

	const [data, setData] = useState(null);
	const [countryData, setCountryData] = useState(null);
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [date, setDate] = useState({ day: 1, month: 8, year: 2011});
	const [variable, setVariable] = useState({id: 'Temperaturedaily', name: 'Temp latitude weighted'});
	const [mapType, setMapType] = useState('country');
	const [interval, setInterval] = useState('day');
	const [active, setActive] = useState({ open: false, target: null });

	let { day, month, year } = date;
	let joinedDate = `${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`;
	let query = interval === 'day' ? { date: joinedDate, variable: variable.id } 
		: interval === 'month' ? { month, year, variable: variable.id } 
		: { year, variable: variable.id };
	let mapQueryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
	// let countryQueryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
	let maxDay = new Date(year, month, 0).getDate();
	const hide = React.useCallback(() => {
    setActive({ open: false, target: null })
    document.removeEventListener('click', hide)
	}, [])

	React.useEffect(() => {
    if (!active.open) return;
    document.addEventListener('click', hide)
  },[ active.open, hide ])
	
	useEffect (() => {
		axios.get(`https://api.iea.org/weather/?${mapQueryString}`)
			.then(response => {
				const result = response.data.map(d => ({ ...d, name: getCountryNameByISO(d.country) }));
				if (response.data.length !== 0) {
					setData(result);
				} else {
					alert(`NO DATA FOR ${variable.name}`)
				}
			})
	}, [mapQueryString])


	function withIntervalLogic(entries) { return entries[['year', 'month', 'day'].findIndex(d => d === interval)] }

	const controls = {
		topleft: [
			{ 
				type: 'radio',
				options: ['Country','Grid'],
				selected: uppercase(mapType),
				dark: true,
				flow: 'row',
				click: value => 
					setMapType(value.toLowerCase()),
			},
			{
				type: 'dropdown',
				label: 'Variables',
				options: variables.map(d => d.name),
				selected: uppercase(variable.name),
				dark: true,
				top: true,
				flow: 'row',
				active: active,
				open: e => setActive({ open: true, target: e.target.value }),
				hide: e => hide(e),
				click: e => setVariable({
					id: variables.find(d => d.name === e).id,
					name: variables.find(d => d.name === e).name
				})
			}
		],
		bottomleft: [
			{ 
				type: 'radio',
				options: ['Year', 'Month', 'Day'],
				selected: uppercase(interval),
				dark: true,
				flow: 'row',
				click: value => 
					setInterval(value.toLowerCase())
			},
			{ 
				type: 'newslider',
				selected: uppercase(interval),
				dark: true,
				flow: 'row',
				// label: getDateLabel(date),
				label: withIntervalLogic([year, `${getMonthString(month)}, ${year}`, `${getMonthString(month)} ${day}, ${year}`]),
				value: withIntervalLogic([year, month, day]),
				min: withIntervalLogic([2000, 1, 1]),
				max: withIntervalLogic([ 2020, year === 2020 ? 8 : 12, maxDay ]),
				step: 1,
				change: e => setDate(interval !== 'day' 
					? { ...date, [interval] : Number(e.target.value), day: 1 }
					: { ...date, [interval] : Number(e.target.value) 
				})
			}
		]
	}


	return (
		<MapContainer selector={'Weather_Map'}>
			<Weather
				data={data}
				mapType={mapType}
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
					{controls.topleft.map((control, idx) => 
            <Control key={idx} {...control} /> )}
				</Controls>	
				<Controls
						column
						style={{
							bottom: '40px',
							left: '20px',
							padding: '0',
						}}
					> 
					{controls.bottomleft.map((control, idx) => 
            <Control key={idx} {...control} /> )}
				</Controls>	
			</ControlContainer>
		</MapContainer>
  )
};