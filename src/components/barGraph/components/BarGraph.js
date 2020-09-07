import React from 'react'
import classes from './css/BarGraph.module.css'

export default props => {
  console.log(props);
  return (
    <div>
      <p>{props.label}</p>
    </div>
  )
}

