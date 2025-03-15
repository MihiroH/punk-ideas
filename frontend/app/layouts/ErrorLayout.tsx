import { BaseLayout } from './BaseLayout'

interface ErrorLayoutProps {
  children: React.ReactNode
}

// NOTE: DefaultLayoutをConfiguring RoutesとrootのErrorBoundary内で併用すると後者のchildrenが表示されなくなるため、同じ内容のErrorLayoutを用意している
export default function ErrorLayout({ children }: ErrorLayoutProps) {
  return <BaseLayout>{children}</BaseLayout>
}
