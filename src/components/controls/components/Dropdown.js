import React from 'react'
import classes from './css/Dropdown.module.css'
import { Icon } from '../../icons'
import global from './css/Global.module.css'

export default ({ 
  label, 
  options, 
  click, 
  selected, 
  bottom, 
  info,
  active, 
  open, 
  dark 
}) => {

  let dropdownDir = bottom ? {top: 'unset', bottom: '0px'} : null;
  return (
    <div className={dark ? [global.ControlContainer, classes.Dropdown, global.dark].join(' ') : [global.ControlContainer, classes.Dropdown].join(' ')}>
      <label className={global.ControlLabel}>
        {label}
      </label>
      <button value={label} onClick={e => open(e)}>
        <span>{selected}</span>
        <div className={dark 
          ? [classes.Icon, classes.dark].join(' ') 
          : classes.Icon}>
            <Icon type='downArrow' />
        </div>
      </button>     
      <div id='dropdown' className={active.open && active.target === label 
        ? [classes.DropdownOptions, classes.active].join(' ') 
        : classes.DropdownOptions}
        style={dropdownDir}
        >
        <div>
          <ul>
            {options.map((option,idx) =>
              <li key={idx} onClick={_ => click(option)}>
                <span>
                  {!info ? option : option.name}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}



