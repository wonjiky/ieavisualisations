import React from 'react'
import countries from './assets/countriesIso.json'
import { scaleQuantile } from 'd3-scale'

export const colorArray = {
	default: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
	// CDD: ['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000'],
	CDD: ['#008712','#5aaa1a','#96c11f','#dce029','#fee929','#f1c92b','#df9b2e','#c86031','#b93326'],
	HDD: ['#ffffe0', '#afdcd8', '#98c7d1', '#83b2c8', '#719cc0', '#4e72ad', '#3b5ea3', '#264a9a', '#003790'],
	Cloud: ['#ffffff','#e6e6e6','#cbcbcb','#bdbdbd','#a3a3a3','#8f8f8f','#7b7b7b','#636363','#4a4a4a'],
	Precipitation: ['#ffffff','#e3ece2','#cadcc8','#a4c3a2','#93b790','#6a9c66','#528c4e','#3c7e38','#165312'],
	Humidity: ['#ffe470','#e8d473','#c8bf77','#a8a97b','#85917f','#657b83','#4a6987','#29538b','#003790']
}

export function colorsByVariables(countries, colType, selector) {
	let tempColors = !colorArray[colType] ? colorArray.default : colorArray[colType];
	let tempCountries = [...countries];
	let finalColors = [...tempColors];
	let removeIndex = [];

	for (let i = 0; i < tempColors.length; i++ ) finalColors.splice(i * 2, 0, ["match", ["get", selector], [], true, false ]);
	let scale = scaleQuantile( countries.map(d => d.value), tempColors );

	tempCountries.forEach(c => {
		let { value, country } = c; 
		let colorScale = e => !!e ? scale(e) : tempColors[0];
		let idx = tempColors.findIndex(d => d === colorScale(value));
		finalColors[idx * 2][2].push(country)
	});
	
	for (let i in finalColors) 
	if (finalColors[i][2].length === 0 ) removeIndex.push(Number(i));

	for (let i = removeIndex.length -1; i >= 0; i--)
		finalColors.splice(removeIndex[i], 2);

	finalColors.splice(0,0, 'case');
	finalColors.splice((finalColors.length * 2) + 1, 0, '#a3a3a3');
	return finalColors;
}

export function getPopupInfo(countries, selected, unit, decimal) {
	const selectedCountry = countries.filter(country => country.country === selected)[0];
	if ( selected && selectedCountry ) return `${selectedCountry.name} : <b>${selectedCountry.value.toFixed(decimal)} ${unit}</b>`
	return `<b>Value doe not exist for this country</b>`
}

export const GRID_LAYERS = [
	{
		url: "mapbox://iea.cq9ld9rb", sourceLayer: "hdd_5_1-3cbp61"
	},
	{
		url: "mapbox://iea.598u8h3j", sourceLayer: "hdd_5_2-9oom4t"
	},
	{
		url: "mapbox://iea.9jr49vhf", sourceLayer: "hdd_5_3-dgyhg6"
	},
	{
		url: "mapbox://iea.2hb1cigo", sourceLayer: "hdd_5_4-5ug53j"
	},
	{
		url: "mapbox://iea.a6my9de2", sourceLayer: "hdd_5_5-cjeb0p"
	}
];

export function setGridColor(temp) {
	return [
		"step",
		["get", "val"],
		"hsla(0, 0%, 8%, 0.5)",
		0,
		"#d53e4f",
		100,
		"#f46d43",
		300,
		"#fdae61",
		600,
		"#fee08b",
		1000,
		"#ffffbf",
		1400,
		"#e6f598",
		1600,
		"#abdda4",
		1800,
		"#66c2a5",
		2300,
		"#3288bd"
	]
}

export function uppercase(str) { return str.charAt(0).toUpperCase() + str.slice(1) };

export function getCountryNameByISO(iso) { 
	let exist = countries.find(d => d.ISO3 === iso)
	return !exist ? null : exist.region;
}

export function getCentroidLabelByISO(data) {
	return ["to-string", ["get", "region"]]
}

export function getMonthString(date) {
	return new Date(1, date - 1, 1).toLocaleString('default', { month: 'long' });
}

export function withIntervalLogic(entries, interval) { return entries[['year', 'month', 'day'].findIndex(d => d === interval)] }

export function usePrevious(value) {
	const ref = React.useRef();
	React.useEffect(() => ref.current = value)
	return ref.current;
}

export function getCountryInfo(value, hasCountry, arr, colors, index) {
	let len = Object.keys(arr).length;
	if (len > 2 || hasCountry) return arr;
	if (len === 0) {
		arr.firstCountry = value;
	} else {
		arr.secondCountry = arr.firstCountry;
		arr.firstCountry = value;
	}
	return arr;
}