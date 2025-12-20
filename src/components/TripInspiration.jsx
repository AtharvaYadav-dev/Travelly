import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';

const TripInspiration = ({ onSelect }) => {
  const [inspiration, setInspiration] = useState(null);
  const [loading, setLoading] = useState(false);

  const destinations = [
    { name: 'Bali, Indonesia', season: 'Summer', budget: 2500, vibe: 'Beach & Culture', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4' },
    { name: 'Kyoto, Japan', season: 'Spring', budget: 3500, vibe: 'Cultural & Historic', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e' },
    { name: 'Santorini, Greece', season: 'Summer', budget: 3000, vibe: 'Romantic & Scenic', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e' },
    { name: 'Iceland', season: 'Winter', budget: 4000, vibe: 'Adventure & Nature', image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67' },
    { name: 'Morocco', season: 'Fall', budget: 2000, vibe: 'Exotic & Cultural', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43' },
  ];

  const generateInspiration = () => {
    setLoading(true);
    setTimeout(() => {
      const season = getCurrentSeason();
      const suitable = destinations.filter(d => d.season === season);
      const random = suitable.length > 0
        ? suitable[Math.floor(Math.random() * suitable.length)]
        : destinations[Math.floor(Math.random() * destinations.length)];

      setInspiration(random);
      setLoading(false);
    }, 1000);
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  };

  return (
    <div className="premium-glass p-8 rounded-2xl border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-primary" />
        <h3 className="text-2xl font-black text-white">Not sure where to go?</h3>
      </div>

      {!inspiration ? (
        <button
          onClick={generateInspiration}
          disabled={loading}
          className="w-full py-6 rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:shadow-primary-glow text-white font-bold text-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Finding inspiration...' : '✨ Get AI Inspiration'}
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="relative h-64 rounded-xl overflow-hidden">
            <img src={inspiration.image} alt={inspiration.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="text-2xl font-black text-white mb-2">{inspiration.name}</h4>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  {inspiration.vibe}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  ${inspiration.budget}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  Best: {inspiration.season}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onSelect?.(inspiration)}
              className="flex-1 py-3 rounded-lg bg-primary hover:bg-primary/80 text-white font-bold transition-all"
            >
              Plan This Trip
            </button>
            <button
              onClick={generateInspiration}
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TripInspiration;
