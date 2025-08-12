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

    // Check for empty fields
    for (const [key, value] of Object.entries(form)) {
      if (typeof value === 'string' && value.trim() === '') {
        setError('All fields are required.');
        setLoading(false);
        return;
      }
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setNotification({ type: 'error', message: 'You must be logged in to save an itinerary.' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('itineraries')
        .insert([
          {
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
          },
        ])
        .select()
        .single(); // ✅ Prevents data[0] errors

      if (error) {
        console.error('❌ Supabase Error:', error);
        setNotification({ type: 'error', message: 'Failed to save itinerary.' });
      } else {
        console.log('✅ Supabase Success:', data);
        localStorage.setItem('currentItinerary', JSON.stringify(data)); // ✅ Store entire itinerary
        setNotification({ type: 'success', message: 'Itinerary saved to cloud!' });
        setTimeout(() => {
          navigate('/result');
        }, 1200);
      }
    } catch (err) {
      console.error('Unexpected Error:', err);
      setNotification({ type: 'error', message: 'Unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-2 sm:px-0">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />
      <h2 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-tr from-indigo-600 via-fuchsia-500 to-pink-400 bg-clip-text text-transparent drop-shadow">Plan Your Outing</h2>
      <form onSubmit={handleSubmit} className="glass-card p-4 sm:p-8 rounded-2xl shadow-xl border border-indigo-100 backdrop-blur-md bg-white/70 grid gap-5 sm:gap-6">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {/* Trip Title */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none pointer-events-none">🏷️</span>
          <input name="title" id="title" onChange={handleChange} className="peer w-full pl-9 pr-3 pt-6 pb-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200" placeholder=" " />
          <label htmlFor="title" className="absolute left-9 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm pointer-events-none">Trip Title</label>
        </div>
        {/* Trip Type & Participants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none pointer-events-none">🧭</span>
            <select name="type" id="type" onChange={handleChange} className="peer w-full pl-9 pr-3 pt-6 pb-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200">
              <option value="">Select Type</option>
              <option>Family Outing</option>
              <option>Date</option>
              <option>Activities Near You</option>
              <option>Friends Outing</option>
            </select>
            <label htmlFor="type" className="absolute left-9 top-2 text-gray-500 text-sm transition-all peer-focus:text-sm">Trip Type</label>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none pointer-events-none">👥</span>
            <input name="participants" id="participants" type="number" onChange={handleChange} className="peer w-full pl-9 pr-3 pt-6 pb-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200" placeholder=" " />
            <label htmlFor="participants" className="absolute left-9 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm pointer-events-none">Participants</label>
          </div>
        </div>
        {/* Budget & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none pointer-events-none">💰</span>
            <input name="budget" id="budget" type="number" onChange={handleChange} className="peer w-full pl-9 pr-3 pt-6 pb-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200" placeholder=" " />
            <label htmlFor="budget" className="absolute left-9 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm pointer-events-none">Budget (₹)</label>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none pointer-events-none">📍</span>
            <input name="location" id="location" onChange={handleChange} className="peer w-full pl-9 pr-3 pt-6 pb-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200" placeholder=" " />
            <label htmlFor="location" className="absolute left-9 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm pointer-events-none">Location / City</label>
          </div>
        </div>
    {/* Date Range */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none pointer-events-none">📅</span>
        <input name="startDate" id="startDate" type="date" onChange={handleChange} className="peer w-full pl-9 pr-3 pt-6 pb-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200" placeholder=" " />
        <label htmlFor="startDate" className="absolute left-9 top-2 text-gray-500 text-sm transition-all peer-focus:text-sm">Start Date</label>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none pointer-events-none">📅</span>
        <input name="endDate" id="endDate" type="date" onChange={handleChange} className="peer w-full pl-9 pr-3 pt-6 pb-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200" placeholder=" " />
        <label htmlFor="endDate" className="absolute left-9 top-2 text-gray-500 text-sm transition-all peer-focus:text-sm">End Date</label>
      </div>
    </div>
    {/* Time Range */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none pointer-events-none">⏰</span>
        <input name="startTime" id="startTime" type="time" onChange={handleChange} className="peer w-full pl-9 pr-3 pt-6 pb-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200" placeholder=" " />
        <label htmlFor="startTime" className="absolute left-9 top-2 text-gray-500 text-sm transition-all peer-focus:text-sm">Start Time</label>
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none pointer-events-none">⏰</span>
        <input name="endTime" id="endTime" type="time" onChange={handleChange} className="peer w-full pl-9 pr-3 pt-6 pb-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200" placeholder=" " />
        <label htmlFor="endTime" className="absolute left-9 top-2 text-gray-500 text-sm transition-all peer-focus:text-sm">End Time</label>
      </div>
    </div>
    {/* Distance Range */}
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none pointer-events-none">📏</span>
      <select name="range" id="range" onChange={handleChange} className="peer w-full pl-9 pr-3 pt-6 pb-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200">
        <option value="">Select Range</option>
        <option>5 KM</option>
        <option>10 KM</option>
        <option>15 KM</option>
        <option>20+ KM</option>
      </select>
      <label htmlFor="range" className="absolute left-9 top-2 text-gray-500 text-sm transition-all peer-focus:text-sm">Distance Range</label>
    </div>
    {/* Submit Button */}
    <Button
      className="w-full py-3 rounded-xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-pink-400 text-white font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
      disabled={loading}
      type="submit"
    >
      {loading && (
        <span className="w-6 h-6 border-2 border-white border-t-indigo-400 rounded-full animate-spin inline-block"></span>
      )}
      {loading ? 'Saving...' : 'Generate Itinerary'}
    </Button>
  </form>
</section>
  );
};

export default Planner;
