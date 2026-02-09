import RideHistory from "@/pages/Driver/RideHistory";
import EarningsDashboard from "@/pages/Driver/EarningsDashboard";
import ManageRides from "@/pages/Driver/ManageRides";
import Profile from "@/pages/User/Profile";
import type { ISidebarItem } from "@/types";
import { Home, Car, DollarSign, UserCog, History, DatabaseZap } from "lucide-react";
import DriverDashboard from "@/pages/Driver/DriverDashboard";

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Navigation",
    items: [
      {
        title: "Home",
        url: "/",
        isExternal: true,
        icon: Home,
      },
    ],
  },
  {
    title: "Driver",
    items: [
      {
        title: "Manage Rides",
        url: "/driver/manage-rides",
        component: ManageRides,
        icon: Car,
      },
      {
        title: "Ride History",
        url: "/driver/ride-history",
        component: RideHistory,
        icon: History,
      },
    ],
  },
  {
    title:"Dashboard",
    items:[
      {
        title:"Dashboard",
        url: "/driver/dashboard",
        component: DriverDashboard,
        icon: DatabaseZap,
      },
      {
        title: "Earnings",
        url: "/driver/earnings",
        component: EarningsDashboard,
        icon: DollarSign,
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
        icon: UserCog,
      },
    ],
  },
];
