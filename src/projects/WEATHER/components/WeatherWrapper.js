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

	const initialVariable = variables.country.sort((a,b) => a.group.localeCompare(b.group))[0]
	const [data, setData] = useState(null);
	const [index, setIndex] = useState(true);
	const [firstCountry, setFirstCountry] = useState(null);
	const [secondCountry, setSecondCountry] = useState(null);
	const [date, setDate] = useState({ day: 1, month: 8, year: 2011});
	const [mapType, setMapType] = useState('country');
	const [variable, setVariable] = useState({id: initialVariable.id, name: initialVariable.name});
	const [interval, setInterval] = useState('day');
	const [valueType, setValueType] = useState('Value')
	const [active, setActive] = useState({ open: false, target: null });
	const [openInfo, setOpenInfo] = useState(false);
	const [selectedCountries, setSelectedCountries] = useState([]);
	
	const { day, month, year } = date;
	const getQuery = query => Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
	let joinedDate = `${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`;
	let query = interval === 'day' ? { date: joinedDate, variable: variable.id } 
		: interval === 'month' ? { month, year, variable: variable.id, valueType: valueType}
		: { year, variable: variable.id }; 
	let mapQueryString = getQuery(query);
		
	let maxDay = new Date(year, month, 0).getDate();
	let startDate = withIntervalLogic(['20100101', `${year}0101`, `${year}${month < 10 ? '0' : ''}${month}01` ], interval);
	let endDate = withIntervalLogic(['20200831', `${year}1231`, `${year}${month < 10 ? '0' : ''}${month}${maxDay}` ], interval);
	let countryQuery = `/?startDate=${startDate}&endDate=${endDate}&variable=${variable.id}&valueType=${valueType}`;

	let downloadQuery = interval === 'month' 
		? { variable: variable.id, year: year, valueType: valueType } 
		: { variable: variable.id, daily: true, year: year, valueType: valueType };
	let download = `https://api.iea.org/weather/csv/?${getQuery(downloadQuery)}`;
	let dowloadButtonLabel = interval === 'month'
		? `Monthly ${variable.name} ${valueType === 'Value Climatologies' ? 'climatologies' : valueType.toLowerCase()} for ${year}`
		: interval === 'day'
		? `Daily ${variable.name} values for ${getMonthString(month)} ${year}`
		:	`Daily ${variable.name} values for ${year}`

	const { unit, decimal, group} = variables[mapType].find(d => d.id === variable.id);
	
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
				type: 'buttonGroup',
				options: ['Country','Grid'],
				selected: uppercase(mapType),
				flow: 'row',
				click: value => {
					setMapType(value.toLowerCase());
					setFirstCountry(null);
					setSecondCountry(null);
					setIndex(true);
					setSelectedCountries([]);
					setVariable({id: variables[mapType][0].id, name: variables[mapType][0].name})
				}
			},
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
				type: 'buttonGroup',
				options: ['Year', 'Month', 'Day'],
				selected: uppercase(interval),
				flow: 'row',
				click: value => {
					setValueType('Value')
					setInterval(value.toLowerCase())
				}
			},
			{
				type: 'radio',
				info: true,
				options: [
					{ label: 'Value', value: 'Value'}, 
					{ label: 'Anomaly', value: 'Anomalies'}, 
					{ label: 'Climatology', value: 'Value Climatologies'}, 
				],
				flow: 'column',
				disabled: interval === 'month' ? false : true,
				name: 'valueOption',
				selected: valueType,
				change: e => setValueType(e),
			},
			{
				type: 'dropdown',
				label: 'Variables',
				info: true,
				options: variables[mapType].sort((a,b) => a.group.localeCompare(b.group)),
				selected: uppercase(variable.name),
				active: active,
				open: e => setActive({ open: true, target: e.target.value }),
				click: e => setVariable({ id: e.id, name: e.name })
			},
			{
				type: 'description',
				options: ['* Anomaly and climatology values are only available in monthly view'],
			},
		]
	};

	const legends = [
		{
			type: 'continuous',
			header: 'legend',
			subInHeader: false,
			labels: data 
				? [parseFloat(Math.min(...data.map(d => d.value))).toFixed(decimal), 
					`${Math.max(...data.map(d => parseFloat(d.value).toFixed(decimal)))} ${unit}`] : [],
			colors: !colorArray[group] 
				? colorArray.default : colorArray[group],
			round: false
		}
	]

	const buttons =[
		{
			type: 'help',
			dark: 'float',
			fill: true,
			button: true,
			styles: classes.Help,
			click: _ => setOpenInfo(!openInfo)
		},
		{
			type: 'download',
			dark: 'float',
			stroke: true,
			strokeWidth: 1,
			button: false,
			viewBox: "-13 -11 50 50",
			styles: classes.Download
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
				colType={group}
				click={e => {
					if ([ ...selectedCountries ].map(d => d.ISO).includes(e)) return;
					setIndex(!index);
					getSelectedCountries(e, index);	
				}}
			/>
			<ControlContainer dark={true} bg>
				<Controls position='bottomRight'  customClass={classes.Test}>
          {legends.map((legend, idx) => 
            <Legends key={idx} {...legend} />)}
        </Controls>
				<Controls position='topLeft' style={{'width': '280px'}}> 
					{controls.topleft.map((control, idx) => 
            <Control key={idx} {...control} /> )}
				</Controls>
			</ControlContainer>
			<div className={classes.ButtonWrapper}>
				<Icon fill button type='help' dark='float'  styles={classes.Help} click={_ => setOpenInfo(!openInfo)} />
				<div className={classes.DownloadContainer}>
					<a href={download} className={classes.DownloadButton}>
						<Icon strokeWidth={1} stroke type='download' viewBox='-13 -11 50 50' dark='float' styles={classes.Download} />
					</a>
					<div className={classes.DownloadWrapper}>
						{dowloadButtonLabel}
					</div>
				</div>
			</div>
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