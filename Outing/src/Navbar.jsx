import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${
        active
          ? 'bg-indigo-100/80 text-indigo-700 dark:bg-dark-glass dark:text-indigo-300 border border-indigo-200 dark:border-dark-border'
          : 'hover:bg-indigo-100/60 dark:hover:bg-dark-glass text-gray-700 dark:text-gray-100'
      }`}
    >
      {children}
    </Link>
  );
};

const Navbar = ({ user, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/60 dark:bg-dark-glass border-b border-indigo-100 dark:border-dark-border shadow-[0_4px_24px_0_rgba(99,102,241,0.08)] dark:shadow-glass-dark transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <img
            src="/logo.png"
            alt="Travelly logo"
            className="w-9 h-9 rounded-xl shadow-md object-contain bg-white/0"
            draggable={false}
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-300 drop-shadow-sm">
            <span className="navbar-logo-gradient">Travelly</span>
          </h1>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/planner">Planner</NavLink>
          <NavLink to="/saved">Saved</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        {/* Auth / User */}
        <div className="flex items-center gap-2">
          {user?.user_metadata?.full_name ? (
            <div className="flex items-center gap-2">
              <span className="ml-0 sm:ml-2 flex items-center gap-2 bg-indigo-50/80 dark:bg-dark-card px-3 py-1 rounded-full text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm border border-indigo-200 dark:border-dark-border">
                <span className="inline-block w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-400 to-pink-400 dark:from-indigo-700 dark:to-pink-700 flex items-center justify-center text-white font-bold">
                  {user.user_metadata.full_name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.user_metadata.full_name}</span>
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-lg bg-red-50/80 dark:bg-dark-card text-red-500 dark:text-red-300 font-semibold hover:bg-red-100/90 dark:hover:bg-dark-glass transition-colors duration-200 shadow-sm border border-red-200 dark:border-dark-border"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded-lg hover:bg-pink-100/60 dark:hover:bg-dark-glass transition-colors duration-200">Login</Link>
              <Link to="/signup" className="px-3 py-2 rounded-lg hover:bg-yellow-100/60 dark:hover:bg-dark-glass transition-colors duration-200">Signup</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
