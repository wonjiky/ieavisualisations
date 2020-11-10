import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { MapContainer } from '../../../components/container'
import { ControlContainer, Controls, Control } from '../../../components/controls'
import { getCountryNameByISO, getMonthString, uppercase, useIntervalLogic, colorArray, gridColorArray, GRID_LAYERS } from './util'
import { Modal } from '../../../components/modal'
import { Legends } from '../../../components/legends'
import { Icon } from '../../../components/icons'
import variables from '../assets/variables.json'
import gridMinMax from '../assets/gridMinMax.json'
import Weather from './Weather'
import classes from './css/Weather.module.css'
import CountryInfo from './CountryInfo'

export default function({ baseURL }) {
	
	// Grid level image time range
	let minYear = 2014, maxYear = 2019;
	let yearRange = (maxYear - minYear) + 1;
	let minMonth = 1, maxMonth = yearRange * 12;

	let initialVariable = variables.territory.sort((a,b) => a.group.localeCompare(b.group))[0]
	const [data, setData] = useState(null);
	const [index, setIndex] = useState(true);
	const [firstCountry, setFirstCountry] = useState(null);
	const [secondCountry, setSecondCountry] = useState(null);
	const [date, setDate] = useState({ day: 1, month: 9, year: 2019});
	const [mapType, setMapType] = useState('territory');
	const [variable, setVariable] = useState({id: initialVariable.id, name: initialVariable.name});
	const [viewInterval, setViewInterval] = useState('day');
	const [valueType, setValueType] = useState('Value')
	const [active, setActive] = useState({ open: false, target: null });
	const [openInfo, setOpenInfo] = useState(false);
	const [selectedCountries, setSelectedCountries] = useState([]);
	const [currGridMonth, setCurrGridMonth] = useState(maxMonth);
	const [gridTime, setGridTime] = useState({month: 12, year: maxYear})
	const { day, month, year } = date;
	let dayToStr = num => `${num < 10 ? '0' : ''}${num}`; 

	// Retrieve attributes for each variable
	const { decimal, unit, group, color } = variables[mapType].find(d => d.id === variable.id);

	// Produce query for choropleth data
	const getQuery = query => Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
	let joinedDate = `${year}${dayToStr(month)}${dayToStr(day)}`;
	let query = useIntervalLogic([
		{ year, variable: variable.id }, 
		{ year, month, variable: variable.id, valueType }, 
		{ date: joinedDate, variable: variable.id }], viewInterval);
	let mapQueryString = getQuery(query);
	
	// Produce query for country data
	let maxDay = new Date(year, month, 0).getDate();
	let startDate = useIntervalLogic(['20100101', `${year}0101`, `${year}${dayToStr(month)}01` ], viewInterval);
	let endDate = useIntervalLogic(['20200831', `${year}1231`, `${year}${dayToStr(month)}${maxDay}` ], viewInterval);
	let timeByValueType = valueType === 'Value' ? {startDate, endDate} : {year, month};
	let countryQuery = useIntervalLogic([
		{ startDate, endDate, variable: variable.id, valueType }, 
		{ ...timeByValueType, variable: variable.id, valueType }, 
		{ startDate, endDate, variable: variable.id, valueType }], viewInterval);
	let countrQueryString = getQuery(countryQuery);
	
	// Produce download link and query
	let downloadQuery = useIntervalLogic([{ variable: variable.id, daily: true, year}, { variable: variable.id, year, valueType}, { variable: variable.id, daily: true, year, month}], viewInterval);
	let download = `https://api.iea.org/weather/csv/?${getQuery(downloadQuery)}`;
	let downloadButtonLabel = useIntervalLogic([
		`Daily ${variable.name} values for ${year}`,
		`Monthly ${variable.name} ${valueType === 'Value Climatologies' ? 'climatologies' : valueType.toLowerCase()} for ${year}`,
		`Daily ${variable.name} values for ${getMonthString(month)} ${year}`
	], viewInterval);

	const hide = React.useCallback((e) => {
		setActive({ open: false, target: null })
    document.removeEventListener('click', hide)
	}, [])

	useEffect(() => {
    if (!active.open && !openInfo) return;
    document.addEventListener('click', hide)
	},[ active.open, openInfo,  hide ])
	
	// Assign selected countries to variable
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

	// Fetch selected country's data
	const fetchCountryData = useCallback(() => {
		for (let country in selectedCountries) {
			let selected = selectedCountries[country];
			axios.get(`https://api.iea.org/weather/country/${selected.ISO}/?${countrQueryString}`)
				.then(response => {					
					selected.setData({
						ISO: selected.ISO,
						color: selected.color,
						data: response.data,
						viewInterval: viewInterval === 'day' 
							? 86400000 : viewInterval === 'month' 
							? 2592000000 : 31104000000	
					});
			})		
		}
	}, [selectedCountries, countrQueryString, viewInterval]);

	// Push selected countries data to an array to series
	let countryData = [];
	[firstCountry, secondCountry].forEach(d => d ? countryData.push(d) : '');
	
	useEffect(fetchCountryData, [selectedCountries, countrQueryString]);

	// Fetch choropleth data
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

	// Handle grid level query
	useEffect(() => {
		if (mapType === 'territory') return;
		let ranges = [], yearCounter;
		let i = Number(currGridMonth);
		let tempMonth = i % 12 === 0 ? 12 : i % 12;

		for (let t = 1; t <= maxMonth; t += 12 ) ranges.push([t, t + 11])
		for (let range in ranges) {
			if (ranges[range][0] <= i && i <= ranges[range][1]) {
				yearCounter = Number(range)
			}
		}
		setGridTime({
			month: dayToStr(tempMonth),
			year: minYear + yearCounter
		})

	},[mapType, minYear, maxMonth, currGridMonth])
	
	const controls = {
		topleft: [
			{ 
				type: 'buttonGroup',
				options: ['Territory','Grid'],
				selected: uppercase(mapType),
				flow: 'row',
				click: value => {
					if (value.toLowerCase() === mapType) return;
					let map = mapType === 'territory' ? 'grid' : 'territory'
					setMapType(value.toLowerCase());
					setVariable({id: variables[map][0].id, name: variables[map][0].name})
					setFirstCountry(null);
					setSecondCountry(null);
					setIndex(true);
					setCurrGridMonth(map === 'territory' ? '' : ((year - minYear) * 12) + month);
					setViewInterval(map === 'territory' ? 'day' : 'month');
					setDate(map === 'territory' ? { day: 1, month: 9, year: 2019} : { day: 1, month: 12, year: 2019});
					setSelectedCountries([]);
				}
			},
			{ 
				type: 'slider',
				selected: uppercase(viewInterval),
				label: mapType === 'territory' 
					? useIntervalLogic([year, `${getMonthString(month)}, ${year}`, `${getMonthString(month)} ${day}, ${year}`], viewInterval)
					: `${getMonthString(gridTime.month)}, ${gridTime.year}`,
				value: mapType === 'territory' 
					? useIntervalLogic([year, month, day], viewInterval) 
					: currGridMonth,
				min: mapType === 'territory' 
					? useIntervalLogic([2000, 1, 1], viewInterval)
					: minMonth,
				max: mapType === 'territory' 
					? useIntervalLogic([ 2020, year === 2020 ? 9 : 12, maxDay ], viewInterval)
					: maxMonth,
				step: 1,
				change: e => mapType === 'territory' 
				? (setDate(viewInterval !== 'day' 
					? { ...date, [viewInterval] : Number(e.target.value), day: 1 }
					: { ...date, [viewInterval] : Number(e.target.value) }))
				: setCurrGridMonth(e.target.value)
			},
			{ 
				type: mapType === 'territory' ? 'buttonGroup' : '',
				options: ['Year', 'Month', 'Day'],
				selected: uppercase(viewInterval),
				flow: 'row',
				click: value => {
					setValueType('Value')
					setViewInterval(value.toLowerCase())
				}
			},
			{
				type: 'radio',
				options: [
					{ label: 'Value', value: 'Value' }, 
					{ label: 'Anomaly', value: 'Anomalies' }, 
					{ label: 'Climatology', value: 'Value Climatologies' }
				],
				flow: 'column',
				disabled: viewInterval === 'month' ? false : true,
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

	const findMinMax = type => 
		Math[type](...data.map(d => parseNumber(d.value)));
	const parseNumber = num => parseFloat(num).toFixed(decimal);

	let gridLegendLabel = mapType === 'territory'
		? []
		: gridMinMax[GRID_LAYERS[variable.id]][gridTime.year - minYear][Number(gridTime.month)-1][0]

	const legends = [{
		type: 'continuous',
		header: 'legend',
		subInHeader: false,
		round: false,
		labels: mapType === 'territory' ? (data 
			? [findMinMax('min'), `${findMinMax('max')} ${unit}`] 
			: [])
			: [parseNumber(gridLegendLabel[0]), `${parseNumber(gridLegendLabel[1])} ${unit}`],
		colors: mapType === 'territory' 
		? (!colorArray[color||group]  ? colorArray.default : colorArray[color||group])
		: gridColorArray[GRID_LAYERS[variable.id]]
	}];

	return (
		<MapContainer selector={'Weather_Map'} loaded={data}>
			<Weather 
				data={data} 
				month={month}
				mapType={mapType} 
				selectedCountries={selectedCountries}
				variable={variable.id}
				gridURL={`${baseURL}weather/grid/${gridTime.year}/${gridTime.month}/${GRID_LAYERS[variable.id]}.png`}
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
				<Controls position='bottomRight' customClass={mapType==='grid' ? [classes.LegendWrapper, classes.GridView].join(' ') : classes.LegendWrapper}>
          {legends.map((legend, idx) => 
            <Legends key={idx} {...legend} />)}
        </Controls>
				<Controls position='topLeft' style={{'width': '280px'}}> 
					{controls.topleft.map((control, idx) => 
            <Control key={idx} {...control} /> )}
				</Controls>
			</ControlContainer>
			<div className={classes.ButtonWrapper} style={{"top": mapType === 'territory' ? "412px" : "362px" }}>
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

const ValueType = ({ body }) => (
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