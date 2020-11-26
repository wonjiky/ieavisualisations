import React from 'react'
import Options from './Options'
import { ThemeContext, themes } from './ThemeContext'

function ProviderTest() {
  const [theme,] = React.useState(themes.dark);
  return (
    <ThemeContext.Provider value={theme}>
      <Options />
    </ThemeContext.Provider>
  )
}

export default ProviderTest


