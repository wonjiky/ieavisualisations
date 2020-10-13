import React from 'react'
import countries from './assets/countriesIso.json'

export function colorsByVariables(countries) {
// export function colorsByVariables(countries, type, viewUnit) {

	
	let ranges = {
		month: {
			temperatureDaily: {
				colors: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
			},
			hdd: {
				colors: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
				values: [[0], [0,10], [10,100], [100,200], [200,300], [300,400], [400,500], [500,700], [700]]
			},
			cdd: {
				colors: [ '#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58' ],
				values: [[0], [0,10], [10,100], [100,200], [200,300], [300,400], [400,500], [500,700], [700]]
			},
			'solar radiation': {
				colors: [ '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd' ],
				values: [[0,10], [10,20], [20,30], [30,40], [40,50], [50,60], [60,80], [80,90], [90]]
			}
		},
		day: {
			'solar radiation': {
				colors: [ '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd' ],
				values: [[70000, 300000], [300000, 400000], [400000, 600000], [600000, 700000], [700000, 900000], [900000, 1000000], [1000000,1100000], [1100000,1200000], [1200000]]
			}
		}
	}
	if (!countries) console.log('Cannot read countries :', countries);
	let testCountries = [...countries];
	let min = Math.min(...countries.map(d => d.value)),
	max = Math.max(...countries.map(d => d.value))
	let { colors } = ranges.month.temperatureDaily;
	let values = [], countriesByValueRange = [], denominator = 8;

	for (let i = 0; i <= denominator; i++ ) {
		let incre = ((max - min) / denominator) * i;
		let result = min + incre;
		values.push(i === 0 ? 0 : Math.trunc(result))
		countriesByValueRange.push([]);
	}

	testCountries.forEach(c => {
		let { value, country } = c; 
		for (let i = 0; i < values.length; i++) {
			let currVal = values[i]
			let nextVal = values[i + 1];
			let lastVal = values[values.length - 1];

			if ((currVal < value && value < nextVal) || (value > lastVal) ) {
				countriesByValueRange[i].push(country)
			} 
		}
	});

	countriesByValueRange.forEach((value, idx) => {
		let countryPos = (idx * 2);
		colors.splice(countryPos, 0, ["match", ["get", "ISO3"], value, true, false ])
	})
	colors.splice(0,0, 'case');
	colors.splice((colors.length * 2) + 1, 0, '#a3a3a3');
	return colors;
}

export function getCountryPopupInfo(countries, selected) {
	const selectedCountry = countries.filter(country => country.country === selected)[0];
	if ( selected && selectedCountry ) {
		return `
			<strong>${selectedCountry.name}</strong>
			<p>Value: ${selectedCountry.value}</p>
		`
	}
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

export function getMonthString(date) {
	return new Date(1, date - 1, 1).toLocaleString('default', { month: 'long' });
}

export function withIntervalLogic(entries, interval) { return entries[['year', 'month', 'day'].findIndex(d => d === interval)] }

export function usePrevious(value) {
	const ref = React.useRef();
	React.useEffect(() => {
		ref.current = value;
	})
	return ref.current;
}

export function getCountryInfo(arr, hasCountry, value, colors) {
	let len = arr.length;

	if (len > 2) return;
	if (len === 0) {
		arr.push([value, colors[0]]);
	} else if (len === 1) {
		!hasCountry && arr.splice(0,0, [value, colors ? colors[1] : ''])
	} else if (len > 1) {
		let color = arr[0][1] === colors[0] ? colors[1] : colors[0];
		!hasCountry && (arr.pop() && arr.splice(0,0, [value, color]))
	}
	return arr;
}