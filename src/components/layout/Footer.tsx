import React from 'react';
import { Link } from 'react-router';
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerSections = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ]
  },
  {
    title: 'Products',
    links: [
      { name: 'Ride Booking', href: '/features#riders' },
      { name: 'Driver App', href: '/features#drivers' },
      { name: 'Business Solutions', href: '/business' },
      { name: 'API Integration', href: '/api' },
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Safety', href: '/safety' },
      { name: 'Community Guidelines', href: '/guidelines' },
      { name: 'Report an Issue', href: '/report' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'License Agreement', href: '/license' },
    ]
  }
];

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
];

const features = [
  { icon: Shield, title: 'Safe & Secure', description: 'Your safety is our priority' },
  { icon: Clock, title: '24/7 Service', description: 'Available round the clock' },
  { icon: Users, title: 'Professional Drivers', description: 'Experienced and verified' },
  { icon: Star, title: 'Top Rated', description: '4.8+ star customer rating' },
];

const Footer = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription');
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with SwiftRide</h3>
            <p className="text-gray-400 mb-6">
              Get the latest updates, exclusive offers, and ride tips delivered to your inbox
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
              <Button type="submit" className="bg-primary hover:bg-primary/600">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">SwiftRide</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted ride booking platform. Safe, reliable, and affordable transportation
              at your fingertips. Serving millions of riders worldwide.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-4 w-4 text-primary" />
                <span>1-800-RIDENOW</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@swiftride.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Main St, City, State 12345</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-2"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SwiftRide. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
              <div className="flex items-center gap-2 text-gray-400">
                <span>Made with</span>
                <span className="text-red-500">♥</span>
                <span>by SwiftRide Team</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
