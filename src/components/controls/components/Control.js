import React from 'react'
import { Slider, Button, Dropdown, Input, Description } from '../index'
import global from './css/Global.module.css'

export default props => {
  switch (props.type) {
    case 'dropdown':
      return <Dropdown {...props} />

    case 'button':
    case 'buttonGroup':
      return <Button {...props} />;

    case 'checkbox':
    case 'radio':
      return <Input {...props} />

    case 'slider':
      return <Slider {...props} />

    case 'divider':
      return <div className={global.ControlDivider} style={{ 
        width: '100%', 
        marginBottom: `${props.marginBottom ? props.marginBottom : 0}px`, 
        marginTop: `${props.marginTop ? props.marginTop : 0}px`, }} />

    case 'description':
      return <Description {...props} />
      
    default:
      return null;
  }
}
  
