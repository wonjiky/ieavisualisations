import React from 'react'
import { Icon } from '../../icons'
import { Loader } from '../../loader'
import { Disclaimer } from '../../disclaimer'
import classes from './css/Contaner.module.css'

export default ({ selector, children, loaded, type, disclaimer}) => (
  !loaded 
  ? <Loader /> 
  : <div className='container' id={selector}>
      {type === 'weather' ? <Disclaimer disclaimer={disclaimer} /> : null}
      <div className={classes.ExpandContainer}>
        <div className={classes.Expand}>
          <Icon 
            type='expand' 
            button={true} 
            click={ e => toggleFullScreen(selector)}
            stroke={'rgba(60,60,60)'} 
            strokeWidth="1"
          />
        </div>
      </div>
      {children}
    </div>
)

function toggleFullScreen(selector) {
  let elem = document.getElementById(selector);
  if (!document.fullscreenElement) {
    elem.requestFullscreen()
      .catch(err => {
        console.log(err)
      });
  } else {
    document.exitFullscreen();
  }
}