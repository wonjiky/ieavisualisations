import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CDD from './CDD'
import { Controls, Control } from '../../components/controls'
import { Legends } from '../../components/legends'
import { Bars } from '../../components/bars'
import { ETP_LAYERS } from '../../components/customHooks/components/util/EtpLayers'

export default function (props) {

  const [mainLayer, setMainLayer] = React.useState('HDD');
  const [year, setYear] = React.useState(2019);
  const [active, setActive] = React.useState({ open: false, target: null });
  const [indicators, setIndicators] = React.useState(null);
  const [type, setType] = React.useState('SDS');
  const [overlayToggle, setoverlayToggle] = React.useState('None');
  const [region, setRegion] = React.useState('World'); 
  
  let data = [ ...ETP_LAYERS ];
  let mainOverlayLayer = data.filter(d => d.data === mainLayer && d.type === type && d.year === year)[0];
  let needLayer = data.filter(d => d.data === (mainLayer === 'HDD' ? 'NFH' : 'NFC') && d.type === type && d.year === 2070)[0]
  let popLayer = data.filter(d => d.data === 'LAYER' && d.type === 'pop' && d.year === year)[0];

  let controls = [
		{ 
			type: 'button',
			options: ['HDD','CDD'],
      style: 'horizontal',
      customStyle: { marginBottom: '12px'},
      selected: mainLayer,
      click: value => {
        setMainLayer(value)
        setoverlayToggle('None')
      },
    },
    {
      type: 'button',
      options: [2019, 2030, 2070],
      style: 'horizontal',
      customStyle: { marginBottom: '12px'},
			selected: year,
			click: value => {
        setYear(value)
        setoverlayToggle('None')
      },
    },
    {
      type: 'button',
      options: ['SDS', 'STEPS'],
      style: 'horizontal',
      selected: type,
      click: value => {
        setType(value)
        setoverlayToggle('None')
      },
    },
    {
      type: 'button',
      options: mainLayer === 'HDD' 
        ? ['None', 'Population', 'Need of heating']
        : ['None', 'Population', 'Need of cooling'],
      click: value => setoverlayToggle(value),
      style: 'vertical',
			selected: overlayToggle,
    }
  ];

  let dropdown = [
    {
      type: 'divider',
      marginBottom: 15,
      marginTop: 15,
    },
    {
      type: 'dropdown',
      label: 'Regions',
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
  ]

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
  },[])

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
    <>
      <CDD
        years={year}
        mainOverlayLayer={mainOverlayLayer}
        popLayer={popLayer}
        overlayToggle={overlayToggle}
        selectedRegion={region}
        needLayer={needLayer}
      />
      <Controls
        style={{
          flexFlow: 'column',
          top: '40px',
          paddingRight: '20px',
          paddingLeft: '20px',
          left: '40px',
        }}
      > 
        {controls.map((control, idx) => 
          <Control key={idx} {...control} /> )}
        <Legends
          type={'continuous'}
          legendStyle={{marginTop: '0px'}}
          header={mainLayer === 'HDD' ? 'Heating degree days' : 'Cooling degree days'}
          subInHeader={false}
          labels={mainLayer === 'HDD' ? [0, 12000] : [0, 6000]}
          colors={mainLayer === 'HDD' 
            ? ['#ffffe0', '#ccf0df', '#afdcd8', '#98c7d1', '#83b2c8', '#719cc0', '#5f87b7', '#4e72ad', '#3b5ea3', '#264a9a', '#003790']
            : ['#008712', '#99b95e', '#b3c661', '#ccd45f', '#e5e25a', '#ffe06d', '#ffc42a', '#f1ac32', '#e4932f', '#d67a29', '#c96122', '#bb461a', '#b93326']}
          round={false}
        />
        <Legends
          type={'continuous'}
          legendStyle={{marginTop: '5px'}}
          header={'Population'}
          subInHeader={false}
          labels={[0,30000]}
          colors={['#ffffe0', '#ededd3', '#dcdbc6', '#cacab9', '#b9b9ac', '#a9a8a0', '#989794', '#888787', '#78777b', '#686770', '#595864', '#4a4958', '#3b3b4d', '#2d2e42', '#1e2137', '#10142d', '#000023']}
          round={false}
        />
        {dropdown.map((drop, idx) => 
          <Control key={idx} {...drop} /> )}
        {Object.values(finalIndicators).map((finalIndicator, idx) => 
          <Bars key={idx} {...finalIndicator} /> )}
      </Controls>
    </>
  )
}
