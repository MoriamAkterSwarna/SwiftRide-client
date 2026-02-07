/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Car
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import { useUserInfoQuery, useLogoutMutation } from '@/redux/features/auth/auth.api';
import { clearSession } from '@/redux/features/auth/authSessionSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { baseApi } from '@/redux/baseApi';

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
}

const publicNavItems: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  {
    name: 'Features',
    href: '/features',
    children: [
      { name: 'For Riders', href: '/features#riders' },
      { name: 'For Drivers', href: '/features#drivers' },
      { name: 'For Admins', href: '/features#admins' },
    ]
  },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const hasSessionHint = useAppSelector(
    (state) => state.authSession.hasSession,
  );
  const { data: userInfo } = useUserInfoQuery(undefined, {
    skip: !hasSessionHint,
  });
  const currentUser = userInfo?.data?.data;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation(undefined).unwrap();
      localStorage.removeItem("sr_has_session");
      dispatch(clearSession());
      dispatch(baseApi.util.resetApiState());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem("sr_has_session");
      dispatch(clearSession());
      dispatch(baseApi.util.resetApiState());
      // Still navigate to home even if logout API fails
      navigate('/');
    }
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    switch (currentUser?.role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return '/admin/analytics';
      case 'DRIVER':
        return '/driver/manage-rides';
      case 'USER':
      default:
        return '/user/dashboard';
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const renderNavItems = (items: NavigationItem[], mobile = false) => {
    return items.map((item) => (
      <div key={item.name} className="relative">
        {item.children ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isActivePath(item.href) ? 'secondary' : 'ghost'}
                className={`flex items-center gap-2 ${mobile ? 'w-full justify-start' : ''}`}
              >
                {item.icon}
                {item.name}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={mobile ? 'start' : 'center'} className="w-48">
              {item.children.map((child) => (
                <DropdownMenuItem key={child.name} asChild>
                  <Link to={child.href} className="flex items-center gap-2">
                    {child.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant={isActivePath(item.href) ? 'secondary' : 'ghost'}
            asChild
            className={`flex items-center gap-2 ${mobile ? 'w-full justify-start' : ''}`}
          >
            <Link to={item.href}>
              {item.icon}
              {item.name}
            </Link>
          </Button>
        )}
      </div>
    ));
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-200 ${isScrolled ? 'shadow-md' : ''
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">SwiftRide</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {renderNavItems(publicNavItems)}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {hasSessionHint && currentUser ? (
              <div className="flex items-center gap-4">
                {/* Status Badge */}
                <div className="hidden sm:flex items-center gap-2">
                  <Badge
                    variant={currentUser.isActive ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {currentUser.isActive ? 'Active' : 'Suspended'}
                  </Badge>
                  {currentUser.role === 'DRIVER' && (
                    <Badge
                      variant={currentUser.isOnline ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {currentUser.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  )}
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{currentUser.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">{currentUser.name}</div>
                      <div className="text-muted-foreground">{currentUser.email}</div>
                      <Badge variant="outline" className="mt-1">
                        {currentUser.role}
                      </Badge>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/user/profile" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col gap-2">
              {renderNavItems(publicNavItems, true)}
              {hasSessionHint && currentUser && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to={getDashboardLink()}>Dashboard</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/user/profile">Profile Settings</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              )}
              {!hasSessionHint && (
                <div className="border-t pt-2 mt-2 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    className="w-full"
                    asChild
                  >
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
