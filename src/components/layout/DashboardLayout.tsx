import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useNavigate } from "react-router"
import { useEffect } from "react"
import { useAppSelector } from "@/redux/hook"
import DashboardHeader from "./DashboardHeader"
import SOSButton from "@/components/SOSButton"
import { useUserInfoQuery } from "@/redux/features/auth/auth.api"
import { role } from "@/constants/role"
import { useGetOngoingRidesQuery, useGetUserActiveRideRequestsQuery } from "@/redux/features/ride/ride.api"

export default function DashboardLayout() {
  const navigate = useNavigate();
  const hasSessionHint = useAppSelector(
    (state) => state.authSession.hasSession,
  );
  const { data: userInfo } = useUserInfoQuery(undefined, {
    skip: !hasSessionHint,
  });
  const userRole = userInfo?.data?.data?.role;
  const isUser = userRole === role.user;
  const isDriver = userRole === role.driver;
  const { data: userActiveRides } = useGetUserActiveRideRequestsQuery(undefined, {
    skip: !hasSessionHint || !isUser,
  });
  const { data: driverOngoingRides } = useGetOngoingRidesQuery(undefined, {
    skip: !hasSessionHint || !isDriver,
  });

  const hasActiveRides = (data: any) => {
    if (Array.isArray(data)) return data.length > 0;
    if (Array.isArray(data?.data)) return data.data.length > 0;
    return false;
  };

  const showSOS =
    (isUser && hasActiveRides(userActiveRides)) ||
    (isDriver && hasActiveRides(driverOngoingRides));

  useEffect(() => {
    if (!hasSessionHint) {
      navigate("/login");
    }
  }, [hasSessionHint, navigate]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <DashboardHeader />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
        {showSOS && <SOSButton />}
      </SidebarInset>
    </SidebarProvider>
  )
}
