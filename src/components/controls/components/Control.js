import React from 'react'
import { Button, Slider, Dropdown } from '../index';

export default props => {
  switch (props.type) {
    case 'dropdown':
      return (
        <Dropdown 
        label={props.label}
        options={props.options}
        click={props.click}
        selected={props.selected}
        active={props.active}
        open={props.open}
        hide={props.hide}
        />
      )
    case 'button':
      return <Button {...props} />;
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
    default:
      return null;
  }
}
  
