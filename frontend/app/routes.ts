import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'

export default [
  layout('./common/layouts/DefaultLayout.tsx', [
    index('./top/routes/redirectToIdeas.tsx'),

    ...prefix('/ideas', [
      index('./ideas/routes/index.tsx'),
      route('new', './ideas/routes/new.tsx'),
      route(':id', './ideas/routes/_id/index.tsx'),
      route(':id/edit', './ideas/routes/_id/edit.tsx'),
    ]),
  ]),
] satisfies RouteConfig
