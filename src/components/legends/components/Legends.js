import React from 'react'
import classes from './css/Legends.module.css'

export default ({
  colors,
  header,
  labels,
  round,
  type
}) => {

  let legend = null;
  let markers = round ? [classes.Markers, classes.Round].join(' ') : classes.Markers;
  let continuousBg = colors && type === 'continuous' ? gradientBg(colors) : null;

  function gradientBg(colors) {
    let colorArr = ['#fff 0%'];
    for ( let color in colors ) {
      let idx = parseInt(color) + 1;
      colorArr.push(`${colors[color]} ${(100/colors.length) * idx}%`)
    }
    return colorArr.join(',');
  }

  switch(type) {
    case 'category':
      legend = labels.map((d, i) => (
          <div key={i} className={classes.LegendItem__Category}>
            <div 
              className={markers} 
              style={{
                background: `${colors[i] === 'stripe' 
                  ? 'repeating-linear-gradient(45deg, #ffe3a3, #ffe3a3 2px, transparent 2px, transparent 5px)' 
                  : colors[i]}`}}
            />
            <p>{d}</p>
          </div>
        ));
      break;
    case 'continuous':
      legend = (
        <div className={classes.LegendItem__Continuous}>
          <div className={classes.Marker__Continuous} style={{
            background: `linear-gradient(90deg, ${continuousBg})`
          }}/>
          <div className={classes.Label__Continuous}>
            {labels.map((d,i) => <p key={i}>{d}</p>)}
          </div>
        </div>
      )
      break;
    default:
    legend = null;
  }


  return (
    <div className={classes.LegendWrapper}>
      {header ? <h5 className={classes.Header}>{header}</h5> : null}
      {legend}
    </div>
  )
}