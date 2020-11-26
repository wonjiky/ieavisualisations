import React from 'react'
import { Icon } from '../../icons'
import classes from './css/ControlContainer.module.css'

export default ({ 
  children, 
  dark, 
  bg, 
  help, 
  helpTitle,
  helpClick,
  download,
  downloadLink,
  downloadLabel,
}) => {

  const [open, setOpen] = React.useState(true);
  const style = !open && !dark
    ? classes.ControlContainer 
    : open && !dark
    ? [classes.ControlContainer, classes.open].join(' ') 
    : !open && dark
    ? [classes.ControlContainer, classes.dark].join(' ')
    : [classes.ControlContainer, classes.open, classes.dark].join(' ')

  return (
    <section className={style}>
      <div className={classes.ToggleWrapper}>
        <div className={classes.ToggleContainer}> 
          {open
            ? <Icon type='close' button={true} dark={dark} click={_ => setOpen(!open)} stroke />  
            : <Icon type='menu' button={true} dark={dark} click={_ => setOpen(!open)} fill /> } 
          {help ? 
            <Icon type='help' fill button dark='float' title={helpTitle} click={helpClick} styles={classes.Help} /> : null}
          {download ? 
            <div className={classes.DownloadContainer}>
              <a href={downloadLink} className={classes.DownloadButton}>
              <Icon type='download' strokeWidth={1} stroke viewBox='-13 -11 50 50' dark='float' />
              </a>
              <div className={classes.DownloadWrapper}>
                {downloadLabel}
              </div>
            </div> : null}
        </div>
      </div>
      <div className={classes.BodyWrapper}>
        <div className={classes.ControlContainerBody}>
          {React.Children.map(children, (child,idx) => 
            React.cloneElement(child, { dark: dark, bg: bg, key: idx}) )}
        </div>
      </div>
    </section>
  )
}