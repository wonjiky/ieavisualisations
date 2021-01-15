import React from 'react'
import cmcc from '../assets/cmcc.png'
import iea from '../assets/iea.png'
import classes from './css/Logos.module.css'

const url = [
  {alt: 'iea', url: iea},
  {alt: 'cmcc', url: cmcc},
];

const Logos = _ => (

  <div className={classes.LogoWrapper}>
    {url.map(d => 
      <div key={d.alt} className={classes.Logo}>
        <img src={d.url} alt={d.alt} /> 
      </div> )}
  </div>
  
)

export default Logos
