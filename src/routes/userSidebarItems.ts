import Profile from "@/pages/User/Profile";
import BecomeDriver from "@/pages/User/BecomeDriver";
import type { ISidebarItem } from "@/types";
import AddRide from "@/pages/User/AddRide";
import MyRideHistory from "@/pages/User/MyRideHistory";
import PaymentHistory from "@/pages/User/PaymentHistory";
import { Home, Plus, History, UserCog, Briefcase, CreditCard } from "lucide-react";

export const userSidebarItems: ISidebarItem[] = [
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
    title: "Rides",
    items: [
      {
        title: "Add Ride",
        url: "/user/add-ride",
        component: AddRide,
        icon: Plus,
      },
      {
        title: "My Rides",
        url: "/user/my-rides",
        component: MyRideHistory,
        icon: History,
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        title: "Payment History",
        url: "/user/payment-history",
        component: PaymentHistory,
        icon: CreditCard,
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
        icon: UserCog,
      },
      {
        title: "Become a Driver",
        url: "/user/become-driver",
        component: BecomeDriver,
        icon: Briefcase,
      },
    ],
  },
];
 