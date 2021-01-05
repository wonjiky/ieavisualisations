import React from 'react'
import { useTheme } from '../../../context'
import classes from './css/ControlContainer.module.css'

export default ({ children, position, style, customClass }) => {

  const themes = useTheme();
  
  return (
    <div className={[classes.ControlWrapper, classes[position], customClass].join(' ')} style={{ ...themes.style,  ...style}}>
      <div className={classes.ControlContainer}>
        {React.Children.map(children, child =>
          child && child.props.type !== 'popup' &&  React.cloneElement(child))}
      </div>
      {React.Children.map(children, child =>
        child && child.props.type === 'popup' && React.cloneElement(child))}
    </div>
  )
}
