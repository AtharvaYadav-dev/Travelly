import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap ${active
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
    <header className="sticky top-0 z-50 w-full glass-ui border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
            <span className="text-white text-2xl font-black">T</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            <span className="navbar-logo-gradient animate-gradient-text">Travelly</span>
          </h1>
        </Link>

        {/* Links - Hidden on very small screens, scrollable on others */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/planner">Planner</NavLink>
          <NavLink to="/saved">Library</NavLink>
          <NavLink to="/contact">Support</NavLink>
        </nav>

        {/* Auth / User */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold overflow-hidden">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="A" className="w-full h-full object-cover" />
                  ) : (
                    (user.user_metadata?.full_name || user.email || '?').charAt(0).toUpperCase()
                  )}
                </div>
                <span className="hidden sm:inline font-bold text-sm">
                  {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              </Link>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                title="Logout"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 font-bold text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
              <Link to="/signup" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
