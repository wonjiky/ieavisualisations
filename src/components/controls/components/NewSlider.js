import React from 'react'
import classes from './css/Slider.module.css'

export default ({ change, min, max, step, label, value}) => {
  return (
    <div>
      <div className={classes.SliderContainer}>
        <span>
          {label}
        </span>
        <input 
          type='range' 
          min={min}
          max={max} 
          value={value}
          step={step}
          onChange={change}  
        />      
      </div>
    </div>
  )
}

