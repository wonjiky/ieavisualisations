import React, { useContext, createContext } from 'react'

const themes = {
  dark: {
    theme: 'dark',
    style :{
      background: 'rgba(43, 43, 43, .95)',
      color: '#fff',
      borderColor: '#fff'
    },
  },
  light: {
    theme: 'light',
    style: {
      background: '#fff',
      color: '#000',
      borderColor: '#000'
    }
  }
}

const ThemeContext = createContext(themes.light);

export function useTheme() { return useContext(ThemeContext); };

export function ThemeProvider({ children, theme }) {
  return (
    <ThemeContext.Provider value={!theme ? themes.light : themes[theme]}>
      {children}
    </ThemeContext.Provider>  
  )
}; 