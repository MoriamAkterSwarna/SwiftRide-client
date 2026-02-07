import DashboardLayout from "@/components/layout/DashboardLayout";
import MainLayout from "@/components/layout/MainLayout";

import About from "@/pages/Public/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";

import Features from "@/pages/Public/Features";
import Contact from "@/pages/Public/Contact";
import FAQ from "@/pages/Public/FAQ";
import GoogleCallback from "@/pages/GoogleCallback";
import { generateRoutes } from "@/utils/generateRoutes";
import Settings from "@/pages/Settings";
import Helpline from "@/pages/Helpline";

import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
import { driverSidebarItems } from "./driverSidebarItems";
import Unauthorized from "@/pages/Unauthorized";
import { withAuth } from "@/utils/withAuth";
import type { TRole } from "@/types";
import { role } from "@/constants/role";
import Home from "@/pages/Home";

export const router = createBrowserRouter([
  {
    Component: () => <MainLayout><Outlet /></MainLayout>,
    path: "/",
    children: [
      {
        Component: Home,
        index: true,
      },
      {
        Component: About,
        path: "about",
      },
      {
        Component: Features,
        path: "features",
      },
      {
        Component: Contact,
        path: "contact",
      },
      {
        Component: FAQ,
        path: "faq",
      },
    ],
  },
  {
    Component: withAuth(DashboardLayout, [
      role.superAdmin,
      role.admin,
    ] as TRole[]),
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/analytics" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.user as TRole),
    path: "/user",
    children: [
      { index: true, element: <Navigate to="/user/add-ride" /> },
      ...generateRoutes(userSidebarItems),
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.rider as TRole),
    path: "/driver",
    children: [
      { index: true, element: <Navigate to="/driver/manage-rides" /> },
      ...generateRoutes(driverSidebarItems),
    ],
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
  {
    Component: Verify,
    path: "/verify",
  },
  {
    Component: GoogleCallback,
    path: "/auth/google/callback",
  },
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
  {
    Component: withAuth(Settings, [role.user, role.driver, role.admin, role.superAdmin] as TRole[]),
    path: "/settings",
  },
  {
    Component: withAuth(Helpline, [role.user, role.driver, role.admin, role.superAdmin] as TRole[]),
    path: "/help",
  },
]);
