import RequestRide from "@/pages/Rider/RequestRide";
import RideHistory from "@/pages/Rider/RideHistory";
import EarningsDashboard from "@/pages/Rider/EarningsDashboard";
import ManageRides from "@/pages/Rider/ManageRides";
import Profile from "@/pages/User/Profile";
import type { ISidebarItem } from "@/types";

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "Driver",
    items: [
      {
        title: "Request Ride",
        url: "/driver/request-ride",
        component: RequestRide,
      },
      {
        title: "Manage Rides",
        url: "/driver/manage-rides",
        component: ManageRides,
      },
      {
        title: "Ride History",
        url: "/driver/ride-history",
        component: RideHistory,
      },
    ],
  },
  {
    title: "Earnings",
    items: [
      {
        title: "Dashboard",
        url: "/driver/earnings",
        component: EarningsDashboard,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "My Profile",
        url: "/driver/profile",
        component: Profile,
      },
    ],
  },
];
