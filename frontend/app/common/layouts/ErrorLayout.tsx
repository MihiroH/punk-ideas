import type { ReactNode } from 'react'

import { BaseLayout } from './BaseLayout'

interface ErrorLayoutProps {
  children: ReactNode
}

// NOTE: <DefaultLayout>をConfiguring Routesとroot.tsxの<ErrorBoundary>内で併用すると後者のchildrenが表示されなくなるため、同じ内容の<ErrorLayout>を用意している
export function ErrorLayout({ children }: ErrorLayoutProps) {
  return <BaseLayout>{children}</BaseLayout>
}
