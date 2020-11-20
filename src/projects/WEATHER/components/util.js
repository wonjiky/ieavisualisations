import React from 'react'
import countries from '../assets/countriesIso.json'
import { scaleLinear } from 'd3-scale'

export const uppercase = str => str.charAt(0).toUpperCase() + str.slice(1);
export const getCountryNameByISO = iso => !countries.find(d => d.ISO3 === iso) ? null : countries.find(d => d.ISO3 === iso).region;
export const getCentroidLabelByISO = _ => ["to-string", ["get", "region"]];
export const getMonthString = date => new Date(1, date - 1, 1).toLocaleString('default', { month: 'long' });
export const useIntervalLogic = (entries, interval) => entries[['year', 'month', 'day'].findIndex(d => d === interval)];
export const disputedRegionsISO = ["ABCDE", "ABCD", "VAT", "SMR", "MAF", "VGB", "AND", "BVT", "MCO", "CXR", "LIE", "ABCD-PSE"];
export const disputedRegionsID = [61, 255, 253, 87, 233, 86, 228];

// export const colorArray = {
// 	Temp: ['#003b9c','#296e72','#4e9e4c','#a2c954','#eff15b','#e0bb4c','#d28a3e','#c55d32','#b93326'], 
// 	Anomaly: ['#003b9c','#426db6','#7595ca','#bdcce6','#ffffff','#eececb','#d28a3e','#c55d32','#b93326'], 
// 	// HDD: ['#003b9c','#296e72','#4e9e4c','#a2c954','#eff15b','#e0bb4c','#d28a3e','#c55d32','#b93326'], 
// 	// Blue green yellow red 5:
// 	// Temp: ['#003b9c','#4eac32','#eff15b','#cc9642','#b93326'],
// 	// Green to Red:
// 	// Temp: ['#008712','#5aaa1a','#96c11f','#dce029','#fee929','#f1c92b','#df9b2e','#c86031','#b93326'], 
// 	HDD: ['#b93326', '#c55d32', '#d28a3e', '#e0bb4c', '#eff15b', '#a2c954', '#4e9e4c', '#296e72', '#003b9c'],
// 	// HDD: ['#b93326', '#c86031', '#df9b2e', '#f1c92b', '#fee929', '#dce029', '#96c11f', '#5aaa1a', '#008712'],
// 	Daylight: ['#424139','#565541','#6d6c4a','#898854','#a5a45f','#bdbd68','#c8c86c','#d2d270','#fcfc80'],
// 	Precipitation: ['#ffffff','#e3ece2','#cadcc8','#a4c3a2','#93b790','#6a9c66','#528c4e','#3c7e38','#165312'],
// 	Snow: ['#ffffff','#faf6ec','#f6edda','#f1e4c8','#edddb9','#e9d5aa','#e5cd9b','#e1c58a','#ddbd79'],
// 	// Snow: ['#ddbd79','#dfc386','#e1c892','#e3cea1','#e6d5b2','#e9dcc2','#ece4d3','#ede8dc','#ffffff'],
// 	default: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
// };

export const colorArray = {
	Temp: ['#003b9c','#4eac32','#eff15b', '#e7aa1f','#b93326'],
	HDD: ['#b93326','#e7aa1f','#eff15b','#4eac32','#003b9c'],
	Daylight: ['#001e63', '#fcfc80'],
	Precipitation: ['#ffffcc', '#165312'],
	Evap: ['#165312', '#ffffcc'],
	Snow: ['#ffffcc', '#2147b1'],
	default: ['#ffffcc', '#932012'],
};

export const gridColorArray = {
  "Daylight": colorArray["Daylight"],
  "HDD18": colorArray["HDD"],
  "Precipitation": colorArray["Precipitation"],
  "CDDhum18": colorArray["Temp"],
  "CDD18": colorArray["Temp"],
  "HeatIndex": colorArray["Temp"],
  "Humidex": colorArray["Temp"],
  "Temperaturemin": colorArray["Temp"],
  "Temperaturemax": colorArray["Temp"],
  "Temperature": colorArray["Temp"],
  "Cloud": colorArray["Snow"],
  "Evaporation": colorArray["Evap"],
  "Snowfall": colorArray["Snow"],
  "DNI": colorArray["default"],
  "GHI": colorArray["default"],
  "Runoff": colorArray["default"],
  "RH": colorArray["Snow"],
  "Wind10int": colorArray["Snow"],
  "Wind100int": colorArray["Snow"],
  "Wind100power": colorArray["Snow"],
}

export function checkIfAnomaly(type, range, newValue) {
	let tempRange = [...range];
	if (type === 'Anomalies') {
		if (range.length === 2) tempRange.splice(1, 0, newValue)
		if (range.length > 4) tempRange.splice(2, 1, newValue)
	}
	return tempRange;
}

export function getAnomalyMinMax(minMax) {
	let min = minMax[0], max = minMax[1];
	let mi = min < 0 ? -min : min;
	let ma = max < 0 ? -max : max;
	return mi > ma ? [min, -min] : mi < ma ? [-max, max] : [min, max]
}

export function colorsByVariables(selector, countries, colType, valueType, territoryMinMax) {

	let tempColors = !colorArray[colType] ? colorArray.default : colorArray[colType];
	let tempCountries = [...countries], nullColor = '#a3a3a3', colors = [];
	let minMax = valueType === 'Anomalies'
		? getAnomalyMinMax(territoryMinMax)
		: territoryMinMax;
	let pivotValue = (minMax[1] - minMax[0]) / (tempColors.length - 1);
	let valueRange = [];

	for (let i = 1; i < tempColors.length - 1; i++) valueRange.push((pivotValue * i) + minMax[0]);

	valueRange.splice(0, 0, minMax[0]);
	valueRange.splice((valueRange.length * 2) + 1, 0, minMax[1]);

	let range = checkIfAnomaly(valueType, valueRange, 0);
	let colorRange = checkIfAnomaly(valueType, tempColors, '#424242')

	let contScale = scaleLinear()
		.domain(range)
		.range(colorRange);

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

