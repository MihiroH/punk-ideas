import { Outlet } from 'react-router'
import type { Route } from '~/+types/root'
import '@ant-design/v5-patch-for-react-19'

import '~/app.css'
import { ErrorContent } from '~/common/components/ErrorContent'
import ErrorLayout from '~/common/layouts/ErrorLayout'
import { RootLayout } from '~/common/layouts/RootLayout'
import { CustomThemeProvider } from '~/common/themes/contexts/CustomThemeContext'
import { AntdConfigProvider } from '~/common/themes/contexts/AntdConfigContext'

export const links: Route.LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: '/css/antd.min.css',
  },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>
}

export default function App() {
  return (
    <AntdConfigProvider>
      <CustomThemeProvider>
        <Outlet />
      </CustomThemeProvider>
    </AntdConfigProvider>
  )
}

export function ErrorBoundary(props: Route.ErrorBoundaryProps) {
  return (
    <AntdConfigProvider>
      <CustomThemeProvider>
        {/* NOTE: DefaultLayoutをConfiguring Routesとここで併用するとErrorContentが表示されなくなるため、同じ内容のErrorLayoutでラップしている */}
        <ErrorLayout>
          <ErrorContent {...props} />
        </ErrorLayout>
      </CustomThemeProvider>
    </AntdConfigProvider>
  )
}
