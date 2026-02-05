import { Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import { useGetUserProfileQuery } from './redux/features/user/user.api'
import CommonLayout from './components/layout/CommonLayout'
import SOSButton from './components/SOSButton'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from 'sonner'

function App() {
  const location = useLocation();
  
  // Check if user has valid session via cookies
  const hasValidSession = document.cookie.split('; ').some(row => row.startsWith('accessToken='));
  
  // Fetch user profile if we have a valid session
  const { data: profileData } = useGetUserProfileQuery(undefined, {
    skip: !hasValidSession,
  });

  useEffect(() => {
    // If we have profile data, we can use it to verify auth
    if (profileData?.data) {
      console.log('User profile loaded from API');
    }
  }, [profileData]);
  
  // Show SOS button only on active ride pages
  const showSOS = location.pathname.includes('/request-ride') || 
                  location.pathname.includes('/ride-details');

  return (
    <ErrorBoundary>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
      <SOSButton visible={showSOS} />
      <Toaster position="top-right" />
    </ErrorBoundary>
  )
}

export default App
