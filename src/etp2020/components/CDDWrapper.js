import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CDD from './CDD'
import { Controls, Control } from '../../components/controls'
import { Legends } from '../../components/legends'
import { Bars } from '../../components/bars'
import { ETP_LAYERS } from '../../components/customHooks/components/util/EtpLayers'

function CDDWrapper(props) {
  
  const [hdd, setHdd] = React.useState('HDD');
  const [year, setYear] = React.useState(2019);
  const [active, setActive] = React.useState({ open: false, target: null });
  const [indicators, setIndicators] = React.useState(null);
  const [type, setType] = React.useState('SDS');
  const [region, setRegion] = React.useState('World'); 
  const [needFor, setNeedFor] = React.useState(false);
  const [selectedPop, setPopulation] = React.useState(false);
  
  let data = [ ...ETP_LAYERS ];
  let layers = data.filter(d => d.data === 'LAYERS')[0];

  let controls = [
		{ 
			type: 'radio',
			options: ['HDD','CDD'],
      style: 'horizontal',
      selected: hdd,
      dark: true,
      click: value => {
        setHdd(value)
      },
    },
    {
      type: 'radio',
      options: [2019, 2030, 2070],
      style: 'horizontal',
      selected: year,
      dark: true,
			click: value => {
        setYear(value)
      },
    },
    {
      type: 'radio',
      options: ['SDS', 'STEPS'],
      style: 'horizontal',
      selected: type,
      click: value => {
        setType(value)
      },
      dark: true,
    },
    {
      type: 'check',
      options: [
        {
          title: 'Population',
          click: _ => setPopulation(!selectedPop),
          style: 'vertical',
          selected: selectedPop,
          dark: true,
        },
        {
          title: hdd === 'HDD' ? 'Need of heating' : 'Need of cooling',
          click: _ => setNeedFor(!needFor),
          style: 'vertical',
          selected: needFor,
          customStyle: { marginBottom: 'px'},
          dark: true,
        }
      ]
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
      style: 'vertical',
      open: e => open(e),
      hide: e => hide(e),
      active: active,
      selected: region,
    }
  ];

  let legends = [
    {
      type: 'continuous',
      header: hdd === 'HDD' ? 'Heating degree days' : 'Cooling degree days',
      subInHeader: false,
      labels: hdd === 'HDD' ? [0, 12000] : [0, 6000],
      colors: hdd === 'HDD' 
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
    CDD: {
     label: 'Population needing cooling',
     data: []
    },
    HDD: {
      label: 'Population needing heating',
      data: []
    },
    LIV: {
      label: 'Population living within',
      data: []
    },
  };

  const open = e => {
    setActive({ open: true, target: e.target.value })
  }

  const hide = React.useCallback(() => {
    setActive({ open: false, target: null })
    document.removeEventListener('click', hide)
  },[])

  React.useEffect(() => { 
    axios.get(`${props.baseURL}ETP2020/CDD/indicators.csv`)
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
      && type.substring(0,3) === i.substring(5,8)) {
        let labeltype = type === 'SDS' ? i.substring(9) : i.substring(11);
        function setLabel(e) {
          return e === 'HDD_a' || e === 'CDD_a'
            ? 'All population'
            : e === 'HDD_b' || e === 'CDD_b'
            ? 'of which high to very high'
            : e === 'LIVING_a'
            ? 'District heating (from moderate-high to very high) potential'
            : 'Heat pumps cost effectiveness'  
        }
        if ( type === 'SDS' ) {
          let type = i.substring(9,12);
          finalIndicators[type].data.push({ label: setLabel(labeltype), value: Number(tempIndicators[i]) })
        } else {
          let type = i.substring(11,14)
          finalIndicators[type].data.push({ label: setLabel(labeltype), value: Number(tempIndicators[i]).toFixed(0) })
        }
    }
  }
  return (
    <div className='container'>
      <CDD
        years={year}
        selectedRegion={region}
        layers={layers}
        needFor={needFor}
        selectedPop={selectedPop}
        type={type}
        hdd={hdd}
      />
      <Controls
        style={{
          flexFlow: 'column',
          top: '20px',
          left: '20px',
          padding: '0',
          background: 'none'
        }}
      > 
        {controls.map((control, idx) => 
          <Control key={idx} {...control} /> )}
      </Controls>
      <Controls
        dark
        style={{
          flexFlow: 'column',
          bottom: '35px',
          left: '20px',
          width: '230px'
        }}
      >
        {dropdown.map((drop, idx) => 
          <Control key={idx} {...drop} /> )}
        {Object.values(finalIndicators).map((finalIndicator, idx) => 
          <Bars key={idx} dark {...finalIndicator} /> )}
      </Controls>
      <Controls
        dark
        style={{
          flexFlow: 'column',
          bottom: '35px',
          right: '20px',
        }}
      >
        {legends.map((legend, idx) => 
          <Legends key={idx} {...legend} />)}
      </Controls>
    </div>
  )
}

export default CDDWrapper;

