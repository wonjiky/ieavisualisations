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
import { mapBox } from '../../../components/customHooks/components/util/util'

export default function({ baseURL }) {

	const initialVariable = variables.country.sort((a,b) => a.group.localeCompare(b.group))[0]
	const [data, setData] = useState(null);
	const [index, setIndex] = useState(true);
	const [firstCountry, setFirstCountry] = useState(null);
	const [secondCountry, setSecondCountry] = useState(null);
	const [date, setDate] = useState({ day: 1, month: 9, year: 2020});
	const [mapType, setMapType] = useState('country');
	const [variable, setVariable] = useState({id: initialVariable.id, name: initialVariable.name});
	const [interval, setInterval] = useState('day');
	const [valueType, setValueType] = useState('Value')
	const [active, setActive] = useState({ open: false, target: null });
	const [openInfo, setOpenInfo] = useState(false);
	const [selectedCountries, setSelectedCountries] = useState([]);
	
	const { day, month, year } = date;

	// Produce query for choropleth data
	const getQuery = query => Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
	let joinedDate = `${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`;
	let query = withIntervalLogic([{ year, variable: variable.id }, { month, year, variable: variable.id, valueType }, { date: joinedDate, variable: variable.id }], interval)
	let mapQueryString = getQuery(query);
	
	// Produce query for country data
	let maxDay = new Date(year, month, 0).getDate();
	let startDate = withIntervalLogic(['20100101', `${year}0101`, `${year}${month < 10 ? '0' : ''}${month}01` ], interval);
	let endDate = withIntervalLogic(['20200831', `${year}1231`, `${year}${month < 10 ? '0' : ''}${month}${maxDay}` ], interval);
	let countryQuery = valueType === 'Value' 
		? `/?startDate=${startDate}&endDate=${endDate}&variable=${variable.id}&valueType=${valueType}`
		: `/?year=${year}&variable=${variable.id}&valueType=${valueType}`;
	

	// Produce download link and query
	let downloadQuery = withIntervalLogic([{ variable: variable.id, daily: true, year}, { variable: variable.id, year, valueType}, { variable: variable.id, daily: true, year, month}], interval);
	let download = `https://api.iea.org/weather/csv/?${getQuery(downloadQuery)}`;
	let downloadButtonLabel = withIntervalLogic([
		`Daily ${variable.name} values for ${year}`,
		`Monthly ${variable.name} ${valueType === 'Value Climatologies' ? 'climatologies' : valueType.toLowerCase()} for ${year}`,
		`Daily ${variable.name} values for ${getMonthString(month)} ${year}`
	], interval);

	const { unit, decimal, group, color} = variables[mapType].find(d => d.id === variable.id);
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
				max: withIntervalLogic([ 2020, year === 2020 ? 9 : 12, maxDay ], interval),
				step: 1,
				change: e => setDate(interval !== 'day' 
					? { ...date, [interval] : Number(e.target.value), day: 1 }
					: { ...date, [interval] : Number(e.target.value) 
				})
			},
			{ 
				type: 'buttonGroup',
				// type: mapType === 'country' ? 'buttonGroup' : null,
				options: ['Year', 'Month', 'Day'],
				selected: uppercase(interval),
				flow: 'row',
				click: value => {
					setValueType('Value')
					setInterval(value.toLowerCase())
				}
			},
			{
				type: mapType === 'country' ? 'radio' : null,
				options: [
					{ label: 'Value', value: 'Value' }, 
					{ label: 'Anomaly', value: 'Anomalies' }, 
					{ label: 'Climatology', value: 'Value Climatologies' }
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
				options: ['* Anomaly and climatology values are only available in monthly country view'],
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
			colors: !colorArray[color||group] 
				? colorArray.default : colorArray[color||group],
			round: false
		}
	];

	let gridTypes = {
		"Temperaturedailybypop":"T_monthly_from_daily",
		"Temperaturemaxdailybypop":"Tmax_monthly_from_daily",
		"Temperaturemindailybypop":"Tmin_monthly_from_daily",
		"CDDdailybypop18":"CDD_monthly18",
		"CDDHIdailybypop18":"CDD_HI_monthly18",
		"HDDdailybypop18":"HDD_monthly18",
		"Precdaily":"Prec_monthly",
		"Snowfalldaily":"Snow_monthly",
		"Runoffdaily":"Runoff_monthly",
		"Evapdaily":"Evap_monthly",
		"Daylightdaily":"Daylight_monthly",
		"DNIdaily":"DNI_monthly",
		"GHIdaily":"GHI_monthly",
		"Wind100intdaily":"Wind_100_int_monthly",
		"Wind10intdaily": "Wind_10_int_monthly"
	}

	return (
		<MapContainer selector={'Weather_Map'} loaded={data}>
			<Weather 
				data={data} 
				mapType={mapType} 
				selectedCountries={selectedCountries}
				gridURL={`${baseURL}weather/grid/2020/01/${gridTypes[variable.id]}.png`}
				unit={unit}
				decimal={decimal}
				colType={color || group}
				click={e => {
					if ([ ...selectedCountries ].map(d => d.ISO).includes(e)) return;
					setIndex(!index);
					getSelectedCountries(e, index);	
				}}
			/>
			<ControlContainer 
			 	bg
				dark={true} 
				help={true}
				helpClick={_ => setOpenInfo(!openInfo)}	
				helpTitle="Glossary of map terms"
				download={true}
				downloadLink={download}
				downloadLabel={downloadButtonLabel}
			>
				<Controls position='bottomRight'  customClass={classes.Test}>
          {legends.map((legend, idx) => 
            <Legends key={idx} {...legend} />)}
        </Controls>
				<Controls position='topLeft' style={{'width': '280px'}}> 
					{controls.topleft.map((control, idx) => 
            <Control key={idx} {...control} /> )}
				</Controls>
			</ControlContainer>
			<div className={classes.ButtonWrapper} style={{"top": mapType === 'country' ? "410px" : "275px" }}>
				<Icon fill button type='help' dark='float' styles={classes.Help} click={_ => setOpenInfo(!openInfo)} title="Glossary of map terms"/>
				<div className={classes.DownloadContainer}>
					<a href={download} className={classes.DownloadButton}>
						<Icon strokeWidth={1} stroke type='download' viewBox='-13 -11 50 50' dark='float' styles={classes.Download} />
					</a>
					<div className={classes.DownloadWrapper}>
						{downloadButtonLabel}
					</div>
				</div>
			</div>
			<Modal styles='full' open={openInfo} click={_ =>  setOpenInfo(!openInfo)} dark>
				<ValueType body={variables.valueTypes} head={['Name', 'Description']} />
				<Table body={variables[mapType]} head={['Name', 'Description', 'Unit']} />
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

const ValueType = ({ body, head }) => (
	<div className={classes.ModalText}>
		<h5>Value types</h5>
		{body.map(d => 
			<div key={d.id} className={classes.ModalTextContent}>
				<h6>{d.id}</h6>
				<p>{d.info}</p>
			</div>
		)}
	</div>
)

const Table = ({ body, head }) => (
	<div className={classes.Table}>
		<h5>Variables</h5>
		<div className={classes.TableWrapper}>
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
		</div>
	</div>
)