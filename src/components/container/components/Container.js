import React from 'react'
import { Icon } from '../../icons'
import { Loader } from '../../loader'
import { Disclaimer } from '../../disclaimer'
import { ThemeProvider } from '../../../context'
import classes from "./css/Container.module.css";

function FullScreenIcon({ id }) {
  return (
    <div className={classes.ExpandContainer}>
      <div className={classes.Expand}>
        <Icon
          type="expand"
          button={true}
          click={(_) => toggleFullScreen(id)}
          stroke={"rgba(60,60,60)"}
          strokeWidth="1"
        />
      </div>
    </div>
  );
};

function toggleFullScreen(id) {
  let elem = document.getElementById(id);
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
          <FullScreenIcon id={selector} />
          {children}
        </div>
      </ThemeProvider>  
);