import { type RouteConfig, index, layout } from '@react-router/dev/routes'

export default [layout('./layouts/DefaultLayout.tsx', [index('./routes/home.tsx')])] satisfies RouteConfig
