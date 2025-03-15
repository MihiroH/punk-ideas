import { type RouteConfig, index, layout } from '@react-router/dev/routes'

import DefaultLayout from '~/common/layouts/DefaultLayout'
import Home from '~/ideas/routes/home'

export default [layout(DefaultLayout, [index(Home)])] satisfies RouteConfig
