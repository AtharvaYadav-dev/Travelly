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

  // Get gradient based on trip type
  const getGradient = (type) => {
    const gradients = {
      'Hiking Adventure': 'from-green-500/20 to-emerald-600/20',
      'Skiing Retreat': 'from-blue-500/20 to-cyan-600/20',
      'Historic Discovery': 'from-amber-500/20 to-orange-600/20',
      'Luxury Travel': 'from-purple-500/20 to-pink-600/20',
      'Scenic Rail': 'from-indigo-500/20 to-blue-600/20',
      default: 'from-[#FF6B35]/20 to-[#F7931E]/20'
    };
    return gradients[type] || gradients.default;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-32">
      {/* Header Space */}
      <div className="h-32 md:h-40" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">

        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-6 py-2 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-full text-[#FF6B35] text-sm font-bold uppercase tracking-wider mb-6">
              Your Collection
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-6">
              Saved <span className="gradient-text-primary">Trips</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              All your travel plans in one beautiful place
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search your trips..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] py-4 px-6 rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[#FF6B35] transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FF6B35] text-sm">🔍</div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] px-6 py-4 rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#FF6B35] transition-all min-w-[200px]"
            >
              <option value="">All Types</option>
              <option>Hiking Adventure</option>
              <option>Skiing Retreat</option>
              <option>Luxury Travel</option>
              <option>Scenic Rail</option>
            </select>
          </motion.div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-[var(--bg-card)] animate-pulse" />
            ))}
          </div>
        ) : filteredItineraries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 text-center card-premium max-w-2xl mx-auto"
          >
            <div className="text-8xl mb-8 opacity-20">📁</div>
            <h3 className="text-4xl font-black text-[var(--text-primary)] mb-4 uppercase tracking-tight">No Trips Found</h3>
            <p className="text-[var(--text-secondary)] text-lg mb-12">Start planning your next adventure!</p>
            <Magnetic>
              <button
                onClick={() => navigate('/planner')}
                className="btn-premium px-12 py-5"
              >
                Create Your First Trip
              </button>
            </Magnetic>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence>
              {filteredItineraries.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    localStorage.setItem('currentItinerary', JSON.stringify(trip));
                    navigate('/result');
                  }}
                  className="group relative cursor-pointer"
                >
                  {/* Card */}
                  <div className="card-premium h-full overflow-hidden relative">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(trip.type)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* Content */}
                    <div className="relative z-10 p-8 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-4 py-2 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-full text-[#FF6B35] text-xs font-bold uppercase tracking-wider">
                          {trip.type || 'Adventure'}
                        </span>
                        <Magnetic>
                          <button
                            onClick={(e) => deleteItinerary(trip.id, e)}
                            className="w-10 h-10 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-red-500 hover:border-red-500/30 transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </Magnetic>
                      </div>

                      {/* Title */}
                      <div className="flex-1 mb-6">
                        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-3">
                          Trip #{trip.id.toString().slice(-4)}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tighter mb-4 group-hover:text-[#FF6B35] transition-colors leading-tight">
                          {trip.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[#FF6B35]">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm font-bold uppercase tracking-wide">{trip.location}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="border-t border-[var(--border-color)] pt-6">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Budget</p>
                            <p className="text-2xl font-black text-[var(--text-primary)] tracking-tight">${trip.budget.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Travelers</p>
                            <p className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{trip.participants}</p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#FF6B35] uppercase tracking-wide group-hover:translate-x-2 transition-transform">
                            View Details →
                          </span>
                          <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                            {new Date(trip.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B35]/5 to-transparent" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Create New Trip Button */}
        {!loading && filteredItineraries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <Magnetic>
              <button
                onClick={() => navigate('/planner')}
                className="btn-premium px-12 py-5"
              >
                + Create New Trip
              </button>
            </Magnetic>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Saved;
