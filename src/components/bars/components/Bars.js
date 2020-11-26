import React from 'react'
import Bar from './Bar'
import classes from './css/BarGraph.module.css'

export default ({label, data, dark}) => (
  <div className={classes.Bars}>
    {label && <p> {label} </p>}
    {data.map((d,i) => <Bar key={i} {...d} dark /> )}
  </div>
)

