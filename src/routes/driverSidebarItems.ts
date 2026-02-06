
import RideHistory from "@/pages/Driver/RideHistory";
import EarningsDashboard from "@/pages/Driver/EarningsDashboard";
import ManageRides from "@/pages/Driver/ManageRides";
import Profile from "@/pages/User/Profile";
import type { ISidebarItem } from "@/types";

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Driver",
    items: [

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
