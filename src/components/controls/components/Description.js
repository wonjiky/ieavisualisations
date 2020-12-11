import React from 'react'
import classes from './css/Description.module.css'

export default ({ options, dark })=> {
  let theme = dark ? [classes.Introduction, classes.dark].join(' ') : classes.Introduction;
  return <div className={theme}> {options.map((option,idx) => <p key={idx}>{option}</p>)} </div>
}