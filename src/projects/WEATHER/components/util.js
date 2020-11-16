import React from 'react'
import countries from '../assets/countriesIso.json'
import { scaleQuantile, scaleLinear, scaleSequentialQuantile, scaleSequential,  scaleQuantize } from 'd3-scale'
import { hsl } from 'd3-color'
import { extent } from 'd3-array'

export const uppercase = str => str.charAt(0).toUpperCase() + str.slice(1);
export const getCountryNameByISO = iso => !countries.find(d => d.ISO3 === iso) ? null : countries.find(d => d.ISO3 === iso).region;
export const getCentroidLabelByISO = _ => ["to-string", ["get", "region"]];
export const getMonthString = date => new Date(1, date - 1, 1).toLocaleString('default', { month: 'long' });
export const useIntervalLogic = (entries, interval) => entries[['year', 'month', 'day'].findIndex(d => d === interval)];
export const disputedRegionsISO = ["ABCDE", "ABCD", "VAT", "SMR", "MAF", "VGB", "AND", "BVT", "MCO", "CXR", "LIE", "ABCD-PSE"];
export const disputedRegionsID = [61, 255, 253, 87, 233, 86, 228];

export const colorArray = {
	// Temp: ['#008712','#5aaa1a','#96c11f','#dce029','#fee929','#f1c92b','#df9b2e','#c86031','#b93326'],
	Temp: ['#003b9c','#4eac32','#eff15b','#cc9642','#b93326'],
	// Temp: ['#003790','#005560','#006d3b','#008712','#7fb81e','#fee929','#e9b328','#d27627','#b93326'],
	// Temp: ['#003790','#133786','#25367b','#3f366c','#55355f','#6d3551','#8a3441','#a03434','#b93326'],
	HDD: ['#b93326', '#c86031', '#df9b2e', '#f1c92b', '#fee929', '#dce029', '#96c11f', '#5aaa1a', '#008712'],
	Daylight: ['#424139','#565541','#6d6c4a','#898854','#a5a45f','#bdbd68','#c8c86c','#d2d270','#fcfc80'],
	Precipitation: ['#ffffff','#e3ece2','#cadcc8','#a4c3a2','#93b790','#6a9c66','#528c4e','#3c7e38','#165312'],
	Snow: ['#ddbd79','#dfc386','#e1c892','#e3cea1','#e6d5b2','#e9dcc2','#ece4d3','#ede8dc','#f0f0f0'],
	default: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
	// HDD: ['#003790', '#264a9a', '#3b5ea3', '#4e72ad', '#719cc0', '#83b2c8', '#98c7d1', '#afdcd8', '#ffffe0'],
};

const gridColors = {
  "Temp": ['#008712','#5aaa1a','#96c11f','#dce029','#fee929','#f1c92b','#df9b2e','#c86031','#b93326'],
  "HDD": ['#b93326', '#c86031', '#df9b2e', '#f1c92b', '#fee929', '#dce029', '#96c11f', '#5aaa1a', '#008712'],
  "Daylight": ['#424139','#565541','#6d6c4a','#898854','#a5a45f','#bdbd68','#c8c86c','#d2d270','#fcfc80'],
  "Precipitation": ['#ffffff','#e3ece2','#cadcc8','#a4c3a2','#93b790','#6a9c66','#528c4e','#3c7e38','#165312'],
  "Snow": ['#ddbd79','#dfc386','#e1c892','#e3cea1','#e6d5b2','#e9dcc2','#ece4d3','#ede8dc','#f0f0f0'],
  "Wind": ["#ffffff", "#e6e6e6", "#cfcfcf", "#b8b8b8", "#a0a0a0", "#898989", "#6e6e6e", "#555555", "#393939"],
  "default": ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
}

export const gridColorArray = {
  "Daylight": gridColors["Daylight"],
  "HDD18": gridColors["HDD"],
  "Precipitation": gridColors["Precipitation"],
  "CDDhum18": gridColors["Temp"],
  "CDD18": gridColors["Temp"],
  "HeatIndex": gridColors["Temp"],
  "Humidex": gridColors["Temp"],
  "Temperaturemin": gridColors["Temp"],
  "Temperaturemax": gridColors["Temp"],
  "Temperature": gridColors["Temp"],
  "Cloud": gridColors["Snow"],
  "Evaporation": gridColors["Snow"],
  "Snowfall": gridColors["Snow"],
  "DNI": gridColors["default"],
  "GHI": gridColors["default"],
  "Runoff": gridColors["default"],
  "RH": gridColors["default"],
  "Wind10int": gridColors["Wind"],
  "Wind100int": gridColors["Wind"],
  "Wind100power": gridColors["Wind"],
}

export function colorsByVariables(countries, colType, selector, dataMinMax) {

	let tempColors = !colorArray[colType] ? colorArray.default : colorArray[colType];
	let tempCountries = [...countries], nullColor = '#a3a3a3', colors = [];

	let findMinMax = (data, type) => Math[type](...data.map(d => d.value));
	let hasMinMax = dataMinMax.length !== 0;
	let minValue = hasMinMax ? dataMinMax[0] : findMinMax(tempCountries, 'min'), 
	maxValue = hasMinMax ? dataMinMax[1] : findMinMax(tempCountries, 'max');
	let pivotValue = (maxValue - minValue) / (tempColors.length - 1);
	let valueRange = [];
	
	for (let i = 1; i < tempColors.length - 1; i++) valueRange.push((pivotValue * i) + minValue)
	valueRange.splice(0, 0, minValue)
	valueRange.splice((valueRange.length * 2) + 1, 0, maxValue)
	
	let contScale = scaleLinear()
		.domain(valueRange)
		.range(tempColors);

	tempCountries.forEach(countries => {

		let { value, country } = countries;
		let assignedColor = contScale(value)
		let unique = colors.indexOf(assignedColor) === -1;

		if (unique) {
			colors.push(["match", ["get", selector], [country], true, false ])
			colors.push(assignedColor)
		} else {
			let idx = colors.findIndex(d => d === assignedColor) - 1;
			colors[idx][2].push(country)
		}

	})

	colors.splice(0,0, 'case');
	colors.splice((colors.length * 2) + 1, 0, nullColor);
	
	return colors;
	// const scale = scaleQuantile( countries.map(d => d.value), tempColors );
	// let tempColors = !colorArray[colType] ? colorArray.default : colorArray[colType];
	// let tempCountries = [...countries];
	// let finalColors = [...tempColors];
	// for (let i = 0; i < tempColors.length; i++ ) {
	// 	finalColors.splice(i * 2, 0, ["match", ["get", selector], [], true, false ]);
	// }
	// tempCountries.forEach(c => {
	// 	let { value, country } = c; 
	// 	let colorScale = e => !!e ? scale(e) : tempColors[0];
	// 	let idx = tempColors.findIndex(d => d === colorScale(value));
	// 	finalColors[idx * 2][2].push(country)
	// });
	// for (let i in finalColors) if (finalColors[i][2].length === 0 ) removeIndex.push(Number(i));
	// for (let i = removeIndex.length -1; i >= 0; i--) finalColors.splice(removeIndex[i], 2);
	// finalColors.splice(0,0, 'case');
	// finalColors.splice((finalColors.length * 2) + 1, 0, '#a3a3a3');
	// return finalColors;
}

export function getPopupInfo(countries, selected, unit, decimal) {
	const selectedCountry = countries.filter(country => country.country === selected)[0];
	if ( selected && selectedCountry ) return `${selectedCountry.name}</br><b>${selectedCountry.value.toFixed(decimal)} ${unit}</b>`
	return `<b>Value doe not exist for this country</b>`
}

export function usePrevious(value) {
	const ref = React.useRef();
	React.useEffect(() => {
		ref.current = value
	})
	return ref.current;
}

