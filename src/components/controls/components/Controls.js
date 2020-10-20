import React from 'react'
import classes from './css/Controls.module.css';

export default ({ children, dark, bg, position, style, customClass }) => {

  let theme = bg && !dark ? classes.background
    : bg && dark ? [classes.background, classes.dark].join(' ')
    : '';

  return (
    <div className={[classes.ControlWrapper, classes[position], customClass, theme].join(' ')} style={style}>
      {React.Children.map(children, child => 
        { if (child) return React.cloneElement(child, { dark: dark }) })}
    </div>
  )
}
