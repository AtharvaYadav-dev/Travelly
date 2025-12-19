import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabase';
import Magnetic from './Magnetic';

const Saved = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserItineraries();
  }, []);

  const fetchUserItineraries = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setItineraries(data || []);
    setLoading(false);
  };

  const deleteItinerary = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this trip?')) return;
    const { error } = await supabase.from('itineraries').delete().eq('id', id);
    if (!error) {
      setItineraries(itineraries.filter((item) => item.id !== id));
    }
  };

  const filteredItineraries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return itineraries.filter((t) => {
      const matchesQ = !q || `${t.title} ${t.location} ${t.type}`.toLowerCase().includes(q);
      const matchesType = !typeFilter || t.type === typeFilter;
      return matchesQ && matchesType;
    });
  }, [itineraries, query, typeFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-64">
      {/* Header Space */}
      <div className="h-48" />

      <div className="max-w-[1700px] mx-auto px-10">

        {/* --- DYNAMIC HEADER --- */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-24 mb-32">
          <div className="max-w-4xl space-y-10">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-primary font-black uppercase tracking-[0.8em] text-[10px] mb-8 block">SAVED TRIPS</span>
              <h2 className="text-7xl md:text-[8rem] font-black uppercase tracking-tighter italic leading-[0.85] text-white">
                Your <span className="primary-gradient-text">Saved</span> <br /> Trips
              </h2>
              <p className="text-white/30 text-2xl font-medium max-w-2xl italic leading-relaxed mt-12">
                All your saved trips in one place. View past itineraries or create new ones.
              </p>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <Magnetic>
              <button
                onClick={() => navigate('/planner')}
                className="btn-expensive bg-primary shadow-primary-glow border-none px-16 text-white"
              >
                Create New Trip
              </button>
            </Magnetic>
          </motion.div>
        </div>

        {/* --- REFINED FILTERS --- */}
        <div className="flex flex-col md:flex-row gap-10 mb-24 premium-glass p-10 rounded-[2rem] border-white/5 shadow-2xl">
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="SEARCH ARCHIVES..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 py-5 px-10 rounded-full text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-black uppercase tracking-widest text-[10px]"
            />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-primary font-black text-xs opacity-40">INDEX</div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900/50 border border-white/5 px-10 py-5 rounded-full text-white/40 focus:outline-none focus:border-primary/50 transition-all font-black uppercase tracking-[0.2em] text-[10px] appearance-none cursor-pointer"
          >
            <option value="">ALL TYPES</option>
            <option>Hiking Adventure</option>
            <option>Skiing Retreat</option>
            <option>Luxury Travel</option>
            <option>Scenic Rail</option>
          </select>
        </div>

        {/* --- GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-slate-900/30 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredItineraries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-56 text-center premium-glass rounded-[3rem]"
          >
            <div className="text-8xl mb-12 opacity-20 filter grayscale">📁</div>
            <h3 className="text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">No Trips Found</h3>
            <p className="text-white/20 text-xl font-medium mb-16 max-w-sm mx-auto italic">You haven't saved any trips yet.</p>
            <Magnetic>
              <button onClick={() => navigate('/planner')} className="btn-expensive bg-white/10 px-12">Create Your First Trip</button>
            </Magnetic>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
            <AnimatePresence>
              {filteredItineraries.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    localStorage.setItem('currentItinerary', JSON.stringify(trip));
                    navigate('/result');
                  }}
                  className="group relative cursor-pointer"
                >
                  <div className="premium-glass rounded-[3rem] p-12 h-full flex flex-col justify-between border-primary/5 hover:border-primary/20 transition-all duration-700 shadow-2xl perspective-1000">
                    <div>
                      <div className="flex justify-between items-center mb-12">
                        <span className="px-6 py-2 rounded-full border border-primary/30 text-primary text-[9px] font-black uppercase tracking-[0.4em] shadow-lg">
                          {trip.type || 'SWISS ALPHA'}
                        </span>
                        <Magnetic>
                          <button
                            onClick={(e) => deleteItinerary(trip.id, e)}
                            className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-red-500 hover:border-red-500/30 transition-all text-xl"
                          >
                            ×
                          </button>
                        </Magnetic>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] mb-2 block">Trip #{trip.id.toString().slice(-4)}</span>
                        <h3 className="text-4xl md:text-5xl font-black mb-6 uppercase italic tracking-tighter whitespace-pre-wrap transition-all group-hover:text-primary leading-none">
                          {trip.title}
                        </h3>
                        <div className="inline-flex items-center gap-4 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                          <div className="w-8 h-px bg-primary" />
                          {trip.location}
                        </div>
                      </div>
                    </div>

                    <div className="pt-16 mt-16 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-10 mb-12">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Budget</p>
                          <p className="text-3xl font-black text-white italic tracking-tighter">${trip.budget.toLocaleString()}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Travelers</p>
                          <p className="text-3xl font-black text-white italic tracking-tighter">{trip.participants} People</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Magnetic>
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] group-hover:translate-x-4 transition-transform duration-500">
                            View Details →
                          </span>
                        </Magnetic>
                        <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">
                          {new Date(trip.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
