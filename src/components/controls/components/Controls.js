import React from 'react'
import classes from './css/Controls.module.css';

export default ({ children, dark, style, bg, column }) => {

  let flow = column ? { 'flexFlow': 'column' } : { 'flexFlow': 'row' };
  let theme = dark ? [classes.ControlWrapper, classes.dark].join(' ') : classes.ControlWrapper;

  switch(bg) {
    case true: 
      return (
        <div
          style={{
            ...style, 
            ...flow
          }}
          className={theme}
        >
          {children}
        </div>
      )
    case undefined:
      return (
        <div
          className={theme}
          style={{
            'background': 'transparent', 
            'boxShadow': 'none',
            ...flow,
            ...style
          }}
        >
          {children}
        </div>
      )
    default:
      return null
  }
}
