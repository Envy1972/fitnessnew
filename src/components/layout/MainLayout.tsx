import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../auth/AuthProvider';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage }) => {
  const { user } = useAuth();

  if (!user) {
    return null; // This will be handled by ProtectedRoute
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} />
      
      {/* Main content with padding for navbar */}
      <div className="flex-grow container mx-auto px-4 pt-4 pb-20 md:pt-20 md:pb-4">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
      
      {/* Quick action button (mobile) */}
      <div className="fixed right-4 bottom-20 md:bottom-4 z-20">
        <button className="bg-amber-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-amber-400 transition-colors">
          <span className="text-2xl">+</span>
        </button>
      </div>
    </div>
  );
};

export default MainLayout;
