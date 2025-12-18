import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './store/useAuth';
import Hero from './Hero';
import Tooltip from './Tooltip';
import Layout from './Layout';
import Navbar from './Navbar';
import AnimatedCursor from './AnimatedCursor';

const App = () => {
  const navigate = useNavigate();
  const { user, init } = useAuth();

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
      <AnimatedCursor />
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-1 w-full relative">
        {(() => {
          const location = useLocation();
          if (location.pathname === "/") {
            return <Hero />;
          }
          return <div className="max-w-7xl mx-auto px-4"><Outlet /></div>;
        })()}
      </main>
    </Layout>
  );
};

export default App;
