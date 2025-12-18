import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400'
        : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
        }`}
    >
      {children}
    </Link>
  );
};

const Navbar = ({ user, onLogout }) => {
  return (
    <header className="sticky top-0 z-[100] w-full glass-ui border-b border-indigo-500/5 transition-all duration-300 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl group-hover:rotate-[-8deg] transition-transform">
            <span className="text-white text-2xl font-black italic">T</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter hidden sm:block">
            <span className="navbar-logo-gradient animate-gradient-text">Travelly</span>
          </h1>
        </Link>

        {/* Links */}
        <nav className="hidden lg:flex items-center gap-3">
          <NavLink to="/">HQ</NavLink>
          <NavLink to="/planner">Architecture</NavLink>
          <NavLink to="/saved">Archives</NavLink>
        </nav>

        {/* Auth / User */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="flex items-center gap-3 pl-1 pr-6 py-1 rounded-full bg-slate-100/50 border border-slate-200/50 hover:border-indigo-500 hover:bg-white transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white font-black overflow-hidden shadow-lg">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="A" className="w-full h-full object-cover" />
                  ) : (
                    (user.user_metadata?.full_name || user.email || '?').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Status: Active</span>
                  <span className="font-black text-xs text-slate-900 leading-none">
                    {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                </div>
              </Link>
              <button
                onClick={onLogout}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                title="Decommission Session"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors">Enter Archive</Link>
              <Link to="/signup" className="btn-premium px-8 py-3 bg-slate-900 text-white text-[10px] uppercase font-black tracking-[0.2em] shadow-none">
                Get Access
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
