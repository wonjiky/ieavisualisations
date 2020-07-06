import React from 'react'
import classes from './css/Controls.module.css';

export default ({ children }) => (
  <div className={classes.ControlWrapper}>
    {children}
  </div>
)

