import React from 'react'
import classes from './css/Input.module.css'

export default props => {
  const { 
    options,
    type,
    selected,
    name,
    change,
    disabled,
  } = props;
  
  return (
    <div className={classes.InputWrapper}>
      {options.map((d, idx) =>
        <label 
          key={d.label} 
          className={disabled 
            ? (idx !== 0 
              ? [classes.InputItem, classes.disabled].join(' ') 
              : classes.InputItem) 
            : classes.InputItem}>
          <div className={classes.Label}>
            {d.label}
          </div>
          <input 
            key={d.label} 
            type={type} 
            name={name} 
            value={d.value} 
            disabled={disabled ? (idx !== 0 ? true : false) : false} 
            onChange={e => change(e.target.value)} 
            checked={d.value === selected ? 'checked' : '' }/> 
        </label>
      )}     
    </div>
  )
}