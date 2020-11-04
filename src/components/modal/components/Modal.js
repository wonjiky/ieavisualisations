import React from 'react'
import { Icon } from '../../icons'
import classes from './css/Modal.module.css'

export default ({ children, open, click, styles }) => {
  let opened = open ? classes.open : ''
  return (
    <div className={[classes.ModalWrapper, classes[styles], opened].join(' ')}>
      <div className={classes.ModalContainer}>
        <div className={classes.Button}>
          <Icon type='close' button={true} click={click} dark stroke />
        </div>
        <div className={classes.ModalContent}>
          {children}
        </div>
      </div>
    </div>
  )
}