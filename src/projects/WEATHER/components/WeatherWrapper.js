import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { MapContainer } from '../../../components/container'
import { ControlContainer, Controls, Control } from '../../../components/controls'
import { getCountryNameByISO, getMonthString, uppercase, withIntervalLogic, colorArray } from './util'
import { Modal } from '../../../components/modal'
import { Legends } from '../../../components/legends'
import { Icon } from '../../../components/icons'
import variables from './assets/variables.json'
import Weather from './Weather'
import classes from './css/Weather.module.css'
import CountryInfo from './CountryInfo'

export default function() {
	const [data, setData] = useState(null);
	const [index, setIndex] = useState(true);
	const [firstCountry, setFirstCountry] = useState(null);
	const [secondCountry, setSecondCountry] = useState(null);
	const [date, setDate] = useState({ day: 1, month: 8, year: 2011});
	const [variable, setVariable] = useState({id: variables.country[0].id, name: variables.country[0].name});
	const [mapType, setMapType] = useState('country');
	const [interval, setInterval] = useState('day');
	const [active, setActive] = useState({ open: false, target: null });
	const [openInfo, setOpenInfo] = useState(false);
	const [selectedCountries, setSelectedCountries] = useState([]);
	
	let { day, month, year } = date;
	let joinedDate = `${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`;
	let query = interval === 'day' ? { date: joinedDate, variable: variable.id } 
		: interval === 'month' ? { month, year, variable: variable.id } 
		: { year, variable: variable.id };
	let maxDay = new Date(year, month, 0).getDate();
	let mapQueryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');

	let startDate = withIntervalLogic(['20100101', `${year}0101`, `${year}${month < 10 ? '0' : ''}${month}01` ], interval);
	let endDate = withIntervalLogic(['20200831', `${year}1231`, `${year}${month < 10 ? '0' : ''}${month}${maxDay}` ], interval);
	let countryQuery = `/?startDate=${startDate}&endDate=${endDate}&variable=${variable.id}`;

	const { unit, decimal, nested} = variables[mapType].find(d => d.id === variable.id);

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

		let currArr = [ ...selectedCountries ];
		let idx = index ? 'firstCountry' : 'secondCountry';
		let pos = currArr.findIndex(d => d.id === idx);

		let countries = {
			firstCountry: { id: 'firstCountry', color: '#727272', setData: e => setFirstCountry(e) },
			secondCountry: { id: 'secondCountry', color: '#e6e6e6', setData: e => setSecondCountry(e) }
		}

		if (currArr.length === 2) {
			currArr.splice(pos, 1)
			currArr.push({ ...countries[idx], ISO: value })
		} else currArr.push({ ...countries[idx], ISO: value })
		setSelectedCountries(currArr);
	}

	const fetchCountryData = useCallback(() => {
		for (let country in selectedCountries) {
			let selected = selectedCountries[country];
			axios.get(`https://api.iea.org/weather/country/${selected.ISO}${countryQuery}`)
				.then(response => {
					selected.setData({
						ISO: selected.ISO,
						color: selected.color,
						data: response.data,
						interval: interval === 'day' 
							? 86400000 : interval === 'month' 
							? 2592000000 : 31104000000	
					});
			})		
		}
	}, [selectedCountries, countryQuery, interval]);

	useEffect(fetchCountryData, [selectedCountries, countryQuery]);
	
	useEffect(() => {
		axios.get(`https://api.iea.org/weather/?${mapQueryString}`)
		.then(response => {
			const result = response.data.map(d => ({ 
				...d, 
				name: getCountryNameByISO(d.country), 
				value: parseFloat(d.value.toFixed(decimal))
			}));
			if (response.data.length !== 0) setData(result)
		})
	}, [mapQueryString, variable, decimal]);

	let countryData = [];
	[firstCountry, secondCountry].forEach(d => d ? countryData.push(d) : '');

	const controls = {
		topleft: [
			{ 
				type: 'slider',
				selected: uppercase(interval),
				label: withIntervalLogic([year, `${getMonthString(month)}, ${year}`, `${getMonthString(month)} ${day}, ${year}`], interval),
				value: withIntervalLogic([year, month, day], interval),
				min: withIntervalLogic([2010, 1, 1], interval),
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
					setSelectedCountries([]);
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
				options: variables[mapType],
				selected: uppercase(variable.name),
				active: active,
				open: e => setActive({ open: true, target: e.target.value }),
				click: e => setVariable({ id: e.id, name: e.name })
			}
		]
	};

	const legends = [
		{
			type: 'continuous',
			header: 'hello',
			subInHeader: false,
			labels: data 
				? [parseFloat(Math.min(...data.map(d => d.value))).toFixed(decimal), 
					`${Math.max(...data.map(d => parseFloat(d.value).toFixed(decimal)))} ${unit}`] : [],
			colors: !colorArray[nested] 
				? colorArray.default : colorArray[nested],
			round: false
		},
	]

	return (
		<MapContainer selector={'Weather_Map'} loaded={data}>
			<Weather 
				data={data} 
				mapType={mapType} 
				selectedCountries={selectedCountries}
				variables={variables[mapType]}
				unit={unit}
				decimal={decimal}
				colType={nested}
				click={e => {
					if ([ ...selectedCountries ].map(d => d.ISO).includes(e)) return;
					setIndex(!index);
					getSelectedCountries(e, index);	
				}}
			/>
			<ControlContainer dark bg>
				<Controls position='topLeft' style={{'width': '280px'}}> 
					{controls.topleft.map((control, idx) => 
            <Control key={idx} {...control} /> )}
				</Controls>
				<Controls position='bottomRight'  customClass={classes.Test}>
          {legends.map((legend, idx) => 
            <Legends key={idx} {...legend} />)}
        </Controls>
			</ControlContainer>
			<Icon type='help' dark={true} fill button={true} click={_ => setOpenInfo(!openInfo)} styles={classes.Help}/> 
			<Modal styles='full' open={openInfo} click={_ =>  setOpenInfo(!openInfo)} dark>
				<Table body={variables[mapType]} head={['Variable', 'Description', 'Unit']} />
			</Modal>
			<CountryInfo 
				data={countryData}
				countries={selectedCountries}
				mapType={mapType}
				unit={unit}
				decimal={decimal}
				click={id => {
					let currArray = [ ...selectedCountries ];
					let pos = currArray.findIndex(d => d.id === id);
					currArray.splice(pos, 1)
					id === 'firstCountry' ? setFirstCountry(null) : setSecondCountry(null);
					id === 'firstCountry' ? setIndex(true) : setIndex(false);
					setSelectedCountries(currArray);
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
					<td>{item.unit}</td>
				</tr>
			)}
		</tbody>
	</table>
)