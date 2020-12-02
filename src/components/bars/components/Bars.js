import React from 'react'
import Bar from './Bar'
import classes from './css/BarGraph.module.css'

export default ({label, data, titleSize, dark}) => (
  <div className={classes.Bars}>
    {label && <p style={titleSize}> {label} </p>}
    {data.map((d,i) => <Bar key={i} {...d} dark /> )}
  </div>
)

