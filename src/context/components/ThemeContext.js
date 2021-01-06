import React, { useContext, createContext } from 'react'

const themes = {
  dark: {
    theme: 'dark',
    style: {
      background: 'rgba(43, 43, 43, .95)',
      color: '#fff',
      borderColor: '#fff',
    },
    bar: {
      borderColor: '#fff',
      background: '#fff',
    },
    icon: {
      float: '#fff',
      color: '#fff'
    }
  },
  light: {
    theme: 'light',
    style: {
      background: '#fff',
      color: '#000',
      borderColor: '#000'
    },
    bar: {
      borderColor: '#949494',
      background: '#949494',
    },
    icon: {
      float: '#fff',
      color: '#000'
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