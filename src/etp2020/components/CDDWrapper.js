import React from 'react'
import CDD from './CDD'
import { Controls, Control } from '../../components/controls'
import { Bar } from '../../components/barGraph'
import { ETP_LAYERS } from '../../components/customHooks/components/util/EtpLayers'

export default function () {

  const [mainLayer, setMainLayer] = React.useState('HDD');
  const [year, setYear] = React.useState(2018);
  const [active, setActive] = React.useState({ open: false, target: null });
  const [type, setType] = React.useState('SDS');
  const [overlay, setOverlay] = React.useState('None');

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
      options: [2018, 2030, 2070],
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
    // {
    //   type: 'dropdown',
    //   label: 'Overlay layers',
    //   options: ['None', 'Population', 'Need of heating', 'Need of cooling', 'Need of dehumidification'],
    //   click: value => setOverlay(value),
    //   style: 'vertical',
    //   open: e => open(e),
    //   hide: e => hide(e),
    //   active: active,
		// 	selected: overlay,
    // },
    {
      type: 'button',
      // label: 'Overly layers',
      options: mainLayer === 'HDD' 
        ? ['None', 'Population', 'Need of cooling', 'Need of dehumidification']
        : ['None', 'Population', 'Need of heating', 'Need of dehumidification'],
      click: value => setOverlay(value),
      style: 'vertical',
			selected: overlay,
    },
    {
      type: 'dropdown',
      label: 'Regions',
      options: [
        'All',
        'Asia Pacific',
        'Central & South America',
        'North America',
        'Eurasia',
        'Europe',
        'Middle East',
        'Africa',
      ],
      click: value => setOverlay(value),
      style: 'vertical',
      open: e => open(e),
      hide: e => hide(e),
      active: active,
      selected: overlay,
    }
  ];

  const variables = [
    {
      label: 'Population needing cooling (%)'
    },
    {
      label: 'Population needing heating (%)',
    },
    {
      label: 'Population living within (%)',
    },
  ]

  let data = [ ...ETP_LAYERS ];
  let layer = data.filter(d => d.data === mainLayer && d.type === type && d.year === year)[0];
  let population = data.filter(d => d.data === 'LAYER' && d.type === 'pop')[0];

  function open(e) {
		setActive({ open: true, target: e.target.value })
	}

	function hide(e) {
		if(e && e.relatedTarget) e.relatedTarget.click();
		setActive({ open: false, target: null })
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
        {variables.map((variable,idx) => 
          <Bar key={idx} {...variable} /> )}
      </Controls>
    </>
  )
}
