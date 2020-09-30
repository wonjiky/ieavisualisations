import React from 'react'
import { Icon } from '../../icons'

export default ({ selector, children })=> {
  
  function toggleFullScreen(selector) {
    let elem = document.getElementById(selector);
    // console.log(elem);
    if (!document.fullscreenElement) {
      elem.requestFullscreen()
        .catch(err => {
          console.log(err)
        });
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <div className='container' id={selector}>
      <Icon.Expand  click={ e => toggleFullScreen(selector)} />
      {children}
    </div>
  )
}

