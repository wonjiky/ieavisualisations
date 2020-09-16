import React from 'react'
import Bar from './Bar'
import classes from './css/BarGraph.module.css'

export default ({label, data, dark}) => {
  return (
    <div className={classes.Bars}>
      <p>{label}</p>
      {data.map((d,i) => 
        <Bar key={i} {...d} dark /> )}
    </div>
  )
}

