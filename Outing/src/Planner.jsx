import React, { useState } from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import Notification from './Notification';

const Planner = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    type: '',
    budget: '',
    participants: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    range: ''
  });
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });
    setError('');
    setLoading(true);

    for (const [key, value] of Object.entries(form)) {
      if (typeof value === 'string' && value.trim() === '') {
        setError('All fields are required.');
        setLoading(false);
        return;
      }
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setNotification({ type: 'error', message: 'Please login to save your plan.' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('itineraries')
        .insert([{
          title: form.title.trim(),
          type: form.type.trim(),
          budget: parseInt(form.budget),
          participants: parseInt(form.participants),
          startDate: form.startDate,
          endDate: form.endDate,
          startTime: form.startTime,
          endTime: form.endTime,
          location: form.location.trim(),
          range: form.range.trim(),
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        setNotification({ type: 'error', message: 'Database error. Please try again.' });
      } else {
        localStorage.setItem('currentItinerary', JSON.stringify(data));
        setNotification({ type: 'success', message: 'Itinerary generated! Redirecting...' });
        setTimeout(() => navigate('/result'), 1500);
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />

      <div className="text-center mb-16">
        <motion.h2
          className="text-4xl md:text-6xl font-black mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Plan Your <span className="navbar-logo-gradient">Masterpiece</span>
        </motion.h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Every great journey starts with a single high-quality plan.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 space-y-10">
        {error && <p className="text-red-500 font-bold bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

        {/* Section 1: Core Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold">1</span>
            <h3 className="text-2xl font-bold">The Basics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Trip Title</label>
              <input name="title" onChange={handleChange} className="premium-input" placeholder="e.g. Weekend in Bali" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Location</label>
              <input name="location" onChange={handleChange} className="premium-input" placeholder="City or Destination" />
            </div>
          </div>
        </div>

        {/* Section 2: Group & Money */}
        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-lg bg-pink-600/10 text-pink-600 flex items-center justify-center font-bold">2</span>
            <h3 className="text-2xl font-bold">Group & Budget</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Participants</label>
              <input name="participants" type="number" onChange={handleChange} className="premium-input" placeholder="People count" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Total Budget (₹)</label>
              <input name="budget" type="number" onChange={handleChange} className="premium-input" placeholder="₹ Amount" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Trip Type</label>
              <select name="type" onChange={handleChange} className="premium-input">
                <option value="">Select Category</option>
                <option>Adventure</option>
                <option>Relaxation</option>
                <option>Food & Culture</option>
                <option>Family Fun</option>
                <option>Romantic Getaway</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Time & Space */}
        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-lg bg-amber-600/10 text-amber-600 flex items-center justify-center font-bold">3</span>
            <h3 className="text-2xl font-bold">Timing</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Start Date</label>
              <input name="startDate" type="date" onChange={handleChange} className="premium-input" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">End Date</label>
              <input name="endDate" type="date" onChange={handleChange} className="premium-input" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Window Starts</label>
              <input name="startTime" type="time" onChange={handleChange} className="premium-input" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Window Ends</label>
              <input name="endTime" type="time" onChange={handleChange} className="premium-input" />
            </div>
          </div>

          <div className="space-y-2 !mt-10">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Activity Radius</label>
            <select name="range" onChange={handleChange} className="premium-input bg-indigo-50/50">
              <option value="">Choose how far you'll go</option>
              <option>Walkable (under 5 KM)</option>
              <option>Quick Ride (10 KM)</option>
              <option>Day Explorer (25 KM)</option>
              <option>Road Trip (50+ KM)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-fuchsia-500 to-pink-500 text-white font-black text-2xl shadow-2xl shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Generate Master Plan
              <span className="text-3xl">✨</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default Planner;
