import React from 'react'
import classes from './css/Bar.module.css'

export default props => {
  return (
    <div className={classes.Bar}>
      <div className={props.dark ? [classes.BarLabel, classes.dark].join(' ') : classes.BarLabel}>
        <p>{props.label}</p>
        <span >{props.value}% </span>
      </div>
      <div className={props.dark ? [classes.Bar_Wrapper, classes.dark].join(' ') : classes.Bar_Wrapper}>
        <div className={props.dark ? [classes.Bar_Percentage, classes.dark].join(' ') : classes.Bar_Percentage} style={{ width: `${props.value}%` }}/>
      </div>
    </div>
  )
}
