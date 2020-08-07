import React from 'react'
import CDD from './CDD'
import { Controls, Control } from '../../components/controls'
import { ETP_LAYERS } from '../../components/customHooks/components/util/EtpLayers'

export default function () {

  const [mainLayer, setMainLayer] = React.useState('HDD');
  const [year, setYear] = React.useState(2018);
  const [type, setType] = React.useState('SDS');

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
      label: 'Layers',
      options: ['Population', 'Need of heating', 'Need of cooling', 'Need of dehumidification'],
      click: value => console.log(value),
      style: 'vertical',
			selected: 'Need of heating',
    }
  ]

  let data = [ ...ETP_LAYERS ];
  let layer = data.filter(d => d.data === mainLayer && d.type === type && d.year === year)[0];
  return (
    <>
      <CDD
        layer={layer}
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
