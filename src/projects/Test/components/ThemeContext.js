import { createContext } from 'react';

export const themes = {
  light: {
    background: "#000",
    foreground: "#fff"
  },
  dark: {
    background: "#fff",
    foreground: "#000"
  }
}

export const ThemeContext = createContext(themes.dark);