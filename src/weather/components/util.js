export function colorsByVariables(countries, type, viewUnit) {
	let ranges = {
		month: {
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

	let countriesByValueRange = [];
	let testCountries = [...countries];
	let { colors, values } = ranges[viewUnit][type];

	for ( let i = 0; i < values.length; i ++ ) {
		countriesByValueRange.push([]);
	}

	testCountries.forEach(country => {
		let value = country.value, item = country.ID;
		for (let i = 0; i < values.length; i++) {
			let singleValue = values[i].length === 1;
			let min = values[i][0], max = values[i][1];
			if ( singleValue && i === 0 ) {
				if ( min === value ) countriesByValueRange[i].push(item)
			} else if ( singleValue && i === values.length -1 ){
				if ( min < value ) countriesByValueRange[i].push(item)
			} else {
				if ( min < value && value < max ) countriesByValueRange[i].push(item)
			}
		}
	});

	countriesByValueRange.forEach((value, idx) => {
		let countryPos = (idx * 2);
		colors.splice(countryPos, 0, ["match", ["get", "ISO3_CODE"], value, true, false ])
	})
	colors.splice(0,0, 'case');
	colors.splice((colors.length * 2) + 1, 0, '#a3a3a3');
	console.log(colors);
	return colors;
}

export function getCountryPopupInfo(countries, selected, timeIdx) {
	const selectedCountry = countries.filter(country => country.ISO3 === selected)[0];
	if ( selected && selectedCountry ) {
		return `
			<strong>${selectedCountry.country}</strong>
			<p>Value: ${selectedCountry.data[timeIdx]}</p>
		`
	}
	return `<b>Value doe not exist for this country</b>`
}


