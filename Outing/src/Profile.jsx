import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './store/useAuth';
import Notification from './Notification';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        avatarUrl: user.user_metadata?.avatar_url || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification({ type: '', message: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: form.fullName,
          phone: form.phone,
          avatar_url: form.avatarUrl
        }
      });

      if (error) throw error;
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-10 rounded-3xl shadow-2xl border border-indigo-100 bg-white/80 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-1 shadow-lg">
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 border-2 border-white">
                  {(form.fullName || user?.email || '?').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
            Your Profile
          </h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Avatar URL</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🖼️</span>
              <input
                type="text"
                name="avatarUrl"
                value={form.avatarUrl}
                onChange={handleChange}
                placeholder="Link to your profile picture"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-500 text-white font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Profile Details'}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Profile;
