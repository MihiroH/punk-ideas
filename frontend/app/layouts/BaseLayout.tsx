import { Layout, Menu } from 'antd'
import { Link } from 'react-router'

import { useCustomTheme } from '../themes'

interface BaseLayoutProps {
  children: React.ReactNode
}

const { Header, Content } = Layout

export function BaseLayout({ children }: BaseLayoutProps) {
  const { token } = useCustomTheme()

  const menuItems = [
    {
      key: 'home',
      label: <Link to="/">ホーム</Link>,
    },
    {
      key: 'ideas',
      label: <Link to="/ideas">アイデア</Link>,
    },
  ]

  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          zIndex: 1,
          width: '100%',
          background: token.colorBgContainer,
          boxShadow: `0 2px 8px ${token.colorBorderSecondary}`,
          padding: `0 ${token.paddingContentHorizontal}px`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <div
            style={{
              fontSize: token.fontSizeHeading4,
              marginRight: token.margin,
              fontWeight: 'bold',
            }}
          >
            <Link
              to="/"
              style={{
                color: token.colorText,
                textDecoration: 'none',
              }}
            >
              Punk Ideas
            </Link>
          </div>
          <Menu
            mode="horizontal"
            items={menuItems}
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              border: 'none',
            }}
          />
        </div>
      </Header>
      <Content
        style={{
          marginTop: 64,
          minHeight: 'calc(100vh - 64px)',
          padding: token.padding,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  )
}
