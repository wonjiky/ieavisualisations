import React from 'react'
import classes from './css/Controls.module.css';

export default ({ children, dark, style }) => (
  <div style={style} className={dark ? [classes.ControlWrapper, classes.dark].join(' ') : classes.ControlWrapper}>
    {children}
  </div>
)

