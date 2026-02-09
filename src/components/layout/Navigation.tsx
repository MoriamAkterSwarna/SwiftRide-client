/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Car,
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
import { useTheme } from '@/hooks/useTheme';
import { ModeToggle } from './ModeToggle';

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
  const { theme } = useTheme();

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

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash, location.pathname]);

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
        return '/user/add-ride';
    }
  };

  const getProfileLink = () => {
    if (!currentUser) return '/login';
    switch (currentUser?.role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return '/admin/profile';
      case 'DRIVER':
        return '/driver/profile';
      case 'USER':
      default:
        return '/user/profile';
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    // Check if it's a hash link
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      
      // If we're already on the target page, just scroll
      if (location.pathname === path) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // Navigate to the page first, then scroll will happen via useEffect
        navigate(href);
      }
    }
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
                  <Link 
                    to={child.href} 
                    className="flex items-center gap-2"
                    onClick={() => handleNavClick(child.href)}
                  >
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
            <Link to={item.href} onClick={() => setIsMobileMenuOpen(false)}>
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
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        theme === 'dark'
          ? 'bg-gray-950/95 border-gray-800'
          : 'bg-white/95 border-gray-200'
      } backdrop-blur supports-backdrop-filter:bg-background/60 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Car className="h-8 w-8 text-blue-600 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SwiftRide
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {renderNavItems(publicNavItems)}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ModeToggle />

            {hasSessionHint && currentUser ? (
              <div className="flex items-center gap-3">
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
                      <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
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
                      <Link to={getProfileLink()} className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600 focus:text-red-700">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="relative overflow-hidden group"
                >
                  <Link to="/login">
                    <span className="relative z-10">Login</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                  className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Link to="/register">
                    <span className="relative z-10">Sign Up</span>
                  </Link>
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
          <div className={`md:hidden border-t py-4 ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <nav className="flex flex-col gap-2">
              {renderNavItems(publicNavItems, true)}

              {hasSessionHint && currentUser && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <div className="px-2 py-2 mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{currentUser.name}</div>
                          <div className="text-xs text-muted-foreground">{currentUser.email}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
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
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                        <Car className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to={getProfileLink()} onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
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
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button
                    className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    asChild
                  >
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
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