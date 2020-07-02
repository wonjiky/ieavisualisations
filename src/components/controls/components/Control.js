import React from 'react'
import classes from './css/Control.module.css'

export default ({children}) => (
  <div className={classes.ControlWrapper}>
    {children}
  </div>
)
