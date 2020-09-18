import React from 'react'
import classes from './css/Dropdown.module.css'
import global from './css/Global.module.css'

export default ({ label, options, click, selected, top, active, open, dark }) => {
  let dropdownDir = top ? { top: 0 } : { bottom: 0 };
  return (
    <div className={dark ? [global.ControlContainer, classes.Dropdown, global.dark].join(' ') : [global.ControlContainer, classes.Dropdown].join(' ')}>
      <label className={global.ControlLabel}>
        {label}
      </label>
      <button value={label} onClick={e => open(e)}>
        {selected}
      </button>     
      <div id='dropdown' className={active.open && active.target === label 
        ? [classes.DropdownOptions, classes.active].join(' ') 
        : classes.DropdownOptions}
        style={dropdownDir}
        >
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