import { isRouteErrorResponse } from 'react-router'
import type { Route } from '../+types/root'

import { useCustomTheme } from '../themes'

export function ErrorContent({ error }: Route.ErrorBoundaryProps) {
  const { token } = useCustomTheme()
  let message = 'エラー'
  let details = '予期せぬエラーが発生しました。'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404: {
        message = '404'
        details = 'リクエストされたページは見つかりませんでした。'
        break
      }
      default: {
        if (typeof error.data !== 'string' && error.data !== undefined) {
          throw new Error('error.data must be a string or undefined')
        }
        message = '500'
        details = error.data || '予期しないエラーが発生しました。'
      }
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <div
      style={{
        padding: `${token.paddingLG}px ${token.padding}px`,
      }}
    >
      <h1
        style={{
          fontSize: token.fontSizeHeading1,
          marginBottom: token.marginLG,
          color: token.colorError,
        }}
      >
        {message}
      </h1>
      <p
        style={{
          fontSize: token.fontSize,
          marginBottom: stack ? token.marginLG : 0,
          color: token.colorTextSecondary,
        }}
      >
        {details}
      </p>
      {stack && (
        <pre
          style={{
            width: '100%',
            padding: token.padding,
            overflowX: 'auto',
            backgroundColor: token.colorFillTertiary,
            borderRadius: token.borderRadius,
            fontSize: token.fontSizeSM,
          }}
        >
          <code>{stack}</code>
        </pre>
      )}
    </div>
  )
}
