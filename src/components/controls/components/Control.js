import React from 'react'
import { RadioToggle, Slider, CheckToggle, Dropdown } from '../index'
import global from './css/Global.module.css'

export default props => {
  switch (props.type) {
    case 'dropdown':
      return (
        <Dropdown {...props} />
      )
    case 'radio':
      return <RadioToggle {...props} />;
    case 'check':
      return <CheckToggle {...props} />;
    case 'slider':
      return ( 
        <Slider
          height={props.height}
          label={props.label}
          currTime={props.currTime}
          width={props.width}
          time={props.time}
          range={props.range}
          change={props.change}
          />
      )
    case 'divider':
      return <div className={global.ControlDivider} style={{ 
        width: '100%', 
        marginBottom: `${props.marginBottom ? props.marginBottom : 0}px`, 
        marginTop: `${props.marginTop ? props.marginTop : 0}px`, }} />
    default:
      return null;
  }
}
  
