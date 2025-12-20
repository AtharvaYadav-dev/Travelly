import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, MapPin, Calendar, DollarSign, Users } from 'lucide-react';

const TripComparison = ({ trips, onClose }) => {
  const [selectedTrips, setSelectedTrips] = useState([]);

  const toggleTrip = (tripId) => {
    if (selectedTrips.includes(tripId)) {
      setSelectedTrips(selectedTrips.filter(id => id !== tripId));
    } else if (selectedTrips.length < 3) {
      setSelectedTrips([...selectedTrips, tripId]);
    }
  };

  const compareMetrics = [
    { key: 'location', label: 'Destination', icon: MapPin },
    { key: 'duration', label: 'Duration', icon: Calendar },
    { key: 'budget', label: 'Budget', icon: DollarSign },
    { key: 'participants', label: 'Travelers', icon: Users },
    { key: 'activities', label: 'Activities', icon: Check }
  ];

  const selectedTripData = trips.filter(t => selectedTrips.includes(t.id));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="premium-glass max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">
              ⚖️ Compare Trips
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-white/80 text-sm mt-2">
            Select up to 3 trips to compare
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Trip Selection */}
          {selectedTrips.length < 3 && (
            <div className="mb-6">
              <h3 className="text-white font-bold mb-4">Select Trips:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <h4 className="text-white font-bold">{trip.location}</h4>
                      {selectedTrips.includes(trip.id) && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <p className="text-white/60 text-sm">
                      ${trip.budget} • {trip.duration} days
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {selectedTripData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/60 uppercase text-sm">
                      Metric
                    </th>
                    {selectedTripData.map(trip => (
                      <th key={trip.id} className="p-4 text-center">
                        <div className="text-white font-bold">{trip.location}</div>
                        <button
                          onClick={() => toggleTrip(trip.id)}
                          className="text-xs text-white/60 hover:text-white mt-1"
                        >
                          Remove
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareMetrics.map(metric => {
                    const Icon = metric.icon;
                    return (
                      <tr key={metric.key} className="border-b border-white/5">
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-white">
                            <Icon className="w-4 h-4 text-primary" />
                            {metric.label}
                          </div>
                        </td>
                        {selectedTripData.map(trip => (
                          <td key={trip.id} className="p-4 text-center text-white">
                            {metric.key === 'budget' && '$'}
                            {trip[metric.key]}
                            {metric.key === 'duration' && ' days'}
                            {metric.key === 'participants' && ' people'}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Winner Badge */}
          {selectedTripData.length > 1 && (
            <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-green-400 font-bold mb-2">💡 Recommendation:</p>
              <p className="text-white/80 text-sm">
                Based on value for money, we recommend{' '}
                <span className="text-primary font-bold">
                  {selectedTripData.reduce((best, trip) =>
                    (trip.budget / trip.duration) < (best.budget / best.duration) ? trip : best
                  ).location}
                </span>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TripComparison;
