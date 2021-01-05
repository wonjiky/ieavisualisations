import React from 'react'
import { useTheme } from '../../../context'
import classes from './css/Description.module.css'

export default ({ options })=> {

  const { style } = useTheme();
  const divStyle = {
    borderTop: "1px solid",
    borderColor: style.borderColor
  };

  return (
    <div style={divStyle} className={classes.Description}> 
      {options.map((option,idx) => <p key={idx}>{option}</p>)} 
    </div>
  ) 
}