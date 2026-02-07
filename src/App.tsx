import { Outlet, useLocation } from 'react-router'
import CommonLayout from './components/layout/CommonLayout'
import SOSButton from './components/SOSButton'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from 'sonner'

function App() {
  const location = useLocation();

  // Show SOS button only on active ride pages
  const showSOS = location.pathname.includes('/request-ride') ||
    location.pathname.includes('/ride-details');

  // Check if current route should use MainLayout (public pages)
  const publicRoutes = ['/', '/about', '/features', '/contact', '/faq'];
  const isPublicRoute = publicRoutes.includes(location.pathname) ||
    location.pathname === '/' ||
    location.pathname.startsWith('/about') ||
    location.pathname.startsWith('/features') ||
    location.pathname.startsWith('/contact') ||
    location.pathname.startsWith('/faq');

  // For public routes, don't use CommonLayout (MainLayout is used in routing)
  // For auth routes and dashboard routes, use CommonLayout
  const shouldUseCommonLayout = !isPublicRoute;

  return (
    <ErrorBoundary>
      {shouldUseCommonLayout ? (
        <CommonLayout>
          <Outlet />
        </CommonLayout>
      ) : (
        <Outlet />
      )}
      <SOSButton visible={showSOS} />
      <Toaster position="top-right" />
    </ErrorBoundary>
  )
}

export default App
