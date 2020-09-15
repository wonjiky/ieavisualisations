import React from 'react'
import PropTypes from 'prop-types';
import classes from './css/Wrapper.module.css'

const Wrapper = ({
  style,
  children
}) => {
  
  return (
    <div
      style={style}
      className={classes.Wrapper}      
    >
      {children}
    </div>
  )
}

export default Wrapper

Wrapper.propTypes = {
  style: PropTypes.object.isRequired,
}