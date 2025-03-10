import { type ReactNode, createContext } from 'react'

import { type CustomThemeToken, customThemeToken } from './themes'

export const CustomThemeContext = createContext<CustomThemeToken>(customThemeToken)

interface CustomThemeProviderProps {
  children: ReactNode
}

export function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  return <CustomThemeContext.Provider value={customThemeToken}>{children}</CustomThemeContext.Provider>
}
