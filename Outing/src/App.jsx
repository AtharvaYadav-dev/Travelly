import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './store/useAuth';
import Hero from './Hero';
import Tooltip from './Tooltip';
import Layout from './Layout';
import Navbar from './Navbar';

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
      alert('Logged out');
      navigate('/login');
    } catch (_) {}
  };

  return (
    <Layout>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:py-10 md:py-14">
        {(() => {
          const location = useLocation();
          if (location.pathname === "/") {
            return <Hero />;
          }
          return <Outlet />;
        })()}
      </main>
    </Layout>
  );
};

export default App;
