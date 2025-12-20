import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Calendar, Award, Download } from 'lucide-react';

const TravelPassport = ({ userId, onClose }) => {
  const [stamps, setStamps] = useState([]);
  const [stats, setStats] = useState({
    countriesVisited: 0,
    continentsVisited: 0,
    totalTrips: 0,
    totalDays: 0
  });

  useEffect(() => {
    loadPassportData();
  }, [userId]);

  const loadPassportData = () => {
    // Load from localStorage or database
    const trips = JSON.parse(localStorage.getItem('savedTrips') || '[]');

    const uniqueCountries = new Set();
    const uniqueContinents = new Set();
    let totalDays = 0;

    const stampData = trips.map(trip => {
      const country = trip.location?.split(',')[1]?.trim() || trip.location;
      uniqueCountries.add(country);

      // Simplified continent mapping
      const continent = getContinent(country);
      if (continent) uniqueContinents.add(continent);

      totalDays += parseInt(trip.duration) || 0;

      return {
        id: trip.id,
        country: country,
        location: trip.location,
        date: trip.createdAt || new Date().toISOString(),
        flag: getCountryFlag(country)
      };
    });

    setStamps(stampData);
    setStats({
      countriesVisited: uniqueCountries.size,
      continentsVisited: uniqueContinents.size,
      totalTrips: trips.length,
      totalDays: totalDays
    });
  };

  const getContinent = (country) => {
    const continentMap = {
      'France': 'Europe', 'Italy': 'Europe', 'Spain': 'Europe', 'Germany': 'Europe',
      'Japan': 'Asia', 'China': 'Asia', 'Thailand': 'Asia', 'India': 'Asia',
      'USA': 'North America', 'Canada': 'North America', 'Mexico': 'North America',
      'Brazil': 'South America', 'Argentina': 'South America',
      'Egypt': 'Africa', 'Kenya': 'Africa', 'South Africa': 'Africa',
      'Australia': 'Oceania', 'New Zealand': 'Oceania'
    };
    return continentMap[country];
  };

  const getCountryFlag = (country) => {
    const flagMap = {
      'France': '🇫🇷', 'Italy': '🇮🇹', 'Spain': '🇪🇸', 'Germany': '🇩🇪',
      'Japan': '🇯🇵', 'China': '🇨🇳', 'Thailand': '🇹🇭', 'India': '🇮🇳',
      'USA': '🇺🇸', 'Canada': '🇨🇦', 'Mexico': '🇲🇽',
      'Brazil': '🇧🇷', 'Argentina': '🇦🇷',
      'Egypt': '🇪🇬', 'Kenya': '🇰🇪', 'South Africa': '🇿🇦',
      'Australia': '🇦🇺', 'New Zealand': '🇳🇿'
    };
    return flagMap[country] || '🌍';
  };

  const downloadPassport = () => {
    // Create downloadable passport image/PDF
    alert('Passport download feature - Coming soon!');
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-4xl">
                🛂
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  Travel Passport
                </h2>
                <p className="text-white/80 text-sm">
                  Your journey around the world
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadPassport}
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-white">{stats.countriesVisited}</div>
              <div className="text-xs text-white/80">Countries</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-white">{stats.continentsVisited}</div>
              <div className="text-xs text-white/80">Continents</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-white">{stats.totalTrips}</div>
              <div className="text-xs text-white/80">Trips</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-white">{stats.totalDays}</div>
              <div className="text-xs text-white/80">Days</div>
            </div>
          </div>
        </div>

        {/* Stamps */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          <h3 className="text-xl font-black text-white mb-4">🎫 Travel Stamps</h3>

          {stamps.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No stamps yet. Start planning trips to collect stamps!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stamps.map((stamp, i) => (
                <motion.div
                  key={stamp.id}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="premium-glass p-4 rounded-xl border border-white/10 text-center transform hover:scale-105 transition-all cursor-pointer"
                  style={{
                    transform: `rotate(${Math.random() * 6 - 3}deg)`
                  }}
                >
                  <div className="text-5xl mb-2">{stamp.flag}</div>
                  <div className="text-white font-bold text-sm mb-1">
                    {stamp.country}
                  </div>
                  <div className="text-white/60 text-xs">
                    {new Date(stamp.date).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="p-6 bg-slate-900/50 border-t border-white/10">
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3 rounded-lg border ${stats.totalTrips >= 1 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
              <div className="text-2xl mb-1">🎒</div>
              <div className="text-xs text-white font-bold">First Trip</div>
            </div>
            <div className={`p-3 rounded-lg border ${stats.countriesVisited >= 5 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
              <div className="text-2xl mb-1">🌍</div>
              <div className="text-xs text-white font-bold">Explorer</div>
            </div>
            <div className={`p-3 rounded-lg border ${stats.continentsVisited >= 3 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
              <div className="text-2xl mb-1">✈️</div>
              <div className="text-xs text-white font-bold">Globe Trotter</div>
            </div>
            <div className={`p-3 rounded-lg border ${stats.totalDays >= 30 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-xs text-white font-bold">Time Traveler</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TravelPassport;
