import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Magnetic from './Magnetic';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'INDEX', path: '/' },
    { name: 'DISCOVER', path: '/discover' },
    { name: 'PLANNER', path: '/planner' },
    { name: 'SAVED', path: '/saved' },
    { name: 'PROFILE', path: '/profile' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'backdrop-blur-xl bg-[var(--glass-bg)] border-b border-[var(--border-color)] py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 flex items-center justify-between">

          {/* Luxury Brand */}
          <Magnetic>
            <Link to="/" className="group flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#FF6B35]/30 flex items-center justify-center p-0.5 group-hover:border-[#FF6B35] transition-all duration-500">
                <div className="w-full h-full rounded-full bg-[#FF6B35]/10 flex items-center justify-center font-black italic text-[#FF6B35] text-[10px]">TR</div>
              </div>
              <span className="text-lg font-black tracking-[0.1em] text-[var(--text-primary)] uppercase italic">Travelly<span className="text-[#FF6B35]">.</span></span>
            </Link>
          </Magnetic>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Magnetic key={link.name}>
                <Link
                  to={link.path}
                  className="relative px-1 py-1 group"
                >
                  <span className={`text-sm font-black tracking-[0.2em] transition-all duration-500 ${location.pathname === link.path ? 'text-[#FF6B35]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                    {link.name}
                  </span>
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-[#FF6B35] rounded-full shadow-[0_0_5px_rgba(255,107,53,1)]"
                    />
                  )}
                </Link>
              </Magnetic>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Theme Toggle */}
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-2 group cursor-none">
              <span className="text-[8px] font-black text-[var(--text-secondary)] group-hover:text-[#FF6B35] transition-all tracking-widest">EN</span>
              <div className="w-1 h-1 rounded-full bg-[#FF6B35]/20 group-hover:bg-[#FF6B35] transition-all" />
            </div>

            {user ? (
              <div className="flex items-center gap-4 md:gap-5">
                <Magnetic>
                  <Link to="/profile" className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-[#FF6B35]/20 p-0.5 hover:border-[#FF6B35]/40 transition-all">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#FF6B35]/10 flex items-center justify-center">
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="User" />
                      ) : (
                        <span className="text-[#FF6B35] font-black italic text-xs">{(user.email || 'U').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </Link>
                </Magnetic>
                <button onClick={onLogout} className="hidden md:block text-[8px] font-black text-[var(--text-secondary)] hover:text-red-500 uppercase tracking-widest transition-all italic">Logout</button>
              </div>
            ) : (
              <Magnetic>
                <Link to="/login" className="px-6 py-2.5 bg-gradient-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-[#FF6B35]/10 active:scale-95 transition-all">
                  Login
                </Link>
              </Magnetic>
            )}

            {/* Mobile Toggle */}
            <button className="lg:hidden w-6 h-6 flex flex-col justify-center gap-1 group" onClick={() => setMobileMenuOpen(true)}>
              <div className="w-full h-0.5 bg-[var(--text-primary)]/60 group-hover:bg-[#FF6B35] transition-all" />
              <div className="w-full h-0.5 bg-[var(--text-primary)]/60 group-hover:bg-[#FF6B35] transition-all" />
            </button>
          </div>
        </div>

        {/* Cinematic Scroll Progress Line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#FF6B35]/20 origin-left z-10"
          style={{ scaleX }}
        >
          <div className="w-full h-full bg-[#FF6B35] shadow-[0_0_8px_rgba(255,107,53,0.5)]" />
        </motion.div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[200] flex flex-col items-center justify-center gap-10"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-8 right-8 text-white/40 text-4xl hover:text-primary transition-all"
            >
              &times;
            </button>
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl md:text-6xl font-black text-white hover:text-primary italic uppercase tracking-tighter"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
