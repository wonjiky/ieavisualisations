import React from 'react'
import { Icon } from '../../icons'
import classes from './css/Modal.module.css'

export default props => {
  return (
    <Wrapper {...props} >
      
    </Wrapper>
  )
}

const Wrapper = ({ children, open, click, styles }) => {
  let opened = open ? classes.open : ''
  return (
    <div className={[classes.ModalWrapper, classes[styles], opened].join(' ')}>
      <div className='modalContainer'>
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