import { theme as antdTheme } from 'antd'
import { useContext } from 'react'

import { CustomThemeContext } from '../contexts/CustomThemeProvider'

// Ant Design の useToken() + CustomThemeContext を統合する
export const useCustomTheme = () => {
  const { token, hashId, theme } = antdTheme.useToken()
  const customToken = useContext(CustomThemeContext)

  if (!customToken) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider')
  }

  return { token, customToken, hashId, theme }
}
