import React from 'react'
import { Icon } from '../../icons'
import { Loader } from '../../loader'
import { Disclaimer } from '../../disclaimer'
import { ThemeProvider } from '../../../context'
import classes from './css/Contaner.module.css'

function FullScreenIcon(selector) {
  return (
    <div className={classes.ExpandContainer}>
      <div className={classes.Expand}>
        <Icon 
          type='expand' 
          button={true} 
          click={ _ => toggleFullScreen(selector)}
          stroke={'rgba(60,60,60)'} 
          strokeWidth="1"
        />
      </div>
    </div>
  );
};

function toggleFullScreen(selector) {
  let elem = document.getElementById(selector);
  if (!document.fullscreenElement) {
    elem.requestFullscreen()
      .catch(err => {
        console.log(err)
      });
  } else document.exitFullscreen();
};

export default ({ disclaimer, selector, children, loaded, fluid, theme }) => (
  !loaded 
    ? <Loader /> 
    : <ThemeProvider theme={theme}>
        <div className={fluid ? 'container-fluid' : 'container'} id={selector}>
          {disclaimer ? <Disclaimer disclaimer={disclaimer} /> : null}
          <FullScreenIcon selector />
          {children}
        </div>
      </ThemeProvider>  
);