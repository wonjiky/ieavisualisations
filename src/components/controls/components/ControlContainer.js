import React from 'react'
import { useTheme } from '../../../context'
import classes from './css/ControlContainer.module.css'

export default ({ children, position, style, customClass }) => {

  const theme = useTheme();
  const wrapperStyle = [classes.ControlWrapper, classes[position], customClass].join(' ');

  return (
    <div className={wrapperStyle} style={{ color: theme.style.color,  ...style}}>
      <div className={classes.ControlContainer} style={{background: theme.style.background}}>
        {React.Children.map(children, child =>
          child && child.props.type !== 'popup' &&  React.cloneElement(child))}
      </div>
      {React.Children.map(children, child =>
        child && child.props.type === 'popup' && React.cloneElement(child))}
    </div>
  )
}
