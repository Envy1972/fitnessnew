import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Workouts', path: '/workouts' },
    { name: 'Nutrition', path: '/nutrition' },
    { name: 'Weight', path: '/weight' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 md:top-0 md:bottom-auto md:border-t-0 md:border-b z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Bottom Navigation */}
          <div className="flex justify-around w-full md:hidden">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                className={`flex flex-col items-center py-1 px-3 ${
                  currentPage === item.name.toLowerCase() 
                    ? 'text-blue-800' 
                    : 'text-gray-600 hover:text-blue-800'
                }`}
              >
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Top Navigation */}
          <div className="hidden md:flex">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-800">FitnessTracker</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === item.name.toLowerCase() 
                    ? 'text-blue-800 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-800 hover:bg-blue-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:block">
            <button className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
