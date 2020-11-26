import React, { useState, useEffect, useCallback }  from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CDD from './CDD'
import variables from './assets/variables.json'
import { legendColors, heatpumpDataMap, serviceDataMap, getCountryNameByISO } from './assets/util'
import { MapContainer } from '../../../components/container'
import { Bars } from '../../../components/bars'
import { Legends } from '../../../components/legends'
import { ControlWrapper, Control, ControlContainer } from '../../../components/controls'

function CDDWrapper({ baseURL }) {

  const { mapTypes, years, maps, serviceNeeds, scenarios, regions } = variables;

  const [active, setActive] = useState({ open: false, target: null });
  const [mapType, setMapType] =useState(Object.keys(mapTypes)[0]);
  const [year, setYear] = useState(years[0]);
  const [indicators, setIndicators] = useState(null);
  const [heatpumpData, setHeatpumpData] = useState([]);
  const [country, setCountry] = useState('SVK');
  const [scenario, setScenario] = useState(scenarios.sds);
  const [region, setRegion] = useState('World'); 
  const [map, setMap] = useState(Object.keys(maps)[0]);

  const DEFAULT_SERVICE_NEED = { "cooling": 1, "heating": 1, "both": 0 };
  const [serviceNeed, setServiceNeed] = React.useState(serviceNeeds[map][DEFAULT_SERVICE_NEED[map]]); 
  
  const isService = mapType === 'service';
  const byMapType = {
    service: {
      filter: serviceDataFilter,
      map: serviceDataMap 
    },
    heatpump: {
      filter: heatpumpDataFilter,
      map: heatpumpDataMap 
    }
  }
  
  const tempIndicators = indicators ? [ ...indicators ] : [];
  const currIndicator = tempIndicators
    .filter(byMapType[mapType].filter)
    .map(byMapType[mapType].map);

  const currHeatpumpData = heatpumpData.map(mapHeatpumpData);

  const controls = [
		{ 
			type: 'buttonGroup',
      options: Object.keys(mapTypes).map(item => ({ label: mapTypes[item], value: item })),
      selected: mapType,
      dark: true,
      flow: 'row',
      click: e => setMapType(e.value),
    },
    {
      type: 'buttonGroup',
      options: years,
      selected: year,
      dark: true,
      flow: 'row',
			click: value => setYear(value)
    },
    {
      type: 'buttonGroup',
      options: Object.values(scenarios),
      selected: scenario,
      dark: true,
      flow: 'row',
      click: value => setScenario(value),
    },
    {
      type: isService && 'radio',
      options: Object.keys(maps).map(item => ({ label: maps[item], value: item })),
      flow: 'column',
      selected: map,
      change: value => { 
        setMap(value) 
        setServiceNeed(serviceNeeds[value][DEFAULT_SERVICE_NEED[value]]) 
      }    
    },
    {
      type: isService && 'dropdown',
      label: 'Type of service needs',
      options: serviceNeeds[map],
      selected: serviceNeed,
      active: active,
      open: e => setActive({ open: true, target: e.target.value }),
      click: value => setServiceNeed(value)
    },
    {
      type: isService && 'divider',
      marginBottom: "15px"
    }
  ];
  
  let regionDropdown = [
    {
      type: isService && 'dropdown',
      label: 'Regions',
      dark: true,
      options: regions,
      top: true,
      click: value => setRegion(value),
      style: 'horizontal',
      open: e => open(e),
      hide: e => hide(e),
      active: active,
      selected: region,
    }
  ];


  let legends = [
    {
      type: 'continuous',
      header: mapType === 'HDD' ? 'Heating degree days' : 'Cooling degree days',
      subInHeader: false,
      labels: mapType === 'HDD' ? [0, 12000] : [0, 6000],
      colors: legendColors[mapType][map],
      round: false
    }
  ];


  const open = e => {
    setActive({ open: true, target: e.target.value })
  }


  const hide = useCallback(() => {
    setActive({ open: false, target: null })
    document.removeEventListener('click', hide)
  },[])


  useEffect(() => {
    if (!active.open) return;
    document.addEventListener('click', hide)
	},[ active.open,  hide ])


  useEffect(() => { 
    let url = mapType === 'service' ? variables.maps[map] : 'Heat pump index'
    axios
      .get(`${baseURL}etp/CDD/${url}.csv`)
      .then(response => {
        const tempData = Papa.parse(response.data, { header: true }).data;
        setIndicators(tempData)
      })
  },[baseURL, map, mapType])


  useEffect(() => { 
    if (mapType === 'service') return;
    axios
      .get(`${baseURL}etp/CDD/Heat pump index map.csv`)
      .then(response => {
        const tempData = Papa.parse(response.data, { header: true }).data;
        const filteredData = tempData.filter(d => getCountryNameByISO(d.Code))
        setHeatpumpData(filteredData)
      })
  },[baseURL, mapType])


  function serviceDataFilter(d) {
    let is2019 =  d.region === region && d.scenario === '0';
    let isNot2019 = d.region === region && d.scenario === scenario && Number(d.year) === year;
    return year === 2019 ? is2019 : isNot2019;   
  }


  function heatpumpDataFilter(d) {
    let is2019 =  d.ISO === country && d.scenario === '0';
    let isNot2019 = d.ISO === country && d.scenario === scenario && Number(d.year) === year;
    return year === 2019 ? is2019 : isNot2019;   
  }

  function mapHeatpumpData(d) {
    let result = { ISO: d.Code, country: d.Country};
    console.log(`${scenario}-${year}`);
    year === 2019 
      ? result.value = d[2019]
      : result.value = d[`${year}-${scenario}`]
      
    return result
  }

  console.log(currHeatpumpData)
  
  return (
    <MapContainer selector='CDD' loaded={currIndicator}>
      <CDD
        years={year}
        mapType={mapType}
        region={region}
      />
      <ControlWrapper dark bg>
        <ControlContainer position='topLeft' style={{'width': '320px'}}> 
          {controls.map((control, idx) => 
            <Control key={idx} {...control} /> )}
          {regionDropdown.map((drop, idx) => 
            <Control key={idx} {...drop} /> )}
          {isService 
            ? <Bars dark data={currIndicator}/>
            : (!country 
              ? <p>Select a territory by clicking on the map</p>
              : <Bars dark label={currIndicator[0] && currIndicator[0].title} data={currIndicator}/>)}
        </ControlContainer>
        <ControlContainer position='bottomRight'>
          {legends.map((legend, idx) => 
            <Legends key={idx} {...legend} />)}
        </ControlContainer>
      </ControlWrapper>
    </MapContainer>
  )
}

export default CDDWrapper;

