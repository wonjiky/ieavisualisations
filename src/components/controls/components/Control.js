import React from 'react'
import { NewSlider, Slider, Toggle, Dropdown } from '../index'
import global from './css/Global.module.css'

export default props => {
  switch (props.type) {
    case 'dropdown':
      return <Dropdown {...props} />

    case 'check':
    case 'radio':
      return <Toggle {...props} />;

    case 'slider':
      return <Slider {...props} />

    case 'newslider':
      return <NewSlider {...props} />

    case 'divider':
      return <div className={global.ControlDivider} style={{ 
        width: '100%', 
        marginBottom: `${props.marginBottom ? props.marginBottom : 0}px`, 
        marginTop: `${props.marginTop ? props.marginTop : 0}px`, }} />
    default:
      return null;
  }
}
  
