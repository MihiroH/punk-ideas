import { Outlet } from 'react-router'

import { BaseLayout } from './BaseLayout'

export default function DefaultLayout() {
  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  )
}
