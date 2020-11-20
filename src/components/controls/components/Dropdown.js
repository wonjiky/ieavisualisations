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

  let list = options.reduce((r, a) => {
    r[a.group] = [...r[a.group] || [], a];
    return r;
  }, {});
  let dropdownStyle = active.open && active.target === label 
    ? [classes.DropdownOptions, classes.active].join(' ') 
    : classes.DropdownOptions;
  let wrapperStyle = dark 
    ? [global.ControlContainer, classes.Dropdown, global.dark].join(' ') 
    : [global.ControlContainer, classes.Dropdown].join(' ');

  return(
    <div className={wrapperStyle}>
      <label className={global.ControlLabel}>
        {label}
      </label>
      <button value={label} onClick={e => open(e)}>
        <span>{selected}</span>
        <div className={dark 
          ? [classes.Icon, classes.dark].join(' ') 
          : classes.Icon}>
            <Icon type='downArrow' dark={dark ? true : false} />
        </div>
      </button>     
      <div id='dropdown' style={bottom ? {top: 'unset', bottom: '0px'} : null} className={dropdownStyle}>
        <div>
          <ul>
            {Object.entries(list).map((option,idx) =>
              option[0] === 'single' 
                ? <Single key={`single-${idx}`} option={option[1]} info={info} click={click}/>
                : <Group key={`group-${idx}`} option={option[1]} info={info} click={click}/> )}
          </ul>
        </div>
      </div>
    </div>
  )
};

const Group = ({ option, click, info }) => (
  <li> 
    <div className={classes.NestedGroupTitle}>
      {option[0].group}
    </div>
    <ul className={classes.NestedList}>
      <Single click={click} info={info} option={option}/>
    </ul>
  </li>
);

const Single = ({ option, click, info }) => (
  option.map(d => 
    <li key={d.id} onClick={_ => click(d)} className={classes.NestedOptions}>
      <div className={classes.OptionItem}>
        {!info ? d : d.name}
      </div>
    </li>
  )
);







