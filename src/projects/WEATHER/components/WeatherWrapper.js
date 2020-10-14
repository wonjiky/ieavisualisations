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

export default function() {

	const [data, setData] = useState(null);
	const [index, setIndex] = useState(true);
	const [firstCountry, setFirstCountry] = useState(null);
	const [secondCountry, setSecondCountry] = useState(null);
	const [selectedCountries, setSelectedCountries] = useState({ firstCountry: { ISO: null, color: '#727272'}, secondCountry: { ISO: null, color: '#e6e6e6' } });
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
	let mapQueryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');

	let startDate = withIntervalLogic(['20000101', `${year}0101`, `${year}${month < 10 ? '0' : ''}${month}01` ], interval);
	let endDate = withIntervalLogic(['20200831', `${year}1231`, `${year}${month < 10 ? '0' : ''}${month}${maxDay}` ], interval);
	let countryQuery = `/?startDate=${startDate}&endDate=${endDate}&variable=${variable.id}`;

	// let splineColors = { firstCountry: '#727272', secondCountry: '#e6e6e6'};

	const hide = React.useCallback((e) => {
		setActive({ open: false, target: null })
    document.removeEventListener('click', hide)
	}, [])

	React.useEffect(() => {
    if (!active.open && !openInfo) return;
    document.addEventListener('click', hide)
	},[ active.open, openInfo,  hide ])
	
	function getSelectedCountries(value, index) {
		if (!getCountryNameByISO(value)) return;
		let idx = index ? 'firstCountry' : 'secondCountry';
		let currArr = { ...selectedCountries };
		if (Object.keys(currArr).length > 2) return currArr;
		setSelectedCountries({ ...selectedCountries, [idx]:  { ...selectedCountries[idx], ISO: value } });
	}
	
	useEffect(() => {
		if(!selectedCountries.firstCountry.ISO) return;
		axios.get(`https://api.iea.org/weather/country/${selectedCountries.firstCountry.ISO}${countryQuery}`)
			.then(response => {
				setFirstCountry({
					ISO: selectedCountries.firstCountry.ISO,
					color: selectedCountries.firstCountry.color,
					data: response.data,
					interval: interval === 'day' ? 86400000 : interval === 'month' ? 2592000000 : 31104000000	
				});
			})
	}, [selectedCountries.firstCountry, countryQuery, interval])

	useEffect(() => {
		if(!selectedCountries.secondCountry.ISO) return;
		axios.get(`https://api.iea.org/weather/country/${selectedCountries.secondCountry.ISO}${countryQuery}`)
			.then(response => {
				setSecondCountry({
					ISO: selectedCountries.secondCountry.ISO,
					color: selectedCountries.secondCountry.color,
					data: response.data
				});
			})
	}, [selectedCountries.secondCountry, countryQuery])

	useEffect(() => {
		axios.get(`https://api.iea.org/weather/?${mapQueryString}`)
			.then(response => {
				const result = response.data.map(d => ({ ...d, name: getCountryNameByISO(d.country) }));
				if (response.data.length !== 0) {
					setData(result);
				} else alert(`Data does not exist for this variable`)
			})
	}, [mapQueryString]);

	let countryData = [];
	[firstCountry, secondCountry].forEach(d => d ? countryData.push(d) : '');

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
					setMapType(value.toLowerCase());
					setFirstCountry(null);
					setSecondCountry(null);
					setIndex(true);
					setSelectedCountries({ 
						firstCountry: { ISO: null, color: '#727272'}, 
						secondCountry: { ISO: null, color: '#e6e6e6' } 
					});
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
				selectedCountries={selectedCountries}
				unit={variables.find(d => d.id === variable.id).unit}
				click={e => {
					let currArr = { ...selectedCountries };
					let hasCountry = Object.values(currArr).map(d => d.ISO).includes(e);
					if (hasCountry) return;
					setIndex(!index);
					getSelectedCountries(e, index);	
				}}
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
				countries={selectedCountries}
				mapType={mapType}
				unit={variables.find(d => d.id === variable.id).unit}
				click={e => {
					let country = Object.values(selectedCountries)
						.findIndex(d => d.ISO === e) === 0 ? 'firstCountry' : 'secondCountry';
					country === 'firstCountry' ? setFirstCountry(null) : setSecondCountry(null);
					country === 'firstCountry' ? setIndex(true) : setIndex(false);
					setSelectedCountries({
						...selectedCountries,
						[country]: { ...selectedCountries[country], ISO: null }
					})
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