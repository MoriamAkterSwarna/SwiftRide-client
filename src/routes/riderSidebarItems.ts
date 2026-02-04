import RequestRide from "@/pages/Rider/RequestRide";
import RideHistory from "@/pages/Rider/RideHistory";
import EarningsDashboard from "@/pages/Rider/EarningsDashboard";
import Profile from "@/pages/User/Profile";
import type { ISidebarItem } from "@/types";

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "Rides",
    items: [
      {
        title: "Request Ride",
        url: "/rider/request-ride",
        component: RequestRide,
      },
      {
        title: "Ride History",
        url: "/rider/ride-history",
        component: RideHistory,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Earnings Dashboard",
        url: "/rider/earnings",
        component: EarningsDashboard,
      },
      {
        title: "My Profile",
        url: "/rider/profile",
        component: Profile,
      },
    ],
  },
];
