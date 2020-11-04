import React from 'react'
// import { Icon } from '../../icons'
import classes from './css/Input.module.css'

export default props => {
  const { 
    options,
    type,
    selected,
    name,
    change,
    disabled,
  } = props;


  // let onHoverInfo = (
  //   <div className={classes.onHoverInfoWrapper}>
  //     <div className={classes.onHoverInfo}>
  //       <Icon type="info" strokeWidth="1" button={false} fill="#fff" dark={true} viewBox="0 0 27 27" />
  //       {/* <div className={classes.InfoWrapper}>
  //         Hello
  //       </div> */}
  //     </div>
  //   </div>
  // )

  return (
    <div className={classes.InputWrapper}>
      {options.map((d, idx) =>
        <label 
          key={d.label} 
          className={disabled 
            ? (idx !== 0 
              ? [classes.InputItem, classes.disabled].join(' ') 
              : classes.InputItem) 
            : classes.InputItem}>
          <div className={classes.Label}>
            {d.label}
            {/* {d.info && onHoverInfo} */}
          </div>
          <input 
            key={d.label} 
            type={type} 
            name={name} 
            value={d.value} 
            disabled={disabled ? (idx !== 0 ? true : false) : false} 
            onChange={e => change(e.target.value)} 
            checked={d.value === selected ? 'checked' : '' }/> 
        </label>
      )}     
    </div>
  )
}