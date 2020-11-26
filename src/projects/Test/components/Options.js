import React from 'react'
import { ThemeContext } from './ThemeContext'

function Options() {
  const theme = React.useContext(ThemeContext);
  console.log(theme);
  return (
    <button>
      I am styled by theme context!
    </button>
  )
}

export default Options