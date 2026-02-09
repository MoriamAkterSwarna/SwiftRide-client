import AddDistrict from "@/pages/Admin/District/AddDistrict";
import AddDivision from "@/pages/Admin/Division/AddDivision";
import AddRideType from "@/pages/Admin/RideType/AddRideType";
import UserManagement from "@/pages/Admin/UserManagement";
import DriverManagement from "@/pages/Admin/DriverManagement";
import RideManagement from "@/pages/Admin/RideManagement";
import Profile from "@/pages/User/Profile";

import type { ISidebarItem } from "@/types";
import { lazy } from "react";
import { Home, BarChart3, Users, Car, MapPin, UserCog, CreditCard } from "lucide-react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const Payments = lazy(() => import("@/pages/Admin/Payments"));

export const adminSidebarItems: ISidebarItem[] = [
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
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
        icon: BarChart3,
      },
      {
        title: "Payments",
        url: "/admin/payments",
        component: Payments,
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        url: "/admin/users",
        component: UserManagement,
        icon: Users,
      },
      {
        title: "Drivers",
        url: "/admin/drivers",
        component: DriverManagement,
        icon: Car,
      },
      {
        title: "Rides",
        url: "/admin/rides",
        component: RideManagement,
        icon: Car,
      },
      {
        title: "Driver Requests",
        url: "/admin/driver-requests",
        component: lazy(() => import("@/pages/Admin/DriverRequest")),
        icon: Users,
      }
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Ride Types",
        url: "/admin/add-ride-type",
        component: AddRideType,
        icon: Car,
      },
      {
        title: "Divisions",
        url: "/admin/add-division",
        component: AddDivision,
        icon: MapPin,
      },
      {
        title: "Districts",
        url: "/admin/add-district",
        component: AddDistrict,
        icon: MapPin,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "My Profile",
        url: "/admin/profile",
        component: Profile,
        icon: UserCog,
      },
    ],
  },
];
