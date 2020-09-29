import _ from 'lodash';
import { scaleLinear } from 'd3-scale';

// Parse data by conuntries for heatmap
export const countryShape = data => {

    /*
     *  Group data by exit & entry then,
     *  Merge the two under three conditions:
     *      1. exit tx is unique .
     *      2. entry tx is unique.
     *      3. if duplicate, merge while subtracting exit value from entry value.
     */

    function valueByTxType(data, type){
        return _
        .chain(data)
        .groupBy(d => d[type])
        .map(d => {
            return {
                ISO3: d[0][`${type}_ISO3`],
                country: d[0][type],
                [type]: d.reduce((a,b) => a + parseInt(b.total), 0)
            }
        })
        .value()
    }

    function concatExitEntryValues(d) {
        return d.length > 1 
            ? { ...d[0], exit: d[0].exit, entry: d[1].entry }
            : d.length === 1 && d[0].entry
            ? { ...d[0], exit: 0 } 
            : { ...d[0], entry: 0 } 
    }

    const exit = valueByTxType(data, 'exit');
    const entry = valueByTxType(data, 'entry');

    function mergeCountry(data) {
        return _.chain(data)
            .groupBy(d => d.country)
            .map(d => concatExitEntryValues(d))                
            .value()
    }

    // const entryIds = entry.reduce((c, o, i) => {
    //     c[o.ISO3] = i;
    //     return c;
    // }, []);
    // exit.forEach(o => {
    //     if (entryIds[o.ISO3] !== undefined) {
    //         entry[entryIds[o.ISO3]].value -= o.value;
    //     } else {
    //         entry.push({...o, entry: 0});
    //     }
    // });
    return mergeCountry(exit.concat(entry));
}

// Parse data by borderpoints
export const borderPoints = data => (
    /*
     *  Group data by borderpoints,
     *  create new array by merging tx by borderpoints
     *  :new property 'tx': array with all transactions
     */
    _.chain(data)
    .groupBy(d => d.borderpoint)
    .map(d => {
        return {
            borderpoint: d[0].borderpoint,
            lonlat: [ parseFloat(d[0].lon), parseFloat(d[0].lat) ],
            totalValue: d.reduce((a,b) => a + parseInt(b.total), 0),
            tx: getTx(d)
        }
    })
    .value()
)

function getTx(d){
    let temp = []
    for (let i in d) {
        temp.push({
            exit_ISO3: d[i].exit_ISO3,
            exit: d[i].exit,
            entry_ISO3: d[i].entry_ISO3,
            entry: d[i].entry,
            value: parseInt(d[i].total)
        })
    }
    return temp;
}

// Get country shape colorbased on transaction amount
export const getCountryColor = (countries, colors) => {
    
    let outputWithColors = [...colors];

    const linearScale = scaleLinear()
        .domain([
            Math.min.apply(Math, countries.map(c => { return c.entry - c.exit; })),
            Math.max.apply(Math, countries.map(c => { return c.entry - c.exit; }))
        ])
        .range([0, 5]);
    
    const scaledValue = countries.reduce((output, country) => {
        let value = linearScale(country.entry - country.exit);
        if( 0 <= value && value < 1 ) output[0].push(country.ISO3);
        else if( 1 < value && value < 2 ) output[1].push(country.ISO3);
        else if( 2 < value && value < 3 ) output[2].push(country.ISO3);
        else if( 3 < value && value < 4) output[3].push(country.ISO3);
        else if( 4 < value && value <= 5) output[4].push(country.ISO3);
        return output;
    }, [[], [], [], [], []]);
    
    scaledValue.forEach((value, idx) => {
        let countryPos = (idx * 2) + 1;
        outputWithColors.splice(countryPos, 0, ["match", ["get", "ISO3"], value, true, false ])
    })
    return outputWithColors
}

export const getBorderPointCountriesColor = tx => {
    
    function getValue(d, type) {
        return d.map(c => ({ country: c[type], ISO3: c[`${type}_ISO3`], value: c.value}))
    }

    const txArray = JSON.parse(tx);
    const entry = getValue(txArray,'entry');
    const exit = getValue(txArray,'exit');
    
    const entryIds = entry.reduce((c,o,i) => {
            c[o.country] = i;
        return c;
    }, []);

    exit.forEach(o => {
        if (entryIds[o.country] !== undefined) {
            entry[entryIds[o.country]].value -= o.value;
        } else {
            entry.push({ ...o, value: -o.value});
        }
    })
    
    const linearScale = scaleLinear()
        .domain([
            Math.min.apply(Math, entry.map(c => { return c.value; })),
            Math.max.apply(Math, entry.map(c => { return c.value; }))
        ])
        .range([0, 5]);

    let array = [];
    for (let i = 0; i < entry.length; i ++ ){
        let empty = [];
        array.push(empty);
    }
    entry.forEach((d,idx) => {
        if( 0 <= linearScale(d.value) && linearScale(d.value) < 1 ) {
            array[0].push(d.ISO3)
        }
        else if( 1 < linearScale(d.value) && linearScale(d.value) < 4 ) {
            array[1].push(d.ISO3)
        }else{ 
            if ( entry.length  === 2 ) array[1].push(d.ISO3);
            else array[2].push(d.ISO3);
        }
    })

    const resultsWithColor = [
        'case',
        '#00CDB0',
        '#0076C0',
        '#1355A3', 
        '#a3a3a3'
    ];
    let result = [];
    let i = 0;

    while(i < array.length) {
        if ( array[i].length !== 0) {
            result.push(array[i])
        }
        i++
    }
    if ( result.length === 2 ) resultsWithColor.splice(2,1)
    result.forEach((value, idx) => {
        let countryPos = (idx * 2) + 1;
        resultsWithColor.splice(countryPos, 0, ["match", ["get", "ISO3"], value, true, false ])
    })
    return resultsWithColor
}

const formatNum = x =>  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export function getCountryInfo(countries, selected) {
    const selectedCountry = countries.filter(country => country.ISO3 === selected)[0];
	return `
		<strong>${selectedCountry.country}</strong>
		<p>Total Exited: ${formatNum(selectedCountry.exit)} MM3</p>
		<p>Total Entered: ${formatNum(selectedCountry.entry)} MM3</p>
	`
}

export function getBorderPointInfo(selected) {
	let txs = JSON.parse(selected.tx);
	let tx = txs.map(t => `<p>${t.exit} to ${t.entry}: ${formatNum(t.value)} MM3</p>`)
	let tx_result = tx.length === 3
		? tx[0].concat(tx[1]).concat(tx[2]) 
		: tx.length === 2
		? tx[0].concat(tx[1])
		: tx[0]

	return ` 
		<strong>Border point: ${selected.borderpoint}</strong> 
		${tx_result}
	`
}

