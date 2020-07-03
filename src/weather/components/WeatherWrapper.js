import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Weather from './Weather';
import { Control, Button, Slider, Dropdown } from '../../components/controls';
import Papa from 'papaparse';

export default function(props) {

  const [data, setData] = useState(null);
	
	const [viewUnit, setViewUnit] = useState('month');
	const [indicator, setIndicator] = useState('hdd');
	const [viewType, setViewType] = useState('Country');
	const wrapperRef = React.useRef(null);
	const { active } = useDetectClick(wrapperRef, indicator);

  const INDICATOR_LIST = [
    'hdd',
    'cdd',
    'solar radiation',
  ];  
	let month = 'Apr';
	
	let URL = `${props.baseURL}weather/country/${viewUnit}/${indicator}.csv`;
	if ( viewUnit === 'day') URL = `${props.baseURL}weather/country/day/solar radiation/${month}.csv`;
  
  useEffect (() => {
		if ( viewType !== 'Country') return;
		axios.get(URL)
			.then(response => {
				const COUNTRY2ISO3 = {"Afghanistan":"AFG","Aland":"FIN","Albania":"ALB","Algeria":"DZA","American Samoa":"ASM","Andorra":"AND","Angola":"AGO","Anguilla":"AIA","Antigua and Barbuda":"ATG","Argentina":"ARG","Armenia":"ARM","Aruba":"ABW","Australia":"AUS","Austria":"AUT","Azerbaijan":"AZE","Bahamas":"BHS","Bahrain":"BHR","Bangladesh":"BGD","Barbados":"BRB","Belarus":"BLR","Belgium":"BEL","Belize":"BLZ","Benin":"BEN","Bermuda":"BMU","Bhutan":"BTN","Bolivia":"BOL","Bonaire":"ANT","Bosnia and Herzegovina":"BIH","Botswana":"BWA","Bouvet Island":"BVT","Brazil":"BRA","British Indian Ocean Territory":"IOT","British Virgin Islands":"VGB","Brunei Darussalam":"BRN","Bulgaria":"BGR","Burkina Faso":"BFA","Burundi":"BDI","Cabo Verde":"CPV","Cambodia":"KHM","Cameroon":"CMR","Canada":"CAN","Cayman Islands":"CYM","Central African Republic":"CAF","Chad":"TCD","Chile":"CHL","China (People's Republic of)":"CHN","Chinese Taipei":"CHN","Christmas Island":"CXR","Colombia":"COL","Comoros":"COM","Congo":"COG","Cook Islands":"COK","Costa Rica":"CRI","Côte d'Ivoire":"CIV","Croatia":"HRV","Cuba":"CUB","Curacao":"ANT","Cyprus":"CYP","Czech Republic":"CZE","Democratic Republic of the Congo":"COD","Denmark":"DNK","Djibouti":"DJI","Dominica":"DMA","Dominican Republic":"DOM","Democratic People's Republic of Korea":"PRK","Ecuador":"ECU","Egypt":"EGY","El Salvador":"SLV","Equatorial Guinea":"GNQ","Eritrea":"ERI","French Southern and Antarctic Lands":"ATF","Estonia":"EST","Ethiopia":"ETH","Faroe Islands":"FRO","Fiji":"FJI","Finland":"FIN","Former Yugoslav Republic of Macedonia":"MKD","France":"FRA","French Guiana":"FRA","French Polynesia":"PYF","Gabon":"GAB","Gambia":"GMB","Georgia":"GEO","Germany":"DEU","Ghana":"GHA","Greece":"GRC","Greenland":"GRL","Grenada":"GRD","Guadeloupe":"FRA","Guam":"GUM","Guatemala":"GTM","Guernsey":"GGY","Guinea":"GIN","Guinea-Bissau":"GNB","Guyana":"GUY","Haiti":"HTI","Heard Island and McDonald Islands":"HMD","Holy See":"VAT","Honduras":"HND","Hong Kong (China)":"HKG","Hungary":"HUN","Iceland":"ISL","India":"IND","Indonesia":"IDN","Iran":"IRN","Iraq":"IRQ","Ireland":"IRL","Isle of Man":"IMN","Israel":"ISR","Italy":"ITA","Jamaica":"JAM","Japan":"JPN","Jersey":"JEY","Jordan":"JOR","Kazakhstan":"KAZ","Kenya":"KEN","Kiribati":"KIR","Korea":"KOR","Kosovo":"SRB","Kuwait":"KWT","Kyrgyzstan":"KGZ","Lao People's Democratic Republic":"LAO","Latvia":"LVA","Lebanon":"LBN","Lesotho":"LSO","Liberia":"LBR","Libya":"LBY","Liechtenstein":"LIE","Lithuania":"LTU","Luxembourg":"LUX","Macau (China)":"MAC","Madagascar":"MDG","Malawi":"MWI","Malaysia":"MYS","Maldives":"MDV","Mali":"MLI","Malta":"MLT","Marshall Islands":"MHL","Martinique":"FRA","Mauritania":"MRT","Mauritius":"MUS","Mayotte":"MYT","Mexico":"MEX","Micronesia":"FSM","Moldova":"MDA","Monaco":"MCO","Mongolia":"MNG","Montenegro":"MNE","Montserrat":"MSR","Morocco":"MAR","Mozambique":"MOZ","Myanmar":"MMR","Namibia":"NAM","Nauru":"NRU","Nepal":"NPL","Netherlands":"NLD","New Caledonia":"NCL","New Zealand":"NZL","Nicaragua":"NIC","Niger":"NER","Nigeria":"NGA","Niue":"NIU","Norfolk Island":"NFK","Northern Mariana Islands":"MNP","Norway":"NOR","Oman":"OMN","Pakistan":"PAK","Palau":"PLW","Panama":"PAN","Papua New Guinea":"PNG","Paraguay":"PRY","Peru":"PER","Philippines":"PHL","Pitcairn":"PCN","Poland":"POL","Portugal":"PRT","Puerto Rico":"PRI","Qatar":"QAT","Reunion":"FRA","Romania":"ROU","Russia":"RUS","Rwanda":"RWA","Saba":"ANT","Saint Barthelemy":"FRA","Saint Eustatius":"ANT","Saint Helena":"SHN","Saint Kitts and Nevis":"KNA","Saint Lucia":"LCA","Saint Martin":"FRA","Saint Pierre and  Miquelon":"SPM","Saint Vincent and the Grenadines":"VCT","Samoa":"WSM","San Marino":"SMR","Sao Tome and Principe":"STP","Saudi Arabia":"SAU","Senegal":"SEN","Serbia":"SRB","Seychelles":"SYC","Sierra Leone":"SLE","Singapore":"SGP","Sint Maarten":"ANT","Slovak Republic":"SVK","Slovenia":"SVN","Solomon Islands":"SLB","Somalia":"SOM","South Africa":"ZAF","South Georgia and the South Sandwich Isla":"SGS","South Sudan":"SDN","Spain":"ESP","Sri Lanka":"LKA","Sudan":"SDN","Suriname":"SUR","Svalbard and Jan Mayen":"SJM","Eswatini":"SWZ","Sweden":"SWE","Switzerland":"CHE","Syrian Arab Republic":"SYR","Tajikistan":"TJK","Tanzania":"TZA","Thailand":"THA","Timor-Leste":"TLS","Togo":"TGO","Tokelau":"TKL","Tonga":"TON","Trinidad and Tobago":"TTO","Tunisia":"TUN","Turkey":"TUR","Turkmenistan":"TKM","Turks and Caicos Islands":"TCA","Tuvalu":"TUV","Uganda":"UGA","Ukraine":"UKR","United Arab Emirates":"ARE","United Kingdom":"GBR","United States":"USA","United States Minor Outlying Islands":"UMI","United States Virgin Islands":"VIR","Uruguay":"URY","Uzbekistan":"UZB","Vanuatu":"VUT","Venezuela":"VEN","Viet Nam":"VNM","Wallis and Futuna":"WLF","West Bank and Gaza Strip":"PSE","Western Sahara":"ESH","Yemen":"YEM","Zambia":"ZMB","Zimbabwe":"ZWE"};
				const fetchResult = Papa.parse(response.data, { header: false }).data;
				function getData(data){
					return data.reduce((result, country) => {
						let ws = country[0] === 'Western Sahara';
						let iso =  COUNTRY2ISO3[country[0]];
						let duplicate = result.find(item => item.ISO3 === iso);
				
						if (!duplicate && !ws && iso) {
							result.push({ 
								country: country.splice(0,1)[0], 
								ISO3: iso,
								data: country
							});
						}
						return result;
					},[])
				}

				// Get time range of data
				function getTimeRange() {
					let temp = [...fetchResult[0]],
					idx = temp.indexOf('country');
					temp.splice(idx, 1)
					return temp;
				}
				setData({
					tempData: getData(fetchResult),
					timeRange: getTimeRange(),
					type: indicator,
        
        })				
        
			})
	}, [URL, indicator])

	function useDetectClick(ref, indicator) {
		const [active, setActive] = React.useState(false);
		console.log(indicator);

		React.useEffect(() => {
			function handleClickOutside(event) {
				let clickedOutside = ref.current && !ref.current.contains(event.target);
				if ( clickedOutside ) {
					setActive(false);
				} else {
					setActive(true);
				}
			}
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}, [ref, active]);
		return { active }
	}
  if (!data) return <div>Loading...</div>

	return (
		<>
			<Weather
				data={data}
				indicators={INDICATOR_LIST}
				viewUnit={viewUnit}
				monthOfDayView={month}
				// changeIndicator={value => setIndicator(value)}
				changeViewUnit={value => setViewUnit(value)}
			/>
			<Control>
				<Button 
					list={['Country', 'Grid']}
					click={(value) => setViewType(value)}
					selected={viewType}
				/>
				<Dropdown
					label='Indicators'
					list={INDICATOR_LIST}
					wrapperRef={wrapperRef}
					click={value => useDetectClick(wrapperRef, value)}
					// click={value => setIndicator(value)}
					active={active}
					selected={indicator}
				/>
				<Button 
					list={['month', 'day']}
					click={(e) => setViewUnit(e.target.value)}
					selected={viewUnit}
				/>
				<Slider 
					width={'100%'}
					height={10}
					margin={10}
					time={50}
					range={[0, data.timeRange.length - 1]}
					toggleChange={value => console.log(value)}
					// toggleChange={value => setTime(timeRange[value])}
				/>
			</Control>
		</>
  )
};