import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabase';
import Notification from './Notification';
import Magnetic from './Magnetic';

const PremiumInput = ({ label, name, type = "text", placeholder, onChange, value, options }) => {
  return (
    <div className="space-y-2 md:space-y-3 group">
      <label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/70 group-focus-within:text-primary transition-colors ml-1">
        {label}
      </label>
      <div className="relative overflow-hidden rounded-lg md:rounded-xl">
        {options ? (
          <select
            name={name}
            onChange={onChange}
            className="w-full bg-slate-900/80 border border-white/20 px-4 md:px-8 py-3 md:py-5 text-sm md:text-base text-white focus:outline-none focus:border-primary/50 transition-all font-medium italic appearance-none"
          >
            {options.map(o => <option key={o} value={o} className="bg-slate-900 text-white">{o}</option>)}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full bg-slate-900/80 border border-white/20 px-4 md:px-8 py-3 md:py-5 text-sm md:text-base text-white placeholder:text-white/60 focus:outline-none focus:border-primary/50 transition-all font-medium italic"
          />
        )}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-primary origin-left"
        />
      </div>
    </div>
  );
};

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
        setNotification({ type: 'error', message: 'Session required. Please sign in.' });
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
          range: form.range || 'Swiss Explorer',
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        setNotification({ type: 'error', message: `Database error: ${error.message}` });
      } else {
        localStorage.setItem('currentItinerary', JSON.stringify(data));
        setNotification({ type: 'success', message: 'Creating your itinerary...' });
        setTimeout(() => navigate('/result'), 2000);
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Connection failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-48">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: '', message: '' })}
      />

      {/* Header Space */}
      <div className="h-24 md:h-32 lg:h-48" />

      <div className="max-w-[1700px] mx-auto px-4 md:px-6 lg:px-10">
        <div className="flex flex-col xl:flex-row gap-12 md:gap-20 lg:gap-32 items-start">

          {/* --- LEFT: ARCHITECT STUDIO --- */}
          <div className="flex-1 w-full order-2 xl:order-1">
            <div className="mb-12 md:mb-16 lg:mb-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 md:gap-6 mb-6 md:mb-10"
              >
                <div className="w-1.5 md:w-2 h-12 md:h-16 bg-primary rounded-full shadow-primary-glow" />
                <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter italic text-white leading-none">
                  Plan Your <br /> <span className="primary-gradient-text">Trip</span>
                </h2>
              </motion.div>
              <p className="text-white/30 text-base md:text-lg lg:text-2xl font-medium max-w-3xl italic leading-relaxed">
                Plan your next trip to Switzerland. Tell us your preferences and we'll create a personalized itinerary for you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 md:space-y-16 lg:space-y-24">
              {/* PHASE 01 */}
              <div className="space-y-6 md:space-y-12">
                <div className="flex items-center gap-3 md:gap-6">
                  <span className="text-[8px] md:text-[10px] font-black text-primary border border-primary/30 px-3 md:px-4 py-1 rounded-full">STEP 1</span>
                  <h3 className="text-lg md:text-2xl font-black uppercase italic tracking-widest text-white">Trip Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <PremiumInput label="Trip Name" name="title" placeholder="e.g. Swiss Alps Adventure" onChange={handleChange} />
                  <PremiumInput label="Location" name="location" placeholder="Which city or region?" onChange={handleChange} />
                </div>
              </div>

              {/* PHASE 02 */}
              <div className="space-y-6 md:space-y-12">
                <div className="flex items-center gap-3 md:gap-6">
                  <span className="text-[8px] md:text-[10px] font-black text-primary border border-primary/30 px-3 md:px-4 py-1 rounded-full">STEP 2</span>
                  <h3 className="text-lg md:text-2xl font-black uppercase italic tracking-widest text-white">Budget & Type</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                  <PremiumInput label="Number of Travelers" name="participants" type="number" placeholder="How many?" onChange={handleChange} />
                  <PremiumInput label="Budget" name="budget" type="number" placeholder="USD ($)" onChange={handleChange} />
                  <PremiumInput
                    label="Trip Type"
                    name="type"
                    onChange={handleChange}
                    options={['Select Type', 'Hiking Adventure', 'Skiing Retreat', 'Historic Discovery', 'Luxury Travel', 'Scenic Rail']}
                  />
                </div>
              </div>

              {/* PHASE 03 */}
              <div className="space-y-6 md:space-y-12">
                <div className="flex items-center gap-3 md:gap-6">
                  <span className="text-[8px] md:text-[10px] font-black text-primary border border-primary/30 px-3 md:px-4 py-1 rounded-full">STEP 3</span>
                  <h3 className="text-lg md:text-2xl font-black uppercase italic tracking-widest text-white">Travel Dates</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                  <PremiumInput label="Start Date" name="startDate" type="date" onChange={handleChange} />
                  <PremiumInput label="End Date" name="endDate" type="date" onChange={handleChange} />
                  <PremiumInput label="Daily Start" name="startTime" type="time" onChange={handleChange} />
                  <PremiumInput label="Daily End" name="endTime" type="time" onChange={handleChange} />
                </div>
              </div>

              <div className="pt-6 md:pt-12">
                <Magnetic>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-expensive bg-primary hover:bg-orange-600 border-none text-white text-sm md:text-base py-5 md:py-8 shadow-primary-glow"
                  >
                    {loading ? "Creating Itinerary..." : "Create My Trip"}
                  </button>
                </Magnetic>
              </div>
            </form>
          </div>

          {/* --- RIGHT: LIVE BLUEPRINT --- */}
          <aside className="xl:sticky xl:top-32 lg:top-48 w-full xl:w-[500px] order-1 xl:order-2">
            <motion.div
              layoutId="blueprint-card"
              className="premium-glass p-6 md:p-10 lg:p-16 rounded-2xl md:rounded-3xl lg:rounded-[3rem] space-y-8 md:space-y-12 lg:space-y-16 border-primary/5 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-6 md:pb-10 border-b border-white/5">
                <div className="space-y-1">
                  <span className="text-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Trip Preview</span>
                  <h4 className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-widest">Status: Updating in real-time</h4>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 md:w-10 md:h-10 border-2 border-dashed border-primary/40 rounded-full flex items-center justify-center italic font-black text-primary text-[9px] md:text-[10px]"
                >
                  T
                </motion.div>
              </div>

              <div className="space-y-8 md:space-y-12">
                <div className="relative group overflow-hidden rounded-xl md:rounded-2xl h-40 md:h-48 bg-slate-900 border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800"
                    className="w-full h-full object-cover opacity-20 grayscale scale-110 group-hover:scale-100 transition-all duration-[2s]"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12">
                    <span className="text-primary text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] mb-2">YOUR TRIP</span>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white italic truncate uppercase tracking-tighter">
                      {form.title || 'Untitled Trip'}
                    </h3>
                  </div>
                  <div className="absolute top-0 right-0 p-3 md:p-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 md:gap-12">
                  <div className="space-y-1 md:space-y-2">
                    <span className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">Location</span>
                    <p className="text-lg md:text-xl font-black text-white italic">{form.location || '--'}</p>
                  </div>
                  <div className="space-y-1 md:space-y-2 text-right">
                    <span className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">Budget</span>
                    <p className="text-lg md:text-xl font-black text-primary italic">${form.budget || '0,000'}</p>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <span className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">Travelers</span>
                    <p className="text-lg md:text-xl font-black text-white italic">{form.participants || '0'} People</p>
                  </div>
                  <div className="space-y-1 md:space-y-2 text-right">
                    <span className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">Type</span>
                    <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest">{form.type || 'Standard'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 md:pt-10 border-t border-white/5">
                <p className="text-[10px] md:text-[11px] text-white/20 font-medium italic leading-relaxed">
                  "We'll create a detailed day-by-day itinerary based on your preferences."
                </p>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Planner;
