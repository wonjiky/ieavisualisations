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
      <title> Close </title>
      <path strokeWidth="1.5" stroke={dark ? '#fff' : '#000'} d="M1 1l7.5 7.5M16 16L8.5 8.5m0 0L16 1M8.5 8.5L1 16"/>
    </svg>
  </button>
)

export const Help = ({ click, dark }) => (
  <button onClick={click} className={dark ? [classes.Button, classes.dark].join(' ') : classes.Button}>
    <svg viewBox="5 5 10 10">
      <title> Help </title>
      <path stroke={dark ? '#fff' : '#000'} strokeWidth="0.1" d="M9.292 11.89h.888v-.516c0-.732.516-1.236 1.056-1.752.576-.552 1.176-1.116 1.176-2.004 0-1.008-.648-1.992-2.28-1.992-1.464 0-2.46.984-2.544 2.388h.936c.084-.948.696-1.56 1.596-1.56.888 0 1.284.492 1.284 1.2 0 .576-.408 1.008-.876 1.476-.6.588-1.236 1.188-1.236 2.16v.6zm.42 2.484c.42 0 .768-.336.768-.768a.766.766 0 00-.768-.768.766.766 0 00-.768.768c0 .432.348.768.768.768z"/>
    </svg>
  </button>
)

export const Expand = ({ click }) => (
  <div className={classes.ExpandContainer}>
    <div className={classes.Expand}>
      <button onClick={click} className={classes.Button}>
        <svg viewBox="4 4 12 12">
          <title> Expand </title>
          <path stroke={'rgba(60,60,60)'} strokeWidth="1" d="M6 14V9.556M6 14h4.444M6 14l8-8m0 0H9.556M14 6v4.444"/>
        </svg>
      </button>
    </div>
  </div>
)

