import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './store/useAuth';
import HeroNew from './HeroNew';
import Layout from './Layout';
import Navbar from './Navbar';
import CustomCursor from './CustomCursor';
import LuxuryMesh from './LuxuryMesh';

const App = () => {
  const navigate = useNavigate();
  const { user, init } = useAuth();
  const location = useLocation();

  useEffect(() => {
    init();
  }, [init]);

  const handleLogout = async () => {
    try {
      const { supabase } = await import('./supabase');
      await supabase.auth.signOut();
      navigate('/login');
    } catch (_) { }
  };

  return (
    <Layout>
      <div className="noise-bg" />
      <LuxuryMesh />
      <CustomCursor />
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(20px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {location.pathname === "/" ? <HeroNew /> : <div className="max-w-[1600px] mx-auto min-h-screen px-6 py-12"><Outlet /></div>}
          </motion.div>
        </AnimatePresence>
      </main>
    </Layout>
  );
};

export default App;
