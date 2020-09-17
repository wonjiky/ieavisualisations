import React from 'react'
import classes from './css/Icons.module.css'

export const Hamburger = ({ click, dark }) => (
  <button onClick={click} className={dark ? [classes.Button, classes.dark].join(' ') : classes.Button}>
    <svg viewBox="0 0 20 17">
      <title> Search </title>
      <path fill={dark ? '#fff' : '#000'} d="M0 14.5h20V16H0zM0 7.5h20V9H0zM0 .5h20V2H0z"/>
    </svg>
  </button>
)


export const Close = ({ click, dark }) => (
  <button onClick={click} className={dark ? [classes.Button, classes.dark].join(' ') : classes.Button}>
    <svg viewBox="0 0 17 17">
      <title> Search </title>
      <path strokeWidth="1.5" stroke={dark ? '#fff' : '#000'} d="M1 1l7.5 7.5M16 16L8.5 8.5m0 0L16 1M8.5 8.5L1 16"/>
    </svg>
  </button>
)

