import React, { useState } from 'react';
import { supabase } from './supabase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!fullName || !phone || !email || !password) {
      setErrorMsg('All sectors must be populated.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      alert('Registration Protocol Complete. Proceed to login.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[95vh] flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-slate-50 dark:bg-slate-900" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-2xl p-10 md:p-16 border-white/50 backdrop-blur-3xl shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)]"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-block group mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:rotate-[-12deg] transition-transform">
              <span className="text-white text-3xl font-black italic">T</span>
            </div>
          </Link>
          <h2 className="text-5xl font-black tracking-tighter mb-4 italic">Begin Your <span className="navbar-logo-gradient animate-gradient-text">Odyssey</span></h2>
          <p className="text-slate-500 font-medium tracking-tight">Register your credentials to access world-class AI travel architecture.</p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 p-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-black flex items-center gap-4"
          >
            <span className="text-xl">⚠️</span> {errorMsg}
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Identity</label>
            <input
              type="text"
              placeholder="Commander Doe"
              className="premium-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Comm Link (Phone)</label>
            <input
              type="text"
              placeholder="+91 00000 00000"
              className="premium-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3 col-span-2">
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

          <div className="space-y-3 col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Security Key</label>
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
            className="btn-premium btn-premium-primary w-full col-span-2 py-5 text-xl mt-4"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              'Initialize Deployment 🔱'
            )}
          </button>
        </form>

        <p className="mt-12 text-center text-slate-500 font-bold text-sm tracking-tight">
          Already archived?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
