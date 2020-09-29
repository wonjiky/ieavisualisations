import React from 'react'
import { Icon } from '../../icons'

export default ({ children })=> {
  
  function toggleFullScreen() {
		let elem = document.getElementById("mapContainer");
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <div className='container' id='mapContainer'>
      <Icon.Expand  click={ _ => toggleFullScreen()} />
      {children}
    </div>
  )
}

