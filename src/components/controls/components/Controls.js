import React from 'react'
import classes from './css/Controls.module.css';

export default ({ children, style }) => (
  <div style={style} className={classes.ControlWrapper}>
    {children}
  </div>
)

