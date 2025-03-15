import { ConfigProvider } from 'antd'
import jaJP from 'antd/locale/ja_JP'
import type { ReactNode } from 'react'

import { antdTheme } from '../config'
import { showInsetEffect } from '../helpers/buttonClickEffect'
import { useDarkMode } from '../hooks/useDarkMode'

interface AntdConfigProviderProps {
  children: ReactNode
}

export function AntdConfigProvider({ children }: AntdConfigProviderProps) {
  const { algorithm } = useDarkMode()

  return (
    <ConfigProvider
      locale={jaJP}
      theme={{
        ...antdTheme,
        algorithm,
      }}
      wave={{ disabled: false, showEffect: showInsetEffect }}
    >
      {children}
    </ConfigProvider>
  )
}
