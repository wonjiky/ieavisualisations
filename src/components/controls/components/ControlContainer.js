import React from 'react'
import classes from './css/Controls.module.css'

export default ({ children, dark, bg, position, style, customClass }) => {

  let theme = bg && !dark ? classes.background
    : bg && dark ? [classes.background, classes.dark].join(' ')
    : '';

  return (
    <div className={[classes.ControlWrapper, classes[position], customClass].join(' ')} style={style}>
      <div className={[classes.ControlContainer, theme].join(' ')}>
        {React.Children.map(children, child =>
          child && child.props.type !== 'popup' &&  React.cloneElement(child, { dark: dark }))}
      </div>
      {React.Children.map(children, child =>
        child && child.props.type === 'popup' && React.cloneElement(child, { dark: dark }))}
    </div>
  )
}
