import React from 'react'
import classes from './css/Dropdown.module.css'
import global from './css/Control.module.css'

export default ({ label, list, click, selected, active, open, hide }) => {

  return (
    <div className={global.IndicatorContainer}>
      <label className={global.IndicatorLabel}>
        {label}
      </label>
      <button onClick={open} onBlur={e => hide(e)}>
        {selected}
      </button>     
      <div className={active ? [classes.DropdownOptions, classes.active].join(' ') : classes.DropdownOptions}>
        <div>
          <ul>
            {list.map(item => 
              <li key={item}  onClick={_ => click(item)} className={classes.Options}>
                <button>
                  {item}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}