import { create } from 'zustand';
import { supabase } from '../supabase';

export const useAuth = create((set) => ({
  user: null,
  loading: true,
  init: async () => {
    const { data } = await supabase.auth.getSession();
    set({ user: data?.session?.user || null, loading: false });
    supabase.auth.onAuthStateChange((_e, session) => set({ user: session?.user || null }));
  },
}));
