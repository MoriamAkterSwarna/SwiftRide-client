
import Profile from "@/pages/User/Profile";
import BecomeDriver from "@/pages/User/BecomeDriver";
import type { ISidebarItem } from "@/types";
import AddRide from "@/pages/User/AddRide";

import MyRideHistory from "@/pages/User/MyRideHistory";


export const userSidebarItems: ISidebarItem[] = [
  {
    title: "Navigation",
    items: [
      {
        title: "Home",
        url: "/",
        isExternal: true,
      },
    ],
  },
  {
    title: "Rides",
    items: [

       {
        title: "Add Ride",
        url: "/user/add-ride",
        component: AddRide,
      },
      {
        title: "My Rides",
        url: "/user/my-rides",
        component: MyRideHistory,
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
