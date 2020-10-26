import React from 'react'
import classes from './css/Description.module.css'

export default ({ options })=> <div className={classes.Introduction}> {options.map((option,idx) => <p key={idx}>{option}</p>)} </div>