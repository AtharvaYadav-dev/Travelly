import React, { useState } from 'react';
import { supabase } from './supabase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      navigate('/planner');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-slate-50 dark:bg-slate-900" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-lg p-10 md:p-16 border-white/50 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-block group mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/30 group-hover:rotate-12 transition-transform">
              <span className="text-white text-3xl font-black italic">T</span>
            </div>
          </Link>
          <h2 className="text-4xl font-black tracking-tighter mb-4 italic">Welcome <span className="navbar-logo-gradient animate-gradient-text">Adventurer</span></h2>
          <p className="text-slate-500 font-medium">Continue your path to the unexplored.</p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-black flex items-center gap-4"
          >
            <span className="text-xl">⚠️</span> {errorMsg}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Archive ID (Email)</label>
            <input
              type="email"
              placeholder="you@masterpiece.com"
              className="premium-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</label>
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors">Recover?</a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="premium-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium btn-premium-primary w-full text-xl py-5"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Syncing...</span>
              </div>
            ) : (
              'Enter Archive 🚀'
            )}
          </button>
        </form>

        <p className="mt-12 text-center text-slate-500 font-bold text-sm tracking-tight">
          First deployment?{' '}
          <Link to="/signup" className="text-indigo-600 hover:underline">Register Dossier</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
