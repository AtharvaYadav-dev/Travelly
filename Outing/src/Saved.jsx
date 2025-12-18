import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from './supabase';

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
    if (!confirm('Permanently decommission this dossier?')) return;
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
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-indigo-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Central Library</span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">Your Global <br /><span className="navbar-logo-gradient animate-gradient-text">Archives</span></h2>
            <p className="text-slate-500 text-xl font-medium max-w-xl">
              A secure repository of your designed explorations. Revisit, refine, and deploy your master itineraries.
            </p>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/planner')}
          className="btn-premium btn-premium-primary text-xl px-10"
        >
          Initialize New Plan 🚀
        </motion.button>
      </div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col md:flex-row gap-6 mb-16">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-xl group-focus-within:scale-110 transition-transform">🔍</div>
          <input
            type="text"
            placeholder="Search Archives..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="premium-input pl-16 py-5 text-lg"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="premium-input md:w-80 py-5 font-black uppercase tracking-widest text-xs"
        >
          <option value="">Filter Category</option>
          <option>Adventure</option>
          <option>Relaxation</option>
          <option>Food & Culture</option>
          <option>Family Fun</option>
          <option>Strategic Luxury</option>
        </select>
      </div>

      {/* --- ARCHIVE GRID --- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[460px] rounded-[3rem] glass-card overflow-hidden">
              <div className="h-full w-full shimmer opacity-50" />
            </div>
          ))}
        </div>
      ) : filteredItineraries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-32 text-center rounded-[4rem] border-2 border-dashed border-slate-200 bg-slate-50/50"
        >
          <div className="text-9xl mb-8 opacity-20">📂</div>
          <h3 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">The Archive is Silent</h3>
          <p className="text-slate-500 text-xl font-medium mb-12 max-w-sm mx-auto">Start designing your first masterpiece to see it manifest here.</p>
          <button onClick={() => navigate('/planner')} className="btn-premium px-12 py-5 glass-ui text-indigo-600 border-indigo-200">Architect Your First Journey</button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItineraries.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => {
                localStorage.setItem('currentItinerary', JSON.stringify(trip));
                navigate('/result');
              }}
              className="group cursor-pointer"
            >
              <div className="glass-card h-full p-10 border-slate-200/50 hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[460px]">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full -mr-24 -mt-24 group-hover:bg-indigo-500/10 transition-colors duration-500" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {trip.type || 'Mission'}
                    </span>
                    <button
                      onClick={(e) => deleteItinerary(trip.id, e)}
                      className="w-10 h-10 rounded-2xl glass-ui border-slate-200 text-slate-300 hover:text-red-500 hover:border-red-500 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center font-black"
                    >
                      ✕
                    </button>
                  </div>

                  <h3 className="text-4xl font-black mb-4 tracking-tighter leading-none line-clamp-2 italic group-hover:text-indigo-600 transition-colors">
                    {trip.title}
                  </h3>
                  <div className="flex items-center gap-3 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                    <span className="text-xl">📍</span> {trip.location}
                  </div>
                </div>

                <div className="relative z-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Investment</p>
                      <p className="text-2xl font-black">₹{trip.budget}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Unit Size</p>
                      <p className="text-2xl font-black">{trip.participants} <span className="text-xs text-slate-400">PAX</span></p>
                    </div>
                  </div>

                  <div className="mt-10 flex items-center justify-between">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Open Dossier →</span>
                    <span className="text-[10px] font-medium text-slate-300">
                      {new Date(trip.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
