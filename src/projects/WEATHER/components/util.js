import React from 'react'
import countries from './assets/countriesIso.json'
import { scaleQuantile } from 'd3-scale'

export const uppercase = str => str.charAt(0).toUpperCase() + str.slice(1);
export const getCountryNameByISO = iso => !countries.find(d => d.ISO3 === iso) ? null : countries.find(d => d.ISO3 === iso).region;
export const getCentroidLabelByISO = _ => ["to-string", ["get", "region"]];
export const getMonthString = date => new Date(1, date - 1, 1).toLocaleString('default', { month: 'long' });
export const useIntervalLogic = (entries, interval) => entries[['year', 'month', 'day'].findIndex(d => d === interval)];
export const disputedRegionsISO = ["ABCDE", "ABCD-ESH", "ABCD", "VAT", "SMR", "MAF", "VGB", "AND", "BVT", "MCO", "CXR", "LIE", "ABCD-PSE"];
export const disputedRegionsID = [61, 255, 253, 87, 233, 86];

export const colorArray = {
	default: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
	CDD: ['#008712','#5aaa1a','#96c11f','#dce029','#fee929','#f1c92b','#df9b2e','#c86031','#b93326'],
	HDD: ['#ffffe0', '#afdcd8', '#98c7d1', '#83b2c8', '#719cc0', '#4e72ad', '#3b5ea3', '#264a9a', '#003790'],
	Cloud: ['#ffffff','#e6e6e6','#cbcbcb','#bdbdbd','#a3a3a3','#8f8f8f','#7b7b7b','#636363','#4a4a4a'],
	Precipitation: ['#ffffff','#e3ece2','#cadcc8','#a4c3a2','#93b790','#6a9c66','#528c4e','#3c7e38','#165312'],
	Humidity: ['#ffe470','#e8d473','#c8bf77','#a8a97b','#85917f','#657b83','#4a6987','#29538b','#003790']
};

const gridColors = {
	"default": ["#ffffcc", "#e3c7a7", "#ce9c8b", "#c77165", "#c1463f", "#b60000"],
  "CDD": ["#008712", "#61ac1b", "#cac522", "#e7d939", "#dd9328", "#b93326"],
  "HDD": ["#ffffe0", "#ccd7d0", "#9eb3c2", "#698ab1", "#3561a1", "#003790"],
  "Wind": ["#ffffff", "#d9d9d9", "#b5b5b5", "#8a8a8a", "#606060", "#393939"],
  "Snow": ["#b6a969", "#c2b784","#cec59f","#dad4bb","#e5e2d4","#f0f0f0"],
  "Precipitation": ["#ffffff","#cedbcd","#a4bca2","#759a73","#477744","#165312"],
  "Humidity": ["#ffe470","#c9c077","#9ba17d","#6b8083","#3d6189","#003790"]
}

export const gridColorArray = {
  "IEA_HDD18monthly": gridColors["HDD"],
  "IEA_Precipitationmonthly": gridColors["Precipitation"],
  "IEA_Snowfallmonthly": gridColors["Snow"],
  "IEA_Cloudmonthly": gridColors["Snow"],
  "IEA_Evaporationmonthly": gridColors["Snow"],
  "IEA_Wind10intmonthly": gridColors["Wind"],
  "IEA_Wind100intmonthly": gridColors["Wind"],
  "IEA_CDDhum18monthly": gridColors["CDD"],
  "IEA_CDD18monthly": gridColors["CDD"],
  "IEA_Daylightmonthly": gridColors["default"],
  "IEA_DNImonthly": gridColors["default"],
  "IEA_GHImonthly": gridColors["default"],
  "IEA_Runoffmonthly": gridColors["default"],
  "IEA_Temperatureminmonthly": gridColors["default"],
  "IEA_Temperaturemaxmonthly": gridColors["default"],
  "IEA_Temperaturemonthly": gridColors["default"],
}

export const GRID_LAYERS = {
	"Temperaturedailybypop": "IEA_Temperaturemonthly",
	"Temperaturemaxdailybypop": "IEA_Temperaturemaxmonthly",
	"Temperaturemindailybypop": "IEA_Temperatureminmonthly",
	"CDD18dailybypop": "IEA_CDD18monthly",
	"CDDhum18dailybypop": "IEA_CDDhum18monthly",
	"HDD18dailybypop": "IEA_HDD18monthly",
	"Precipitationdaily": "IEA_Precipitationmonthly",
	"Snowfalldaily": "IEA_Snowfallmonthly",
	"Runoffdaily": "IEA_Runoffmonthly",
	"Evaporationdaily": "IEA_Evaporationmonthly",
	"Daylightdaily": "IEA_Daylightmonthly",
	"DNIdaily": "IEA_DNImonthly",
	"GHIdaily": "IEA_GHImonthly",
	"Wind100intdaily": "IEA_Wind100intmonthly",
	"Wind10intdaily": "IEA_Wind10intmonthly",
	"Clouddaily": "IEA_Cloudmonthly"
};

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

export function usePrevious(value) {
	const ref = React.useRef();
	React.useEffect(() => {
		ref.current = value
	})
	return ref.current;
}

