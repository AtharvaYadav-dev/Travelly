import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });

    // Simple validation check
    const required = ['title', 'location', 'budget', 'participants', 'type', 'startDate', 'endDate'];
    for (let field of required) {
      if (!form[field]) {
        setNotification({ type: 'error', message: `Please fill out the ${field} field.` });
        return;
      }
    }

    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setNotification({ type: 'error', message: 'Authentication required. Please login.' });
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
          startTime: form.startTime || '09:00',
          endTime: form.endTime || '21:00',
          location: form.location.trim(),
          range: form.range || 'Day Explorer (25 KM)',
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        setNotification({ type: 'error', message: `Database error: ${error.message}` });
      } else {
        localStorage.setItem('currentItinerary', JSON.stringify(data));
        setNotification({ type: 'success', message: 'Architecting your masterpiece...' });
        setTimeout(() => navigate('/result'), 2000);
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to generate. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* --- LEFT: FORM --- */}
        <div className="flex-1 w-full order-2 lg:order-1">
          <div className="mb-12">
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl md:text-7xl font-black mb-4 tracking-tighter"
            >
              The <span className="navbar-logo-gradient animate-gradient-text">Architect's</span> Studio
            </motion.h2>
            <p className="text-slate-500 text-lg font-medium">Design your next adventure with surgical precision.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-16">
            {/* Step 1 */}
            <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20">01</div>
                <h3 className="text-3xl font-black tracking-tight">Vibe & Location</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Archive Title</label>
                  <input name="title" onChange={handleChange} className="premium-input" placeholder="e.g. Operation: Santorini" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Drop Zone (Location)</label>
                  <input name="location" onChange={handleChange} className="premium-input" placeholder="Which city?" />
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-fuchsia-500/20">02</div>
                <h3 className="text-3xl font-black tracking-tight">Crew & Resources</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Total Unit (People)</label>
                  <input name="participants" type="number" onChange={handleChange} className="premium-input" placeholder="How many?" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Mission Budget (₹)</label>
                  <input name="budget" type="number" onChange={handleChange} className="premium-input" placeholder="Max budget" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Style</label>
                  <select name="type" onChange={handleChange} className="premium-input">
                    <option value="">Select Category</option>
                    <option>Adventure</option>
                    <option>Relaxation</option>
                    <option>Food & Culture</option>
                    <option>Family Fun</option>
                    <option>Strategic Luxury</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">03</div>
                <h3 className="text-3xl font-black tracking-tight">Timeline Logistics</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-3 col-span-2 sm:col-span-1">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Launch Date</label>
                  <input name="startDate" type="date" onChange={handleChange} className="premium-input" />
                </div>
                <div className="space-y-3 col-span-2 sm:col-span-1">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Return Date</label>
                  <input name="endDate" type="date" onChange={handleChange} className="premium-input" />
                </div>
                <div className="space-y-3 col-span-1">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Daily Start</label>
                  <input name="startTime" type="time" onChange={handleChange} className="premium-input" placeholder="09:00" />
                </div>
                <div className="space-y-3 col-span-1">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-500 ml-1">Daily End</label>
                  <input name="endTime" type="time" onChange={handleChange} className="premium-input" placeholder="21:00" />
                </div>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-6 rounded-3xl bg-slate-950 text-white font-black text-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-slate-900 transition-all flex items-center justify-center gap-6 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 border-8 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  Commence AI Generation
                  <span className="text-4xl">🔱</span>
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* --- RIGHT: LIVE PREVIEW --- */}
        <aside className="lg:sticky lg:top-32 w-full lg:w-96 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-1 bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-2xl overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[1.9rem] p-8 h-full">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">LIVE PREVIEW</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Trip Identity</h4>
                  <h3 className="text-3xl font-black truncate">{form.title || 'Untitled Archive'}</h3>
                  <p className="text-indigo-600 font-bold">{form.location || 'Orbiting Somewhere...'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[8px] font-black text-slate-400 block mb-1">BUDGET</span>
                    <span className="text-xl font-black">₹{form.budget || '0'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[8px] font-black text-slate-400 block mb-1">CREW</span>
                    <span className="text-xl font-black">{form.participants || '0'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500">CATEGORY</span>
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-tighter">
                      {form.type || 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500">TIMELINE</span>
                    <span className="text-[10px] font-black text-slate-800 dark:text-slate-200">
                      {form.startDate ? `${form.startDate} ➔ ${form.endDate}` : 'Pending Selection'}
                    </span>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-500 font-medium italic">
                    Our high-fidelity Gen-AI will architect a specific timeline once you commit this data.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 flex items-center gap-4 px-4 opacity-50">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xl">🛡️</div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
              Encrypted Mission Data. Your privacy is our prime directive.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Planner;
