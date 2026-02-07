/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Logo from "@/assets/icons/Logo";
import { ModeToggle } from "./ModeToggle";
import { Link, useNavigate } from "react-router";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { clearSession } from "@/redux/features/auth/authSessionSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { toast } from "sonner";
import { role } from "@/constants/role";
import type { TRole } from "@/types";
import { baseApi } from "@/redux/baseApi";

// Hamburger icon component
const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    className={cn("pointer-events-none", className)}
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...(props as any)}
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
    />
  </svg>
);
// Types
export interface NavbarNavItem {
  href?: string;
  label: string;
  active?: boolean;
  role?: TRole;
}
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: NavbarNavItem[];
  signInText?: string;
  signInHref?: string;
  signOutText?: string;
  signOutHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}
// Default navigation links
const defaultNavigationLinks: NavbarNavItem[] = [
  { href: "/", label: "Home", role: "PUBLIC" },
  { href: "/features", label: "Features", role: "PUBLIC" },
  { href: "/about", label: "About", role: "PUBLIC" },
  { href: "/contact", label: "Contact", role: "PUBLIC" },
  { href: "/faq", label: "FAQ", role: "PUBLIC" },
  { href: "/admin", label: "Dashboard", role: role.admin },
  { href: "/admin", label: "Dashboard", role: role.superAdmin },
  { href: "/user", label: "Dashboard", role: role.user },
  { href: "/rider", label: "Dashboard", role: role.rider },
];
export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo = <Logo />,
      logoHref = "#",
      navigationLinks = defaultNavigationLinks,
      signInText = "Sign In",
      signInHref = "/login",
      signOutText = "Sign Out",
      onSignInClick,
      ...props
    },
    ref,
  ) => {
    const hasSessionHint = useAppSelector(
      (state) => state.authSession.hasSession,
    );
    const { data } = useUserInfoQuery(undefined, {
      skip: !hasSessionHint,
    });
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();
    console.log(data?.data?.data.email);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    const dispatch = useAppDispatch();

    console.log(data?.data?.data?.role);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };
      checkWidth();
      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => {
        resizeObserver.disconnect();
      };
    }, []);
    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const handleLogout = async () => {
      try {
        await logout(undefined).unwrap();
        localStorage.removeItem("sr_has_session");
        dispatch(clearSession());
        dispatch(authApi.util.resetApiState());
          dispatch(baseApi.util.resetApiState());
        navigate("/");
        toast.success("Logged out successfully!");
      } catch (error: any) {
        toast.error(error?.data?.message || "Logout failed");
        navigate("/");
      }
    };

    return (
      <header
        ref={combinedRef}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 md:px-6 *:no-underline",
          className,
        )}
        {...(props as any)}
      >
        <div className="container px-4 py-16 mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-1">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {navigationLinks.map((link, index) => (
                        <React.Fragment key={index}>
                          {link.role === "PUBLIC" && (
                            <NavigationMenuItem asChild className="w-full">
                              <Link
                                to={link.href ?? "/"}
                                className={cn(
                                  "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline",
                                  link.active &&
                                    "bg-accent text-accent-foreground",
                                )}
                              >
                                {link.label}
                              </Link>
                            </NavigationMenuItem>
                          )}

                          {hasSessionHint && link.role === data?.data?.data?.role && (
                            <NavigationMenuItem asChild className="w-full">
                              <Link
                                to={link.href ?? "/"}
                                className={cn(
                                  "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline",
                                  link.active &&
                                    "bg-accent text-accent-foreground",
                                )}
                              >
                                {link.label}
                              </Link>
                            </NavigationMenuItem>
                          )}
                        </React.Fragment>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <button
                onClick={(e) => e.preventDefault()}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
              >
                <div className="text-2xl">{logo}</div>
              </button>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                  <NavigationMenuList className="gap-1">
                    {navigationLinks.map((link, index) => {
                      const isVisible =
                        link.role === "PUBLIC" 
                        ||
                        (hasSessionHint && link.role === data?.data?.data?.role);
                      if (!isVisible) return null;
                      return (
                        <NavigationMenuItem key={index}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={link.href ?? "/"}
                              className={cn(
                                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer relative",
                                "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100",
                                link.active &&
                                  "before:scale-x-100 text-primary",
                              )}
                              data-active={link.active}
                            >
                              {link.label}
                            </Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            {hasSessionHint && (
              <Button
                onClick={handleLogout}
                size="sm"
                variant="outline"
                className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
              >
                {signOutText}
              </Button>
            )}

            {!hasSessionHint && (
              <Button
                size="sm"
                className="text-sm font-medium px-4 h-9 rounded-md shadow-sm"
              >
                <Link to={signInHref}>{signInText}</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
    );
  },
);
Navbar.displayName = "Navbar";
export { HamburgerIcon };
export default Navbar;
