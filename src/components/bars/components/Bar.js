import React from 'react'
import classes from './css/Bar.module.css'

export default props => {
  return (
    <div className={classes.Bar}>
      <div className={classes.BarLabel}>
        <p>{props.label}</p>
        <span>{props.value}% </span>
      </div>
      <div className={classes.Bar_Wrapper}>
        <div className={classes.Bar_Percentage} style={{ width: `${props.value}%` }}/>
      </div>
    </div>
  )
}
