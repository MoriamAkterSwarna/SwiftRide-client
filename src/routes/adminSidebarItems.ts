import AddDistrict from "@/pages/Admin/AddDistrict";
import AddDivision from "@/pages/Admin/AddDivision";
import AddRideType from "@/pages/Admin/AddRideType";


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
    title: "Ride Management",
    items: [
      {
        title: "Add Ride Type",
        url: "/admin/add-ride-type",
        component: AddRideType,
      },

      {
        title: "Add Division",
        url: "/admin/add-division",
        component: AddDivision,
      },
      {
        title: "Add District",
        url: "/admin/add-district",
        component: AddDistrict,
      },
    ],
  },
];
