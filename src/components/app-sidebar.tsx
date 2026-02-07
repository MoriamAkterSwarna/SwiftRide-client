/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useState } from "react";

import { SearchForm } from "@/components/search-form";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Logo from "@/assets/icons/Logo";
import { Link, useNavigate } from "react-router";
import { useUserInfoQuery, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { getSidebarItems } from "@/utils/getSidebarItems";
import type { TRole } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { LogOut, Settings, HelpCircle, Moon, Sun, ChevronUp } from "lucide-react";
import { clearSession } from "@/redux/features/auth/authSessionSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const hasSessionHint = useAppSelector(
    (state) => state.authSession.hasSession,
  );
  const { data: userData } = useUserInfoQuery(undefined, {
    skip: !hasSessionHint,
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMutation] = useLogoutMutation();

  const data = {
    navMain: getSidebarItems(userData?.data?.data?.role as TRole),
  };

  const user = userData?.data?.data;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutMutation({}).unwrap();
      dispatch(clearSession());
      navigate("/login");
    } catch {
      // Still clear session even if logout fails
      dispatch(clearSession());
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar {...props} className="border-r border-slate-200/50 bg-white/80 backdrop-blur dark:border-slate-800/50 dark:bg-slate-950/80">
      {/* Header */}
      <SidebarHeader className="border-b border-slate-200/50 px-4 py-6 dark:border-slate-800/50">
        <div className="flex items-center justify-between">
          <Logo />
        </div>
        <SearchForm />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2 py-4">
        {data.navMain.map((item: any, idx: number) => (
          <SidebarGroup key={`${item.title}-${idx}`} className="mb-1 border-b border-slate-200/30 pb-3 last:border-b-0 dark:border-slate-800/30">
            <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-3">
              <SidebarMenu className="gap-1">
                {item.items.map((subItem: any) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      asChild
                      className="h-10 rounded-xl px-3 font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 data-[active]:bg-slate-900 data-[active]:text-white dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white dark:data-[active]:bg-blue-600"
                    >
                      <Link to={subItem.url} className="flex items-center gap-3">
                        {subItem.icon && <subItem.icon className="h-5 w-5" />}
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-200/50 p-4 dark:border-slate-800/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full rounded-2xl border border-slate-200/60 bg-slate-50/80 p-3 transition-all duration-200 hover:bg-slate-100/80 dark:border-slate-800/60 dark:bg-slate-900/60 dark:hover:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-200 dark:border-slate-700">
                  <img
                    src={user?.picture || `https://i.pravatar.cc/160?u=${user?.email}`}
                    alt={user?.name || "User"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email || "No email"}
                  </p>
                </div>
                <ChevronUp className="h-4 w-4 text-slate-400" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="top" 
            align="end"
            className="w-56 rounded-xl border border-slate-200/60 bg-white/95 p-2 shadow-xl backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/95"
          >
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {user?.role || "USER"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-800/50" />
            
            <DropdownMenuItem 
              onClick={() => navigate("/help")}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help Line</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => navigate("/settings")}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-800/50" />
            
            <DropdownMenuItem 
              onClick={toggleTheme}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              {theme === "light" ? (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Light Mode</span>
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-800/50" />
            
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 cursor-pointer disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
