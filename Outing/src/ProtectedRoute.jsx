 import React, { useEffect, useState } from 'react';
 import { Navigate } from 'react-router-dom';
 import { supabase, isSupabaseConfigured } from './supabase';

 const ProtectedRoute = ({ children }) => {
   const [checking, setChecking] = useState(true);
   const [authed, setAuthed] = useState(false);

   useEffect(() => {
     let mounted = true;
     supabase.auth.getSession().then(({ data }) => {
       if (!mounted) return;
       setAuthed(Boolean(data?.session?.user));
       setChecking(false);
     });
     const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
       setAuthed(Boolean(session?.user));
     });
     return () => {
       sub?.subscription?.unsubscribe?.();
       mounted = false;
     };
   }, []);

   // In development, allow access if Supabase isn't configured
   if (!isSupabaseConfigured) return children;
   if (checking) return null; // or a small loader
   return authed ? children : <Navigate to="/login" replace />;
 };

 export default ProtectedRoute;
