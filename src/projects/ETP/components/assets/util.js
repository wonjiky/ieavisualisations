import countriesISO from '../assets/countriesIso.json'
import { scaleLinear } from 'd3-scale'

export const legend = {
  service: {
    heating: {
			color: ['#ffffcc', '#0a2674'],
			minmax: [0, '> 8000']
		},
    both: {
			color: ['#003b9c','#4eac32','#eff15b', '#e7aa1f','#b93326'],
			minmax: ['< -15', '> 30']
		},
    cooling: {
			color: ['#4eac32','#eff15b','#d38e3f','#b93326'],
			minmax: [0, `> 6500`]
		}
	},
  heatpump: {
			color: ["#b93326", "#d38e3f", "#eff15b", "#4eac32"],
			minmax: [-50, 100],
	}
};

export const serviceDataMap = d => ({ label: d.variable, value: d.value });
export const heatpumpDataMap = d => ({ title: d.title, label: d.variable, value: d.value });
export const getCountryNameByISO = iso => !countriesISO.find(d => d.ISO3 === iso) ? null : countriesISO.find(d => d.ISO3 === iso);
export const countriesWithNoValue = ["MSR","MLI","UMI","BTN","NCL","BES","VIR","GUY","KNA","MDG","DMA","GRD","TON","MAF","ABCD","NIU","PLW","FRO","LCA","TKL","SLE","GNB","TCA","DJI","BVT","BFA","VCT","NRU","TUV","BLZ","SMR","ATG","CPV","GNQ","LSO","AND","LIE","PYF","ABCD-PSE","TLS","SLB","SXM","SOM","BRB","FSM","MYT","COM","CYM","PRI","GRL","GGY","BLM","JEY","TCD","NFK","ABCDE","HMD","GMB","ABW","BDI","VGB","COK","KIR","LBR","SGS","AFG","WSM","REU","MDV","GIN","MWI","BHS","BMU","MNP","GUM","GUF","ATF","SHN","IOT","MCO","GLP","STP","CXR","UGA","PCN","MHL","SYC","MTQ","RWA","AIA","IMN","ASM","SJM","FJI","VUT","SWZ","CAF","SPM","MRT","LAO","ESH","PNG","ARM","AZE","MKD"];


export function colorsByVariables(countries, minmax, colorRange) {
  let tempColors = [ ...colorRange ];
  let min = minmax[0], max = minmax[1];
	let tempCountries = [...countries], nullColor = '#a3a3a3', colors = [];
	let pivotValue = (max - min) / (tempColors.length - 1);
	let valueRange = [];

	for (let i = 1; i < tempColors.length - 1; i++) valueRange.push((pivotValue * i) + min);
	
	valueRange.splice(0, 0, min);
	valueRange.splice((valueRange.length * 2) + 1, 0, max);

	let contScale = scaleLinear()
		.domain(valueRange)
		.range(tempColors);

	tempCountries.forEach(countries => {
		let { value, ISO } = countries;
		let assignedColor = contScale(Number(value))
		let unique = colors.indexOf(assignedColor) === -1;
		
		if (unique) {
			colors.push(["match", ["get", 'ISO3'], [ISO], true, false ])
			colors.push(assignedColor)
		} else {
			let idx = colors.findIndex(d => d === assignedColor) - 1;
			colors[idx][2].push(ISO)
		}
	})
  
	colors.splice(0,0, 'case');
	colors.splice((colors.length * 2) + 1, 0, nullColor);
	
	return colors;
}

export function getPopupInfo(countries, selected) {
	const value = countries.filter(country => country.ISO === selected)[0];
	const label = countriesISO.filter(country => country.ISO3 === selected)[0];
	if ( selected && value && label ) {
		if (value === '100') return '<b>No or very low heating needs</b>'
		return `${label.region}</br><b>${value.value} %</b>`
	}
	return `<b>Value doe not exist for this territory</b>`
}