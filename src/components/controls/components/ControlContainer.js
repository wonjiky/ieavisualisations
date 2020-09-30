import React from 'react'
import { Icon } from '../../icons'
import classes from './css/ControlContainer.module.css'

export default ({ children, label, dark, help }) => {
  const [open, setOpen] = React.useState(true);
  return (
    <section className={
      !open && !dark
      ? classes.ControlContainer 
      : open && !dark
      ? [classes.ControlContainer, classes.open].join(' ') 
      : !open && dark
      ? [classes.ControlContainer, classes.dark].join(' ')
      : [classes.ControlContainer, classes.open, classes.dark].join(' ')
      }
    >
      <div className={classes.ToggleWrapper}>
        <div className={classes.ToggleContainer}> 
          {help ? 
            <Icon.Help dark={dark} click={_ => setOpen(!open)}/> : null}
          {open
            ? <Icon.Close dark={dark} click={_ => setOpen(!open)}/>  
            : <Icon.Hamburger dark={dark} click={_ => setOpen(!open)}/> } 
        </div>
      </div>
      <div className={classes.BodyWrapper}>
        <div className={classes.ControlContainerBody}>
          {children}
        </div>
      </div>
    </section>
  )
}