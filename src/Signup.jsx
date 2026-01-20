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
      setErrorMsg('Bhai, saare fields toh bhar na re!');
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
      alert('Signup ho gaya bhai! Ab login karlo.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-20 relative overflow-hidden bg-slate-950">
      {/* Premium Background Blobs */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-glass w-full max-w-2xl p-10 md:p-16 rounded-2xl relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-block group mb-8">
            <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary/20 group-hover:border-primary group-hover:rotate-12 transition-all duration-500 p-1">
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-2xl font-black italic">TR</span>
              </div>
            </div>
          </Link>
          <h2 className="text-5xl font-black tracking-tighter mb-4 italic text-white">Shuru Karo Apni <span className="text-primary">Journey</span></h2>
          <p className="text-white/40 font-medium tracking-tight">AI travel planner ke saath duniya ghoomne ke liye signup karo!</p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-4"
          >
            <span className="text-xl">⚠️</span> {errorMsg}
          </motion.div>
        )}

        <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Poora Naam</label>
            <input
              type="text"
              placeholder="Rahul Kumar"
              className="premium-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Mobile Number</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              className="premium-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3 col-span-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Email ID</label>
            <input
              type="email"
              placeholder="tumhara@email.com"
              className="premium-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3 col-span-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Password</label>
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
            className="w-full col-span-2 px-12 py-5 bg-primary text-white text-sm font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signup kar raha hai...</span>
              </div>
            ) : (
              'Account Banayo 🔱'
            )}
          </button>
        </form>

        <p className="mt-12 text-center text-white/40 font-bold text-sm tracking-tight">
          Pehle se account hai?{' '}
          <Link to="/login" className="text-primary hover:text-orange-600 transition-colors">Login Karo</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
