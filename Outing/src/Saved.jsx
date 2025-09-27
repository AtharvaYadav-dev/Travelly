import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';

const Saved = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchUserItineraries();
  }, []);

  const fetchUserItineraries = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('User not logged in or fetch error:', userError);
      setItineraries([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    if (error) {
      console.error('❌ Error fetching itineraries:', error);
    } else {
      setItineraries(data);
    }

    setLoading(false);
  };

  // Focus behavior: when a card is expanded, scroll it into view and allow ESC to close
  useEffect(() => {
    if (expandedId) {
      const el = document.getElementById(`trip-card-${expandedId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }
  }, [expandedId]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setExpandedId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const deleteItinerary = async (id) => {
    if (!confirm('Delete this itinerary permanently?')) return;
    const { error } = await supabase.from('itineraries').delete().eq('id', id);

    if (error) {
      alert('Failed to delete itinerary.');
    } else {
      alert('Itinerary deleted ✅');
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
    <section className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-tr from-indigo-600 via-fuchsia-500 to-pink-400 bg-clip-text text-transparent drop-shadow">Your Saved Itineraries</h2>

      {/* Filters */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl shadow-xl border border-indigo-100 backdrop-blur-md bg-white/70 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none">🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, location, or type"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200"
            />
          </div>
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 select-none">🧭</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm transition-all hover:border-indigo-200"
            >
              <option value="">All Types</option>
              <option>Family Outing</option>
              <option>Date</option>
              <option>Activities Near You</option>
              <option>Friends Outing</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 ml-auto">{filteredItineraries.length} result(s)</div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[240px] gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-300 border-t-indigo-500 rounded-full" />
          <p className="text-gray-500">Loading your itineraries...</p>
        </div>
      ) : filteredItineraries.length === 0 ? (
        <div className="text-center text-gray-500 glass-card p-8 rounded-2xl border border-indigo-100 bg-white/60">
          <p>No itineraries found. Try adjusting filters or create a new plan.</p>
        </div>
      ) : (
        <div className={`${expandedId ? 'grid grid-cols-1' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6 transition-all`}>
          {filteredItineraries.map((trip) => (
            <div
              key={trip.id}
              id={`trip-card-${trip.id}`}
              className={
                `glass-card p-5 rounded-2xl shadow-xl border border-indigo-100 backdrop-blur-md bg-white/70 transition-all duration-300 ` +
                (expandedId === trip.id
                  ? 'ring-2 ring-indigo-300 scale-[1.01] col-span-full'
                  : expandedId
                    ? 'opacity-50 hover:opacity-70'
                    : 'hover:scale-[1.01]')
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-indigo-700 mb-1">{trip.title}</h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">{trip.type || 'General'}</span>
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">₹{trip.budget}</span>
                    <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">👥 {trip.participants}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{trip.location}</p>
                  <p className="text-xs text-gray-500">{trip.startDate} → {trip.endDate}</p>
                </div>
                <button
                  onClick={() => deleteItinerary(trip.id)}
                  className="px-3 py-1 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-sm"
                  title="Delete itinerary"
                >
                  🗑
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3">
                {trip.ai_plan && (
                  <button
                    onClick={() => setExpandedId(expandedId === trip.id ? null : trip.id)}
                    className={`px-3 py-1.5 rounded-lg bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-pink-400 text-white text-sm font-semibold shadow active:scale-95 transition-all ${expandedId === trip.id ? 'hover:scale-[1.01]' : 'hover:scale-[1.02]'}`}
                  >
                    {expandedId === trip.id ? 'Hide Plan' : 'View Plan'}
                  </button>
                )}
              </div>

              {trip.ai_plan && expandedId === trip.id && (
                <div className="mt-4 p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg text-sm text-gray-700 whitespace-pre-line">
                  <h4 className="text-indigo-700 font-semibold mb-2">🧠 Generated Plan</h4>
                  {trip.ai_plan}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Saved;
