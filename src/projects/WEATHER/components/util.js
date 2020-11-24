import React from 'react'
import countries from '../assets/countriesIso.json'
import { scaleLinear } from 'd3-scale'

export const colorArray = {
	Temp: ['#003b9c','#4eac32','#eff15b', '#e7aa1f','#b93326'],
	HDD: ['#b93326','#e7aa1f','#eff15b','#4eac32','#003b9c'],
	Daylight: ['#001e63', '#fcfc80'],
	Precipitation: ['#ffffcc', '#88a76d', '#165312', '#0f360d', '#091b08'],
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

const floor = num => Math.floor(parseFloat(num));
const ceil = num  => Math.ceil(parseFloat(num));
export const uppercase = str => str.charAt(0).toUpperCase() + str.slice(1);
export const getCountryNameByISO = iso => !countries.find(d => d.ISO3 === iso) ? null : countries.find(d => d.ISO3 === iso).region;
export const getCentroidLabelByISO = _ => ["to-string", ["get", "region"]];
export const getMonthString = date => new Date(1, date - 1, 1).toLocaleString('default', { month: 'long' });
export const useIntervalLogic = (entries, interval) => entries[['year', 'month', 'day'].findIndex(d => d === interval)];
export const disputedRegionsISO = ["ABCDE", "ABCD", "VAT", "SMR", "MAF", "VGB", "AND", "BVT", "MCO", "CXR", "LIE", "ABCD-PSE"];
export const disputedRegionsID = [61, 255, 253, 87, 233, 86, 228];

export function isAnomaly(type, range, newValue) {
	let tempRange = [...range];
	if (type === 'Anomalies') {
		if (range.length === 2) tempRange.splice(1, 0, newValue)
		if (range.length > 4) tempRange.splice(2, 1, newValue)
	}
	return tempRange;
}

function getAnomalyMinMax(minMax) {
	let min = Number(minMax[0]), max = Number(minMax[1]);
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

	let range = isAnomaly(valueType, valueRange, 0);
	let colorRange = isAnomaly(valueType, tempColors, '#424242')
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
}

export function getTerritoryMinMax(minmax, type, group) {
	let result = [0,0];
	if (!minmax) return result;
	let isPrecip = group === 'Precipitation';

	if (type === 'anomaly') {
		result = getAnomalyMinMax([ceil(minmax[0]), floor(minmax[1])]);
		if (isPrecip) {
			result = getAnomalyMinMax([minmax[0].toFixed(1), minmax[1].toFixed(1)]);
			result = [`≤ ${result[0]}`,`≥ ${result[1]}`];
		}
	} else {
		result = isPrecip 
			? [minmax[0].toFixed(1), `≥ ${minmax[1].toFixed(1)}`]
			: [ceil(minmax[0]), floor(minmax[1])];
	}
	return result;
}

export function getGridMinMax(minmaxValues, type, mapType, idx, group, id) {
	
	if (mapType === 'territory') return;
	
	let minmax = minmaxValues[idx];
	let isPrecip = group === 'Precipitation', 
	isEvap = id === 'Evaporation', 
	isAnomaly = type === 'anomaly',
	isWind = group === 'Wind' && (id === 'Wind100int' || id === 'Wind10int');

	let fParseOne = e => parseFloat(Number(e).toFixed(1));
	let fParseTwo = e => parseFloat(Number(e).toFixed(2));
	
	if (type === 'climatology') minmax = minmaxValues;
	
	if (isAnomaly) {
		if (isPrecip && isEvap) minmax = getAnomalyMinMax([fParseTwo(minmax[0]), fParseTwo(minmax[1])]);
		else if (isPrecip && !isEvap) {
			minmax = getAnomalyMinMax([fParseOne(minmax[0]), fParseOne(minmax[1])]);
			minmax = [`≤ ${minmax[0]}`, `≥ ${minmax[1]}`];
		} else {
			minmax = getAnomalyMinMax(minmax)
			if (isWind) minmax = [`≤ ${ceil(minmax[0])}`, `≥ ${floor(minmax[1])}`];
		}
	} else {
		if (isPrecip && isEvap) minmax = [minmax[0].toFixed(2), minmax[1].toFixed(2)];
		else if (isPrecip && !isEvap) minmax = [minmax[0].toFixed(1), `≥ ${(minmax[1]).toFixed(1)}`];
		else if (isWind) minmax = [ceil(minmax[0]), `≥ ${floor(minmax[1])}`];
		else minmax = [ceil(minmax[0]), floor(minmax[1])];	
	}

	return minmax 
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

