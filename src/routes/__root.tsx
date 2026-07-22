import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { AuthGate } from '../components/AuthGate'
import { AppShell } from '../components/AppShell'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      { title: 'Meridian — Keuangan' },
      { name: 'theme-color', content: '#0e1013' },
      { name: 'description', content: 'Pencatatan keuangan mobile-first' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'icon', href: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/gh/iconoir-icons/iconoir@main/css/iconoir.css',
      },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@450;500;600;700&family=Manrope:wght@500;600;700;800&display=swap',
      },
      { rel: 'manifest', href: '/manifest.webmanifest' },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <AuthGate>
      <AppShell>
        <Outlet />
      </AppShell>
    </AuthGate>
  )
}
