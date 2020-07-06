import React from 'react'
import classes from './css/Dropdown.module.css'
import global from './css/Global.module.css'

export default ({ label, options, click, selected, active, open, hide }) => {
  return (
    <div className={[global.ControlContainer, classes.Dropdown].join(' ')}>
      <label className={global.ControlLabel}>
        {label}
      </label>
      <button value={label} onClick={e => open(e)} onBlur={e => hide(e)}>
        {selected}
      </button>     
      <div className={active.open && active.target === label 
        ? [classes.DropdownOptions, classes.active].join(' ') 
        : classes.DropdownOptions}>
        <div>
          <ul>
            {options.map(item => 
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