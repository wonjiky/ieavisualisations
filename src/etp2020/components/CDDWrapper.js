import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CDD from './CDD'
import { Controls, Control } from '../../components/controls'
import { Bars } from '../../components/bars'
import { ETP_LAYERS } from '../../components/customHooks/components/util/EtpLayers'

export default function (props) {

  const [mainLayer, setMainLayer] = React.useState('HDD');
  const [year, setYear] = React.useState(2019);
  const [active, setActive] = React.useState({ open: false, target: null });
  const [indicators, setIndicators] = React.useState(null);
  const [type, setType] = React.useState('SDS');
  const [overlay, setOverlay] = React.useState('None');
  const [region, setRegion] = React.useState('World'); 

  const controls = [
		{ 
			type: 'button',
			options: ['HDD','CDD'],
      style: 'horizontal',
      customStyle: { marginBottom: '12px'},
      selected: mainLayer,
      click: value => {
        setMainLayer(value)
        setOverlay('None')
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
        setOverlay('None')
      },
    },
    {
      type: 'button',
      options: ['SDS', 'STEPS'],
      style: 'horizontal',
      selected: type,
      click: value => {
        setType(value)
        setOverlay('None')
      },
    },
    {
      type: 'button',
      options: mainLayer === 'HDD' 
        ? ['None', 'Population', 'Need of heating']
        : ['None', 'Population', 'Need of cooling'],
      click: value => setOverlay(value),
      style: 'vertical',
			selected: overlay,
    },
    {
      type: 'divider',
      marginBottom: 24
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

  React.useEffect(() => { 
    axios.get(`${props.baseURL}ETP2020/CDD/indicators.csv`)
      .then(response => {
        const temp = Papa.parse(response.data, { header: true }).data;
        setIndicators(temp);
      })
  },[])

  let data = [ ...ETP_LAYERS ];
  let layer = data.filter(d => d.data === mainLayer && d.type === type && d.year === year)[0];
  let population = data.filter(d => d.data === 'LAYER' && d.type === 'pop')[0];

  function open(e) {
    setActive({ open: true, target: e.target.value })
  }

  const hide = React.useCallback(() => {
    setActive({ open: false, target: null })
    document.removeEventListener('click', hide)
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
        layer={layer}
        population={population}
        years={year}
        overlay={overlay}
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
        {Object.values(finalIndicators).map((finalIndicator, idx) => 
          <Bars key={idx} {...finalIndicator} /> )}
      </Controls>
    </>
  )
}
