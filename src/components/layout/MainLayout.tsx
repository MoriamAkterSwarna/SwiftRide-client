import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  className?: string;
}

export default function MainLayout({ 
  children, 
  showFooter = true, 
  className = '' 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
