import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Session error:', error);
        return;
      }

      if (session?.user) {
        setUser(session.user); // ✅ Latest user_metadata included
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert('Logged out');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Travelly</h1>
          
          <nav className="flex gap-4 items-center">
            <Link to="/">Home</Link>
            <Link to="/planner">Planner</Link>
            <Link to="/saved">Saved</Link>

            {/* ✅ Show full name from user_metadata if available */}
            {user?.user_metadata?.full_name && (
              <span className="text-sm text-green-200">
                Welcome, {user.user_metadata.full_name} 👋
              </span>
            )}

            {!user && (
              <>
              
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="text-sm text-red-300 hover:text-white"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="p-4 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
