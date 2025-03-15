import { type ReactNode, createContext } from 'react'

import { type CustomThemeToken, customThemeToken } from './themes'

export const CustomThemeContext = createContext<CustomThemeToken | undefined>(undefined)

interface CustomThemeProviderProps {
  children: ReactNode
}

export function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  return <CustomThemeContext value={customThemeToken}>{children}</CustomThemeContext>
}
