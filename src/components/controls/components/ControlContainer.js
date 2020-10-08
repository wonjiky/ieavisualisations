import React from 'react'
import { Icon } from '../../icons'
import classes from './css/ControlContainer.module.css'

export default ({ children, dark, help, bg }) => {
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
            <Icon type='help' button={true} dark={dark} click={_ => setOpen(!open)}/> : null}
          {open
            ? <Icon type='close' button={true} dark={dark} click={_ => setOpen(!open)} stroke />  
            : <Icon type='menu' button={true} dark={dark} click={_ => setOpen(!open)} fill /> } 
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