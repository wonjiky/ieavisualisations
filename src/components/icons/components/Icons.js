import React from 'react'
import classes from './css/Icons.module.css'

export default ({ 
  click, 
  dark, 
  type, 
  button, 
  viewBox,
  strokeWidth,
  stroke,
  fill,
  styles
}) => {
  let icon = iconTypes[type];
  return (
    <Wrapper button={button} dark={dark} click={click} styles={styles}>
      <svg viewBox={viewBox || icon.viewBox}>
        <title>{icon.title}</title>
        {icon.path.map((path, idx) => 
          <path 
            key={idx} 
            strokeWidth={strokeWidth || ''}
            stroke={stroke ? (dark ? '#fff' : '#000') : ''} 
            fill={fill ? (dark ? '#fff' : '#000') : ''} 
            d={path}
          />
        )}
      </svg>
    </Wrapper>
  )
}

  
const Wrapper = ({ button, children, dark, click, styles }) => {
  return (
    button 
    ? <button onClick={click} className={dark ? [classes.Button, classes.dark, styles].join(' ') : [classes.Button, styles].join(' ')}>
        {children}
      </button>
    : children
  )
}

const iconTypes = {
  menu: {
    title: 'Menu',
    path: ["M0 14.5h20V16H0zM0 7.5h20V9H0zM0 .5h20V2H0z"],
    viewBox: "0 0 20 17"
  },
  close: {
    title: 'Close',
    path: ["M1 1l7.5 7.5M16 16L8.5 8.5m0 0L16 1M8.5 8.5L1 16"],
    viewBox: "0 0 17 17"
  },
  info: {
    title: 'Info',
    path: [
      "M13.5 27C20.956 27 27 20.956 27 13.5S20.956 0 13.5 0 0 6.044 0 13.5 6.044 27 13.5 27zm0-2C7.15 25 2 19.85 2 13.5S7.15 2 13.5 2 25 7.15 25 13.5 19.85 25 13.5 25z",
      "M12.05 7.64c0-.228.04-.423.12-.585.077-.163.185-.295.32-.397.138-.102.298-.177.48-.227.184-.048.383-.073.598-.073.203 0 .398.025.584.074.186.05.35.126.488.228.14.102.252.234.336.397.084.162.127.357.127.584 0 .22-.043.412-.127.574-.084.163-.196.297-.336.4-.14.106-.302.185-.488.237-.186.053-.38.08-.584.08-.215 0-.414-.027-.597-.08-.182-.05-.342-.13-.48-.235-.135-.104-.243-.238-.32-.4-.08-.163-.12-.355-.12-.576zm-1.02 11.517c.134 0 .275-.013.424-.04.148-.025.284-.08.41-.16.124-.082.23-.198.313-.35.085-.15.127-.354.127-.61v-5.423c0-.238-.042-.43-.127-.57-.084-.144-.19-.254-.318-.332-.13-.08-.267-.13-.415-.153-.148-.024-.286-.036-.414-.036h-.21v-.95h4.195v7.463c0 .256.043.46.127.61.084.152.19.268.314.35.125.08.263.135.414.16.15.027.29.04.418.04h.21v.95H10.82v-.95h.21z"
    ],
    viewBox: "2 3 22 22"
  },
  help: {
      title: 'Help',
      path: ["M9.292 11.89h.888v-.516c0-.732.516-1.236 1.056-1.752.576-.552 1.176-1.116 1.176-2.004 0-1.008-.648-1.992-2.28-1.992-1.464 0-2.46.984-2.544 2.388h.936c.084-.948.696-1.56 1.596-1.56.888 0 1.284.492 1.284 1.2 0 .576-.408 1.008-.876 1.476-.6.588-1.236 1.188-1.236 2.16v.6zm.42 2.484c.42 0 .768-.336.768-.768a.766.766 0 00-.768-.768.766.766 0 00-.768.768c0 .432.348.768.768.768z"],
      viewBox: "0 0 20 20"
  },
  downArrow: {
    title: 'Down',
    path: ["M10 14.1L4.5 8.6l1.1-1.1 4.4 4.4 4.4-4.4 1.1 1.1z"],
    viewBox: "0 0 20 20"
  },
  expand: {
    title: 'Expand',
    path: ["M6 14V9.556M6 14h4.444M6 14l8-8m0 0H9.556M14 6v4.444"],
    viewBox: "4 4 12 12"
  }
}




// export const Hamburger = ({ click, dark }) => (
//   <button onClick={click} className={dark ? [classes.Button, classes.dark].join(' ') : classes.Button}>
//     <svg viewBox="0 0 20 17">
//       <title> Search </title>
//       <path fill={dark ? '#fff' : '#000'} d="M0 14.5h20V16H0zM0 7.5h20V9H0zM0 .5h20V2H0z"/>
//     </svg>
//   </button>
// )

// export const Close = ({ click, dark }) => (
//   <button onClick={click} className={dark ? [classes.Button, classes.dark].join(' ') : classes.Button}>
//     <svg viewBox="0 0 17 17">
//       <title> Close </title>
//       <path strokeWidth="1.5" stroke={dark ? '#fff' : '#000'} d="M1 1l7.5 7.5M16 16L8.5 8.5m0 0L16 1M8.5 8.5L1 16"/>
//     </svg>
//   </button>
// )

// export const Info = ({ dark }) => (
//   <svg viewBox="2 3  22 22">
//     <title> Info </title>
//     <g>
//       <path d="M13.5 27C20.956 27 27 20.956 27 13.5S20.956 0 13.5 0 0 6.044 0 13.5 6.044 27 13.5 27zm0-2C7.15 25 2 19.85 2 13.5S7.15 2 13.5 2 25 7.15 25 13.5 19.85 25 13.5 25z"/>
//       <path d="M12.05 7.64c0-.228.04-.423.12-.585.077-.163.185-.295.32-.397.138-.102.298-.177.48-.227.184-.048.383-.073.598-.073.203 0 .398.025.584.074.186.05.35.126.488.228.14.102.252.234.336.397.084.162.127.357.127.584 0 .22-.043.412-.127.574-.084.163-.196.297-.336.4-.14.106-.302.185-.488.237-.186.053-.38.08-.584.08-.215 0-.414-.027-.597-.08-.182-.05-.342-.13-.48-.235-.135-.104-.243-.238-.32-.4-.08-.163-.12-.355-.12-.576zm-1.02 11.517c.134 0 .275-.013.424-.04.148-.025.284-.08.41-.16.124-.082.23-.198.313-.35.085-.15.127-.354.127-.61v-5.423c0-.238-.042-.43-.127-.57-.084-.144-.19-.254-.318-.332-.13-.08-.267-.13-.415-.153-.148-.024-.286-.036-.414-.036h-.21v-.95h4.195v7.463c0 .256.043.46.127.61.084.152.19.268.314.35.125.08.263.135.414.16.15.027.29.04.418.04h.21v.95H10.82v-.95h.21z"/>
//     </g>
//   </svg>
// )

// export const Help = ({ dark }) => (
//   <svg viewBox="0 0 20 20">
//     <title> Help </title>
//     <path strokeWidth="0.2" d="M9.292 11.89h.888v-.516c0-.732.516-1.236 1.056-1.752.576-.552 1.176-1.116 1.176-2.004 0-1.008-.648-1.992-2.28-1.992-1.464 0-2.46.984-2.544 2.388h.936c.084-.948.696-1.56 1.596-1.56.888 0 1.284.492 1.284 1.2 0 .576-.408 1.008-.876 1.476-.6.588-1.236 1.188-1.236 2.16v.6zm.42 2.484c.42 0 .768-.336.768-.768a.766.766 0 00-.768-.768.766.766 0 00-.768.768c0 .432.348.768.768.768z"/>
//   </svg>
// )

// export const DownArrow = ({ dark }) => (
//   <svg viewBox="0 0 20 20">
//     <path stroke={dark ? '#fff' : '#000'} strokeWidth="0.1" d="M10 14.1L4.5 8.6l1.1-1.1 4.4 4.4 4.4-4.4 1.1 1.1z"/>
//   </svg>
// )

// export const Expand = ({ click }) => (
//   <div className={classes.ExpandContainer}>
//     <div className={classes.Expand}>
//       <button onClick={click} className={classes.Button}>
//         <svg viewBox="4 4 12 12">
//           <title> Expand </title>
//           <path stroke={'rgba(60,60,60)'} strokeWidth="1" d="M6 14V9.556M6 14h4.444M6 14l8-8m0 0H9.556M14 6v4.444"/>
//         </svg>
//       </button>
//     </div>
//   </div>
// )

