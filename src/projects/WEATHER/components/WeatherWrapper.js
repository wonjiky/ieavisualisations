import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MapContainer } from '../../../components/container'
import { ControlContainer, Controls, Control } from '../../../components/controls'
import { getCountryNameByISO, getMonthString, uppercase, withIntervalLogic, getCountryInfo } from './util'
import { Modal } from '../../../components/modal'
import { Icon } from '../../../components/icons'
import variables from './assets/variables.json'
import Weather from './Weather'
import classes from './css/Weather.module.css'
import { findSubpowerFromText } from '../../../global'
import CountryInfo from './CountryInfo'

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
	let maxDay = new Date(year, month, 0).getDate();
	let startDate = withIntervalLogic(['20000101', `${year}0101`, `${year}${month < 10 ? '0' : ''}${month}01` ], interval);
	let endDate = withIntervalLogic(['20200831', `${year}1231`, `${year}${month < 10 ? '0' : ''}${month}${maxDay}` ], interval);
	let mapQueryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
	let countryQueryString = `${selectedCountry.length >= 1 ? selectedCountry[0][0] : null}/?startDate=${startDate}&endDate=${endDate}&variable=${variable.id}`;
	let splineColors = [ '#727272', '#e6e6e6'];
	
	const hide = React.useCallback((e) => {
		setActive({ open: false, target: null })
    document.removeEventListener('click', hide)
	}, [])

	React.useEffect(() => {
    if (!active.open && !openInfo) return;
    document.addEventListener('click', hide)
	},[ active.open, openInfo,  hide ])
	
	function getSelectedCountries(value) {
		if (!getCountryNameByISO(value)) return;
		let newArr = [...selectedCountry];
		let hasCountry = newArr.find(d => d[0] === value);
		setSelectedCountry(getCountryInfo(newArr, hasCountry, value, splineColors));
	}
	
	const fetchCountryData = React.useCallback(() => {
		if(Object.keys(selectedCountry).length === 0) return;
		axios.get(`https://api.iea.org/weather/country/${countryQueryString}`)
			.then(response => {
				let result = response.data
				let tempArr = [...countryData];
				let hasCountry = tempArr
					.map(d =>  d[0][0])
					.find(t => t === selectedCountry[0][0]);
				setCountryData(getCountryInfo(tempArr, hasCountry, [selectedCountry[0][0], result], splineColors));
			})
	}, [selectedCountry, countryQueryString, countryData, splineColors]);
	
	useEffect(fetchCountryData, [selectedCountry, countryQueryString]);

	useEffect(() => {
		axios.get(`https://api.iea.org/weather/?${mapQueryString}`)
			.then(response => {
				const result = response.data.map(d => ({ ...d, name: getCountryNameByISO(d.country) }));
				if (response.data.length !== 0) {
					setData(result);
				} else alert(`Data does not exist for this variable`)
			})
	}, [mapQueryString]);


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
				click: value => {
					setMapType(value.toLowerCase())
					setCountryData([])
					setSelectedCountry([])
				}
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
		]
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
				<Table body={variables} head={['Variable', 'Description', 'Unit']} />
			</Modal>
			<CountryInfo 
				data={countryData}
				mapType={mapType}
				countries={selectedCountry}
				unit={variables.find(d => d.id === variable.id).unit}
				click={e => {
					// let idx =  selectedCountry.findIndex(d => d[0] === e)
					let idx =  countryData.findIndex(d => d[0][0] === e)
					// let temp = countryData.splice(0,idx)
					setSelectedCountry(selectedCountry.splice(0,idx))
					setCountryData(countryData.splice(0,idx))
				}}
			/>
		</MapContainer>
  )
};

const Table = ({ body, head }) => (
	<table>
		<thead>
			<tr>
				{head.map((item, idx) => <th key={idx}> {item} </th>)}				
			</tr>
		</thead>
		<tbody>
			{body.map((item, idx) =>
				<tr key={idx}>
					<td>{item.name}</td>
					<td>{item.info}</td>
					<td>{findSubpowerFromText(item.unit, '2')}</td>
				</tr>
			)}
		</tbody>
	</table>
)