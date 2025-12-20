import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Navigation, DollarSign, Calendar } from 'lucide-react';

const TripMerger = ({ trips, onClose, onMerge }) => {
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [mergedName, setMergedName] = useState('');

  const toggleTrip = (tripId) => {
    if (selectedTrips.includes(tripId)) {
      setSelectedTrips(selectedTrips.filter(id => id !== tripId));
    } else {
      setSelectedTrips([...selectedTrips, tripId]);
    }
  };

  const calculateMergedData = () => {
    const selected = trips.filter(t => selectedTrips.includes(t.id));

    const totalBudget = selected.reduce((sum, t) => sum + (parseInt(t.budget) || 0), 0);
    const totalDuration = selected.reduce((sum, t) => sum + (parseInt(t.duration) || 0), 0);
    const destinations = selected.map(t => t.location).join(' → ');
    const maxParticipants = Math.max(...selected.map(t => parseInt(t.participants) || 1));

    return {
      totalBudget,
      totalDuration,
      destinations,
      maxParticipants,
      tripCount: selected.length
    };
  };

  const handleMerge = () => {
    if (selectedTrips.length < 2) {
      alert('Please select at least 2 trips to merge');
      return;
    }

    if (!mergedName.trim()) {
      alert('Please enter a name for the merged trip');
      return;
    }

    const selected = trips.filter(t => selectedTrips.includes(t.id));
    const merged = calculateMergedData();

    const mergedTrip = {
      id: Date.now(),
      title: mergedName,
      location: merged.destinations,
      budget: merged.totalBudget,
      duration: merged.totalDuration,
      participants: merged.maxParticipants,
      type: 'Multi-Destination',
      createdAt: new Date().toISOString(),
      merged: true,
      originalTrips: selected.map(t => t.id)
    };

    onMerge?.(mergedTrip);
    onClose();
  };

  const merged = selectedTrips.length >= 2 ? calculateMergedData() : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="premium-glass max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">🔗 Trip Merger</h2>
                <p className="text-white/80 text-sm">Combine multiple trips into one journey</p>
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
          {/* Trip Name Input */}
          <div className="mb-6">
            <label className="text-white font-bold mb-2 block">Merged Trip Name</label>
            <input
              type="text"
              value={mergedName}
              onChange={(e) => setMergedName(e.target.value)}
              placeholder="e.g., European Adventure 2025"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Trip Selection */}
          <div className="mb-6">
            <h3 className="text-white font-bold mb-4">Select Trips to Merge (min 2):</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trips.map(trip => (
                <button
                  key={trip.id}
                  onClick={() => toggleTrip(trip.id)}
                  className={`p-4 rounded-xl border transition-all text-left ${selectedTrips.includes(trip.id)
                      ? 'bg-primary/20 border-primary/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-white font-bold mb-1">{trip.title || trip.location}</h4>
                      <p className="text-white/60 text-sm">{trip.location}</p>
                    </div>
                    {selectedTrips.includes(trip.id) && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/60 mt-2">
                    <span>${trip.budget}</span>
                    <span>{trip.duration}d</span>
                    <span>{trip.participants}p</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Merged Preview */}
          {merged && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-glass p-6 rounded-2xl border border-primary/30 bg-primary/5"
            >
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Merged Trip Preview
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Route</p>
                  <p className="text-white font-bold">{merged.destinations}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-2xl font-black text-white">${merged.totalBudget}</p>
                    <p className="text-xs text-white/60">Total Budget</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-2xl font-black text-white">{merged.totalDuration}</p>
                    <p className="text-xs text-white/60">Total Days</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <Navigation className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <p className="text-2xl font-black text-white">{merged.tripCount}</p>
                    <p className="text-xs text-white/60">Destinations</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-blue-400 text-sm">
                    💡 <strong>Tip:</strong> The route will be optimized to minimize travel time between destinations.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/50 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-white/60 text-sm">
              {selectedTrips.length} trip{selectedTrips.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleMerge}
                disabled={selectedTrips.length < 2 || !mergedName.trim()}
                className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Merge Trips
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TripMerger;
