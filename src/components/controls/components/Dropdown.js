import React from 'react'
import classes from './css/Dropdown.module.css'
import global from './css/Control.module.css'

export default ({ label, list, click, selected, active, wrapperRef }) => {

  // const wrapperRef = React.useRef(null);
  // const { active } = useDetectClick(wrapperRef);

  return (
    <div ref={wrapperRef} className={global.IndicatorContainer}>
      <div className={global.IndicatorLabel}>
        {label}
      </div>
      <button>
        {selected}
      </button>     
      <div className={active ? [classes.DropdownOptions, classes.active].join(' ') : classes.DropdownOptions}>
        <div>
          <ul>
            {list.map(item => 
              <li key={item} onClick={() => click(item)} className={classes.Options}>
                  {item}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

// function useDetectClick(ref) {
//   const [active, setActive] = React.useState(false);
//   React.useEffect(() => {
//     function handleClickOutside(event) {
//       let clickedOutside = ref.current && !ref.current.contains(event.target);
//       if ( clickedOutside ) {
//         setActive(false);
//       } else {
//         setActive(true);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
    
//     return () => document.removeEventListener("mousedown", handleClickOutside);
    
//   }, [ref, active]);
  
//   return {
//     active
//   }
// }