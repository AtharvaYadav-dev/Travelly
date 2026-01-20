import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { useAuth } from './store/useAuth';
import Notification from './Notification';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    avatarUrl: '',
    persona: 'Desi Explorer',
    budgetFocus: 'Standard',
    preferences: []
  });

  const personas = ['Desi Explorer', 'Mountain Bhai', 'Scenic Lover', 'Luxury Traveler', 'Cultural Fan'];
  const prefOptions = ['Trekking', 'Beach', 'Railway', 'Elite Stays', 'Photography', 'Nightlife', 'Foodie', 'Adventure'];

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        avatarUrl: user.user_metadata?.avatar_url || '',
        persona: user.user_metadata?.persona || 'Desi Explorer',
        budgetFocus: user.user_metadata?.budget_focus || 'Standard',
        preferences: user.user_metadata?.preferences || []
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePreference = (pref) => {
    setForm(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setNotification({ type: 'error', message: 'File too large. Max 5MB allowed.' });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      setForm(prev => ({ ...prev, avatarUrl: publicUrl }));

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setNotification({ type: 'success', message: 'Profile picture updated.' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Upload failed.' });
    } finally {
      setUploading(false);
    }
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
          avatar_url: form.avatarUrl,
          persona: form.persona,
          budget_focus: form.budgetFocus,
          preferences: form.preferences
        }
      });

      if (error) throw error;
      setNotification({ type: 'success', message: 'Profile updated.' });
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Update failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />

      {/* Header Space */}
      <div className="h-40" />

      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Identity Column */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-glass p-12 text-center rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />

              <div className="relative z-10">
                <div onClick={handleAvatarClick} className="relative w-24 h-24 mx-auto mb-10 cursor-pointer group">
                  <div className={`w-full h-full rounded-full border-4 border-primary/20 p-1.5 overflow-hidden transition-all group-hover:border-primary ${uploading ? 'animate-pulse' : ''}`}>
                    {form.avatarUrl ? (
                      <img src={form.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl font-black italic text-primary">
                        {(form.fullName || user?.email || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white">Edit</div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>

                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">{form.fullName || 'Traveler'}</h2>
                <p className="text-primary font-bold uppercase tracking-widest text-xs mb-12 opacity-80">{user?.email}</p>

                <div className="flex justify-center gap-12 border-t border-white/5 pt-10">
                  <div className="text-center">
                    <span className="block text-2xl font-black italic">07</span>
                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Tours</span>
                  </div>
                  <div className="w-px h-10 bg-white/5" />
                  <div className="text-center">
                    <span className="block text-2xl font-black italic">14</span>
                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Saves</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="premium-glass p-12 rounded-2xl"
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-white/30 mb-8">Adventure Badges</h3>
              <div className="grid grid-cols-4 gap-4">
                {['🏔️', '🚂', '�', '⌚', '❄️', '�', '�', '�'].map((b, i) => (
                  <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xl bg-slate-900 border border-white/5 ${i > 4 ? 'opacity-10 grayscale' : ''}`}>
                    {b}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Configuration Column */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="premium-glass p-12 md:p-16 rounded-2xl"
            >
              <div className="flex items-center gap-4 mb-16">
                <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(255,122,45,0.5)]" />
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Your Profile</h3>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Full Name</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} className="premium-input" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="premium-input" />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Travel Persona</label>
                  <div className="flex flex-wrap gap-3">
                    {personas.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setForm({ ...form, persona: p })}
                        className={`px-6 py-3 rounded text-xs font-black uppercase tracking-widest transition-all ${form.persona === p ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-900/50 text-white/40 border border-white/5 hover:border-primary/30'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Travel Interests</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {prefOptions.map(o => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => togglePreference(o)}
                        className={`flex items-center gap-4 px-6 py-4 rounded border transition-all ${form.preferences.includes(o) ? 'border-primary bg-primary/10 text-white' : 'border-white/5 bg-slate-900/50 text-white/30 hover:border-primary/30'}`}
                      >
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${form.preferences.includes(o) ? 'bg-primary border-primary' : 'border-white/20'}`}>
                          {form.preferences.includes(o) && <span className="text-xs text-white">✓</span>}
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em]">{o}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-12 py-4 bg-primary text-white text-sm font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
