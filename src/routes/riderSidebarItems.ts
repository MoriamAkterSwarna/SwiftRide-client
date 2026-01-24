import ManageRides from "@/pages/Rider/ManageRides";
import RiderDashboard from "@/pages/Rider/RiderDashboard";
import type { ISidebarItem } from "@/types";

export const riderSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/rider/dashboard",
        component: RiderDashboard,
      },
       {
        title: "Manage Rides",
        url: "/rider/manage-rides",
        component: ManageRides,
      },
    ],
  },
];
