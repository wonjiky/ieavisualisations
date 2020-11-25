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
  group,
  active, 
  open, 
  dark 
}) => {
  
  
  let dropdownStyle = active.open && active.target === label 
    ? [classes.DropdownOptions, classes.active].join(' ') 
    : classes.DropdownOptions;

  let wrapperStyle = dark 
    ? [global.ControlContainer, classes.Dropdown, global.dark].join(' ') 
    : [global.ControlContainer, classes.Dropdown].join(' ');

  const groupedList = options.reduce((r, a) => {
    r[a.group] = [...r[a.group] || [], a];
    return r;
  }, {});
  
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
            {
              group 
                ? Object.entries(groupedList).map((option,idx) => 
                  <Group key={`group-${idx}`} option={option[1]} group={group} click={click}/>)
                : <Single option={options} group={group} click={click} />
            }
          </ul>
        </div>
      </div>
    </div>
  )
};

const Group = ({ option, click, group }) => (
  <li> 
    <div className={classes.NestedGroupTitle}>
      {option[0].group}
    </div>
    <ul className={classes.NestedList}>
      <Single click={click} group={group} option={option}/>
    </ul>
  </li>
);

const Single = ({ option, click, group }) => (
  option.map((d,idx) => 
    <li key={idx} onClick={_ => click(d)} className={classes.NestedOptions}>
      <div className={classes.OptionItem}>
        {!group ? d : d.option}
      </div>
    </li>
  )
);







