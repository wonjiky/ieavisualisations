import React from 'react'
import Bar from './Bar'
import { useTheme } from '../../../context'
import classes from './css/Bars.module.css'

export default ({label, data, title, titleSize}) => {
  const theme = useTheme();
  return (
    <div className={classes.Bars} style={{ color: theme.style.color }}>
      {title && <p>{title}</p>}
      {label && <p style={titleSize}> {label} </p>}
      {data.map((d,i) => <Bar key={i} {...d} /> )}
    </div>
  );
}
