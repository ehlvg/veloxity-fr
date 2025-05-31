import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';

const Navbar = ({ user, onLogout, theme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Главная',
      icon: (
        <i className="ph ph-folder"></i>
      )
    },
    {
      path: '/teams',
      label: 'Команды',
      icon: (
        <i className="ph ph-users-three"></i>
      )
    },
    {
      path: '/projects',
      label: 'Проекты',
      icon: (
        <i className="ph ph-cards-three"></i>
      )
    },
    {
      path: '/search',
      label: 'Поиск',
      icon: (
        <i className="ph ph-magnifying-glass"></i>
      )
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        'bg-white/95 backdrop-blur-md border-gray-200'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                <i className="ph ph-kanban text-white"></i>
              </div>
              <span className={`text-xl font-playfair font-bold ${
                'text-gray-800'
              }`}>
                Veloxity
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-martian text-sm transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-orange-500/10 text-orange-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link
                to="/settings"
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive('/settings')
                    ? 'bg-orange-500/10 text-orange-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <i className="ph ph-gear-fine"></i>
              </Link>

              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl border-2 border-gray-200 shadow-sm"
                />
                <div className="hidden lg:block">
                  <p className={`text-sm font-martian font-medium ${
                    'text-gray-800'
                  }`}>
                    {user.name}
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                title="Выйти"
              >
                <i className="ph ph-sign-out"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-colors duration-300 ${
        'bg-white/95 backdrop-blur-md border-gray-200'
      } border-t`}>
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-orange-600'
                  : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span className="text-xs font-martian">{item.label}</span>
            </Link>
          ))}
          
          {/* Settings for mobile */}
          <Link
            to="/settings"
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
              isActive('/settings')
                ? 'text-orange-600'
                : 'text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-martian">Настройки</span>
          </Link>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:block hidden"></div>
    </>
  );
};

export default Navbar;