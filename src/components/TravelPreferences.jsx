import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Settings } from 'lucide-react';

const TravelPreferences = ({ userId, onClose, onSave }) => {
  const [preferences, setPreferences] = useState({
    favoriteTypes: [],
    budgetRange: { min: 1000, max: 5000 },
    travelStyle: 'balanced',
    dietary: [],
    accommodation: 'hotel',
    transportation: 'flexible',
    pace: 'moderate',
    interests: []
  });

  useEffect(() => {
    loadPreferences();
  }, [userId]);

  const loadPreferences = () => {
    const saved = localStorage.getItem(`preferences_${userId || 'guest'}`);
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  };

  const savePreferences = () => {
    localStorage.setItem(`preferences_${userId || 'guest'}`, JSON.stringify(preferences));
    onSave?.(preferences);
    onClose();
  };

  const tripTypes = ['Beach', 'Mountain', 'City', 'Cultural', 'Adventure', 'Luxury', 'Budget', 'Family'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'None'];
  const interests = ['History', 'Food', 'Nature', 'Shopping', 'Nightlife', 'Photography', 'Sports', 'Art'];

  const toggleArray = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="premium-glass max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Settings className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-black text-white">⚙️ Travel Preferences</h2>
                <p className="text-white/80 text-sm">Customize your travel planning experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Favorite Trip Types */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-3">Favorite Trip Types</h3>
            <div className="flex flex-wrap gap-2">
              {tripTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setPreferences({
                    ...preferences,
                    favoriteTypes: toggleArray(preferences.favoriteTypes, type)
                  })}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${preferences.favoriteTypes.includes(type)
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-3">Typical Budget Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Minimum</label>
                <input
                  type="number"
                  value={preferences.budgetRange.min}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    budgetRange: { ...preferences.budgetRange, min: parseInt(e.target.value) }
                  })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Maximum</label>
                <input
                  type="number"
                  value={preferences.budgetRange.max}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    budgetRange: { ...preferences.budgetRange, max: parseInt(e.target.value) }
                  })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Travel Style */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-3">Travel Style</h3>
            <div className="grid grid-cols-3 gap-3">
              {['budget', 'balanced', 'luxury'].map(style => (
                <button
                  key={style}
                  onClick={() => setPreferences({ ...preferences, travelStyle: style })}
                  className={`p-4 rounded-xl border transition-all ${preferences.travelStyle === style
                      ? 'bg-primary/20 border-primary/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                  <p className="text-white font-bold capitalize">{style}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-3">Dietary Restrictions</h3>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map(diet => (
                <button
                  key={diet}
                  onClick={() => setPreferences({
                    ...preferences,
                    dietary: toggleArray(preferences.dietary, diet)
                  })}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${preferences.dietary.includes(diet)
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <button
                  key={interest}
                  onClick={() => setPreferences({
                    ...preferences,
                    interests: toggleArray(preferences.interests, interest)
                  })}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${preferences.interests.includes(interest)
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Pace */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-3">Travel Pace</h3>
            <div className="grid grid-cols-3 gap-3">
              {['relaxed', 'moderate', 'fast'].map(pace => (
                <button
                  key={pace}
                  onClick={() => setPreferences({ ...preferences, pace })}
                  className={`p-4 rounded-xl border transition-all ${preferences.pace === pace
                      ? 'bg-primary/20 border-primary/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                  <p className="text-white font-bold capitalize">{pace}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/50 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-sm">
              These preferences will auto-fill in the planner
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={savePreferences}
                className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 text-white font-bold flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TravelPreferences;
