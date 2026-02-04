import { Outlet, useLocation } from 'react-router'
import CommonLayout from './components/layout/CommonLayout'
import SOSButton from './components/SOSButton'

function App() {
  const location = useLocation();
  
  // Show SOS button only on active ride pages
  const showSOS = location.pathname.includes('/request-ride') || 
                  location.pathname.includes('/ride-details');

  return (
    <>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
      <SOSButton visible={showSOS} />
    </>
  )
}

export default App
