import React from 'react'
import CDD from './CDD'
import { Controls, Control } from '../../components/controls'
import { ETP_LAYERS } from '../../components/customHooks/components/util/EtpLayers'

export default function () {

  const [mainLayer, setMainLayer] = React.useState('HDD');
  const [year, setYear] = React.useState(2018);
  const [type, setType] = React.useState('SDS');
  const [overlay, setOverlay] = React.useState('None');

  const controls = [
		{ 
			type: 'button',
			options: ['HDD','CDD'],
      style: 'horizontal',
      customStyle: { marginBottom: '12px'},
      selected: mainLayer,
      click: value => setMainLayer(value),
    },
    {
      type: 'button',
      options: [2018, 2030, 2070],
      style: 'horizontal',
      customStyle: { marginBottom: '12px'},
			selected: year,
			click: value => setYear(value),
    },
    {
      type: 'button',
      options: ['SDS', 'STEPS'],
      style: 'horizontal',
      selected: type,
      click: value => setType(value),
    },
    {
      type: 'button',
      label: 'Overly layers',
      options: ['None', 'Population', 'Need of heating', 'Need of cooling', 'Need of dehumidification'],
      click: value => setOverlay(value),
      style: 'vertical',
			selected: overlay,
    }
  ]

  let data = [ ...ETP_LAYERS ];
  let layer = data.filter(d => d.data === mainLayer && d.type === type && d.year === year)[0];
  let population = data.filter(d => d.data === 'LAYER' && d.type === 'pop')[0];
  
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
      </Controls>
    </>
  )
}
