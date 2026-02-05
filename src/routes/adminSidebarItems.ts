import AddDistrict from "@/pages/Admin/District/AddDistrict";
import AddDivision from "@/pages/Admin/Division/AddDivision";
import AddRideType from "@/pages/Admin/RideType/AddRideType";
import UserManagement from "@/pages/Admin/UserManagement";
import DriverManagement from "@/pages/Admin/DriverManagement";
import RideManagement from "@/pages/Admin/RideManagement";

import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
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
      },
      {
        title: "Drivers",
        url: "/admin/drivers",
        component: DriverManagement,
      },
      {
        title: "Rides",
        url: "/admin/rides",
        component: RideManagement,
      },
      {
        title: "Driver Requests",
        url: "/admin/driver-requests",
        component: lazy(() => import("@/pages/Admin/DriverRequest")),
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
      },
      {
        title: "Divisions",
        url: "/admin/add-division",
        component: AddDivision,
      },
      {
        title: "Districts",
        url: "/admin/add-district",
        component: AddDistrict,
      },
    ],
  },
];
