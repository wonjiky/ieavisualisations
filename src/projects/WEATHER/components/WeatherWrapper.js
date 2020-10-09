import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MapContainer } from '../../../components/container'
import { ControlContainer, Controls, Control } from '../../../components/controls'
import { getCountryNameByISO, getMonthString, uppercase, withIntervalLogic } from './util'
import { Modal } from '../../../components/modal'
import { Icon } from '../../../components/icons'
import variables from './assets/variables.json'
import Weather from './Weather'
import classes from './css/Weather.module.css'
import { findSubpowerFromText } from '../../../global'
import CountryInfo from './CountryInfo'
import { array } from 'prop-types'

export default function() {

	const [data, setData] = useState(null);
	const [countryData, setCountryData] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState([]);
	const [date, setDate] = useState({ day: 1, month: 8, year: 2011});
	const [variable, setVariable] = useState({id: 'Temperaturedaily', name: 'Temp latitude weighted'});
	const [mapType, setMapType] = useState('country');
	const [interval, setInterval] = useState('day');
	const [active, setActive] = useState({ open: false, target: null });
	const [openInfo, setOpenInfo] = useState(false);


	let { day, month, year } = date;
	let joinedDate = `${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`;
	let query = interval === 'day' ? { date: joinedDate, variable: variable.id } 
		: interval === 'month' ? { month, year, variable: variable.id } 
		: { year, variable: variable.id };
	
	let mapQueryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
	let maxDay = new Date(year, month, 0).getDate();

	let startDate = withIntervalLogic(['20000101', `${year}0101`, `${year}${month < 10 ? '0' : ''}${month}01` ], interval);
	let endDate = withIntervalLogic(['20200831', `${year}1231`, `${year}${month < 10 ? '0' : ''}${month}${maxDay}` ], interval);
	let countryQueryString = `${selectedCountry[0]}/?startDate=${startDate}&endDate=${endDate}`;

	const hide = React.useCallback((e) => {
		setActive({ open: false, target: null })
    document.removeEventListener('click', hide)
	}, [])

	React.useEffect(() => {
    if (!active.open && !openInfo) return;
    document.addEventListener('click', hide)
	},[ active.open, openInfo,  hide ])
	
	function getCountries(newArr, exist, value) {
		if (newArr.length === 0) {
			newArr.push(value);
		} else if (0 < newArr.length && newArr.length < 2) {
			if (!exist) newArr.splice(0,0, value) 
			else return newArr;
		} else {
			if (!exist) {
				newArr.pop()
				newArr.splice(0,0, value) 
			} else return;
		}
		return newArr;
	}

	const getSelectedCountries = value =>  {
		let newArr = [...selectedCountry];
		let exist = newArr.find(d => d === value);
		setSelectedCountry(getCountries(newArr, exist, value))
	}
	
	const fetchCountryData = React.useCallback((e) => {
		if(Object.keys(selectedCountry).length === 0) return;
		axios.get(`https://api.iea.org/weather/country/${countryQueryString}`)
			.then(response => {
				let data = [];
				let result = response.data[0][variable.id]
				result.forEach((d, idx) => data.push([idx+1,d]))

				let tempArr = [...countryData];
				let exist = tempArr
					.map(d => d[0])
					.find(t => t === selectedCountry[0]);
				setCountryData(getCountries(tempArr, exist, [selectedCountry[0], data]));
			})
	}, [selectedCountry, countryQueryString, variable.id, countryData])

	useEffect(fetchCountryData, [selectedCountry]);
	
	useEffect (() => {
		axios.get(`https://api.iea.org/weather/?${mapQueryString}`)
			.then(response => {
				const result = response.data.map(d => ({ ...d, name: getCountryNameByISO(d.country) }));
				if (response.data.length !== 0) {
					setData(result);
				} else {
					alert(`Data does not exist for this variable`)
				}
			})
	}, [mapQueryString])

	const controls = {
		topleft: [
			{ 
				type: 'slider',
				selected: uppercase(interval),
				label: withIntervalLogic([year, `${getMonthString(month)}, ${year}`, `${getMonthString(month)} ${day}, ${year}`], interval),
				value: withIntervalLogic([year, month, day], interval),
				min: withIntervalLogic([2000, 1, 1], interval),
				max: withIntervalLogic([ 2020, year === 2020 ? 8 : 12, maxDay ], interval),
				step: 1,
				change: e => setDate(interval !== 'day' 
					? { ...date, [interval] : Number(e.target.value), day: 1 }
					: { ...date, [interval] : Number(e.target.value) 
				})
			},
			{ 
				type: 'radio',
				options: ['Country','Grid'],
				selected: uppercase(mapType),
				flow: 'row',
				click: value => 
					setMapType(value.toLowerCase()),
			},
			{ 
				type: 'radio',
				options: ['Year', 'Month', 'Day'],
				selected: uppercase(interval),
				flow: 'row',
				click: value => 
					setInterval(value.toLowerCase())
			},
			{
				type: 'dropdown',
				label: 'Variables',
				info: true,
				options: variables,
				selected: uppercase(variable.name),
				active: active,
				open: e => setActive({ open: true, target: e.target.value }),
				click: e => setVariable({ id: e.id, name: e.name })
			},
		],
		// bottomLeft: [
		// 	{
		// 		type: 'dropdown',
		// 		label: 'Country',
		// 		options: !data ? [] : data.sort((a,b) => b.name - a.name),
		// 		info: true,
		// 		selected: !selectedCountry ? 'Please select' : getCountryNameByISO(selectedCountry),
		// 		bottom: true,
		// 		active: active,
		// 		open: e => setActive({ open: true, target: e.target.value }),
		// 		click: e => setSelectedCountry(selectedCountry.push(e.country))			
		// 	},
		// ]
	}

	return (
		<MapContainer selector={'Weather_Map'} loaded={data}>
			<Weather 
				data={data} 
				mapType={mapType} 
				selectedCountry={selectedCountry}
				click={getSelectedCountries}
			/>
			<ControlContainer dark bg>
				<Controls position= 'topLeft' style={{'width': '270px'}}> 
					{controls.topleft.map((control, idx) => 
            <Control key={idx} {...control} /> )}
				</Controls>
			</ControlContainer>
			<Icon type='help' dark={true} fill button={true} click={_ => setOpenInfo(!openInfo)} styles={classes.Help}/> 
			<Modal styles='full' open={openInfo} click={_ =>  setOpenInfo(!openInfo)} dark>
				<table>
					<thead>
						<tr>
							<th>Variable</th>
							<th>Description</th>
							<th>Unit</th>
						</tr>
					</thead>
					<tbody>
						{variables.map((variable, idx) =>
							<tr key={idx}>
								<td>{variable.name}</td>
								<td>{variable.info}</td>
								<td>{findSubpowerFromText(variable.unit, '2')}</td>
							</tr>
						)}
					</tbody>
				</table>
			</Modal>
			<CountryInfo 
				data={countryData}
				countries={selectedCountry}
				interval={interval}
				variable={variable}
				unit={variables.find(d => d.id === variable.id).unit}
				date={date}
			/>
		</MapContainer>
  )
};