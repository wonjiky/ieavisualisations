import React from 'react'
import Bar from './Bar'
import classes from './css/BarGraph.module.css'

export default ({label, data, title, titleSize}) => (
  <div className={classes.Bars}>
    {title && <p>{title}</p>}
    {label && <p style={titleSize}> {label} </p>}
    {data.map((d,i) => <Bar key={i} {...d} dark /> )}
  </div>
)

