import React from 'react';
import classes from './css/SliderComponents.module.css';

export const Handle = ( {handle: { id, value, percent }, getHandleProps }) => {
  return (
    <div
      className={classes.Handle}
      style={{ left: `${percent}%` }}
      {...getHandleProps(id)} >
      {/* <div style={{ fontFamily: 'Roboto', fontSize: 11, marginTop: -35 }}>
        {value}
      </div> */}
    </div>
  )
}

export const Track = ({ source, target, getTrackProps }) => {
  return (
    <div
      className={classes.Track}
      style={{
        backgroundColor: '#525252',
        borderRadius:'7',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()} 
      />
  )
}

export const Tick = ({ tick, count }) => { 
  return (
    <div>
      <div className={classes.Ticks}
        style={{ left: `${tick.percent}%`, }} />
      <div className={classes.TicksLabel}
        style={{
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
          }} >
        {tick.value}
    </div>
    </div>
  )
} 