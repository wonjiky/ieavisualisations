import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CDD from './CDD'
import variables from './assets/variables.json'
import { MapContainer } from '../../../components/container'
import { Bars } from '../../../components/bars'
import { Legends } from '../../../components/legends'
import { Controls, Control, ControlContainer } from '../../../components/controls'
import { ETP_LAYERS } from './assets/EtpLayers'

function CDDWrapper(props) {

  const { mapTypes, years, maps, serviceNeeds, scenarios } = variables;

  const [active, setActive] = React.useState({ open: false, target: null });
  const [mapType, setMapType] = React.useState(mapTypes.service);
  const [year, setYear] = React.useState(years[0]);
  const [indicators, setIndicators] = React.useState(null);
  const [scenario, setScenario] = React.useState(scenarios.sds);
  const [region, setRegion] = React.useState('World'); 
  const [map, setMap] = React.useState(Object.keys(maps)[0]);

  const DEFAULT_SERVICE_NEED = { "cooling": 1, "heating": 1, "both": 0 };
  const [serviceNeed, setServiceNeed] = React.useState(serviceNeeds[map][DEFAULT_SERVICE_NEED[map]]); 
  
  let data = [ ...ETP_LAYERS ];
  
  const controls = [
		{ 
			type: 'buttonGroup',
			options: Object.values(mapTypes),
      selected: mapType,
      dark: true,
      flow: 'row',
      click: value => setMapType(value),
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
      type: 'radio',
      options: Object.keys(maps).map(map => ({ label: maps[map], value: map })),
      flow: 'column',
      selected: map,
      change: value => { 
        setMap(value) 
        setServiceNeed(serviceNeeds[value][DEFAULT_SERVICE_NEED[value]]) 
      }    
    },
    {
      type: 'dropdown',
      label: 'Type of service needs',
      options: serviceNeeds[map],
      selected: serviceNeed,
      active: active,
      open: e => setActive({ open: true, target: e.target.value }),
      click: value => setServiceNeed(value)
    }
  ];

  let dropdown = [
    {
      type: 'dropdown',
      label: 'Regions',
      dark: true,
      options: [
        'World',
        'Africa',
        'Asia Pacific',
        'Central & South America',
        'Eurasia',
        'Europe',
        'Middle East',
        'North America'
      ],
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
      colors: mapType === 'HDD' 
        ? ['#ffffe0', '#ccf0df', '#afdcd8', '#98c7d1', '#83b2c8', '#719cc0', '#5f87b7', '#4e72ad', '#3b5ea3', '#264a9a', '#003790']
        : ['#008712', '#99b95e', '#b3c661', '#ccd45f', '#e5e25a', '#ffe06d', '#ffc42a', '#f1ac32', '#e4932f', '#d67a29', '#c96122', '#bb461a', '#b93326'],
      round: false
    },
    {
      type: 'continuous',
      header: 'Population',
      subInHeader: false,
      labels: [0,30000],
      colors: ['#ffffe0', '#ededd3', '#dcdbc6', '#cacab9', '#b9b9ac', '#a9a8a0', '#989794', '#888787', '#78777b', '#686770', '#595864', '#4a4958', '#3b3b4d', '#2d2e42', '#1e2137', '#10142d', '#000023'],
      round: false
    }
  ];

  const finalIndicators = {
    SDS: {
     label: 'Population needing cooling',
     data: []
    },
    STEPS: {
      label: 'Population needing heating',
      data: []
    }
  };

  const open = e => {
    setActive({ open: true, target: e.target.value })
  }

  const hide = React.useCallback(() => {
    setActive({ open: false, target: null })
    document.removeEventListener('click', hide)
  },[])

  React.useEffect(() => { 
    axios.get(`${props.baseURL}etp/CDD/indicators.csv`)
      .then(response => {
        const temp = Papa.parse(response.data, { header: true }).data;
        setIndicators(temp);
      })
  },[props.baseURL])

  React.useEffect(() => {
    if (!active.open) return;
    document.addEventListener('click', hide)
  },[ active.open, hide ])
  
  if (!indicators) return <div></div>
  let indicatorsCopy = [ ...indicators ];
  const tempIndicators = indicatorsCopy.filter(d => d[""] === region)[0];

  for ( let i in tempIndicators ){
    if ( year === Number(i.substring(0,4)) 
      && scenario.substring(0,3) === i.substring(5,8)) {
        let labeltype = scenario === 'SDS' ? i.substring(9) : i.substring(11);
        function setLabel(e) {
          return e === 'HDD_a' || e === 'CDD_a'
            ? 'All population'
            : e === 'HDD_b' || e === 'CDD_b'
            ? 'of which high to very high'
            : e === 'LIVING_a'
            ? 'District heating (from moderate-high to very high) potential'
            : 'Heat pumps cost effectiveness'  
        }
        if ( scenario === 'SDS' ) {
          let type = i.substring(9,12);
          finalIndicators[scenario].data.push({ label: setLabel(labeltype), value: Number(tempIndicators[i]) })
        } else {
          let type = i.substring(11,14)
          finalIndicators[scenario].data.push({ label: setLabel(labeltype), value: Number(tempIndicators[i]).toFixed(0) })
        }
    }
  }
  return (
    <MapContainer selector='CDD' loaded={data}>
      {/* <CDD
        years={year}
        selectedRegion={region}
        layers={data}
        needFor={needFor}
        selectedPop={selectedPop}
        type={type}
        hdd={hdd}
      /> */}
      <ControlContainer dark bg>
        <Controls position='topLeft' style={{'width': '320px'}}> 
          {controls.map((control, idx) => 
            <Control key={idx} {...control} /> )}
        </Controls>
        <Controls position='bottomRight'>
          {legends.map((legend, idx) => 
            <Legends key={idx} {...legend} />)}
        </Controls>
        <Controls position='bottomLeft'>
          {dropdown.map((drop, idx) => 
            <Control key={idx} {...drop} /> )}
          {Object.values(finalIndicators).map((finalIndicator, idx) => 
            <Bars key={idx} dark {...finalIndicator} /> )}
        </Controls>
      </ControlContainer>
    </MapContainer>
  )
}

export default CDDWrapper;

