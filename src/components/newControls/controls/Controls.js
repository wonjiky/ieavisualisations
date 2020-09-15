import React from 'react'
import { Button } from './control'
// import PropTypes from 'prop-types'
// import className from './css/Controls.module.css'

const Controls = props => {

  switch (props.type) {
    // case 'dropdown':
    //   return (
    //     <Dropdown 
    //     label={props.label}
    //     options={props.options}
    //     click={props.click}
    //     top={props.top}
    //     selected={props.selected}
    //     active={props.active}
    //     open={props.open}
    //     hide={props.hide}
    //     />
    //   )
    case 'button':
      return <Button {...props} />;
    // case 'slider':
    //   return ( 
    //     <Slider
    //       height={props.height}
    //       label={props.label}
    //       currTime={props.currTime}
    //       width={props.width}
    //       time={props.time}
    //       range={props.range}
    //       change={props.change}
    //       />
    //   )
    case 'divider':
      return <div style={{ 
        width: '100%', 
        border: '0.5px solid #e6e6e6', 
        marginBottom: `${props.marginBottom ? props.marginBottom : 0}px`, 
        marginTop: `${props.marginTop ? props.marginTop : 0}px`, }} />
    default:
    return null;
  }
}

export default Controls;