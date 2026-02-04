import RequestRide from "@/pages/Rider/RequestRide";
import RideHistory from "@/pages/Rider/RideHistory";
import Profile from "@/pages/User/Profile";
import BecomeDriver from "@/pages/User/BecomeDriver";
import type { ISidebarItem } from "@/types";

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "Rides",
    items: [
      {
        title: "Request Ride",
        url: "/user/request-ride",
        component: RequestRide,
      },
      {
        title: "Ride History",
        url: "/user/ride-history",
        component: RideHistory,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "My Profile",
        url: "/user/profile",
        component: Profile,
      },
      {
        title: "Become a Driver",
        url: "/user/become-driver",
        component: BecomeDriver,
      },
    ],
  },
];
