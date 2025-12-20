import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, MapPin, DollarSign, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TripAnalytics = ({ userId, onClose }) => {
  const [analytics, setAnalytics] = useState({
    totalTrips: 0,
    totalSpent: 0,
    avgBudget: 0,
    countriesVisited: 0,
    favoriteDestination: '',
    budgetTrend: [],
    destinationBreakdown: [],
    monthlyTrips: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [userId]);

  const loadAnalytics = () => {
    const trips = JSON.parse(localStorage.getItem('savedTrips') || '[]');

    if (trips.length === 0) {
      return;
    }

    // Calculate statistics
    const totalSpent = trips.reduce((sum, trip) => sum + (parseInt(trip.budget) || 0), 0);
    const avgBudget = Math.round(totalSpent / trips.length);

    // Count countries
    const countries = new Set(trips.map(t => t.location?.split(',')[1]?.trim() || t.location));

    // Find favorite destination
    const destinationCounts = {};
    trips.forEach(trip => {
      const dest = trip.location;
      destinationCounts[dest] = (destinationCounts[dest] || 0) + 1;
    });
    const favoriteDestination = Object.entries(destinationCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Budget trend (last 6 trips)
    const budgetTrend = trips.slice(-6).map((trip, i) => ({
      name: `Trip ${i + 1}`,
      budget: parseInt(trip.budget) || 0
    }));

    // Destination breakdown
    const destinationBreakdown = Object.entries(destinationCounts)
      .map(([name, count]) => ({
        name: name.split(',')[0],
        value: count,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      }))
      .slice(0, 5);

    // Monthly trips
    const monthlyData = {};
    trips.forEach(trip => {
      const month = new Date(trip.createdAt || Date.now()).toLocaleDateString('en', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    const monthlyTrips = Object.entries(monthlyData).map(([month, count]) => ({
      month,
      trips: count
    }));

    setAnalytics({
      totalTrips: trips.length,
      totalSpent,
      avgBudget,
      countriesVisited: countries.size,
      favoriteDestination,
      budgetTrend,
      destinationBreakdown,
      monthlyTrips
    });
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="premium-glass p-6 rounded-2xl border border-white/10">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-white/60 text-sm">{label}</p>
          <p className="text-2xl font-black text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="premium-glass max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  📊 Trip Analytics
                </h2>
                <p className="text-white/80 text-sm">
                  Your travel insights and statistics
                </p>
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={MapPin}
              label="Total Trips"
              value={analytics.totalTrips}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={DollarSign}
              label="Total Spent"
              value={`$${analytics.totalSpent.toLocaleString()}`}
              color="from-green-500 to-green-600"
            />
            <StatCard
              icon={Calendar}
              label="Avg Budget"
              value={`$${analytics.avgBudget.toLocaleString()}`}
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              icon={MapPin}
              label="Countries"
              value={analytics.countriesVisited}
              color="from-orange-500 to-orange-600"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Budget Trend */}
            <div className="premium-glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-black text-white mb-4">Budget Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics.budgetTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="name" stroke="#ffffff60" />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="budget" stroke="#FF7A2D" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Destination Breakdown */}
            <div className="premium-glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-black text-white mb-4">Top Destinations</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.destinationBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.destinationBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Activity */}
          {analytics.monthlyTrips.length > 0 && (
            <div className="premium-glass p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-black text-white mb-4">Monthly Activity</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.monthlyTrips}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff60" />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="trips" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="premium-glass p-4 rounded-xl border border-white/10">
              <p className="text-white/60 text-sm mb-1">Favorite Destination</p>
              <p className="text-xl font-black text-primary">{analytics.favoriteDestination}</p>
            </div>
            <div className="premium-glass p-4 rounded-xl border border-white/10">
              <p className="text-white/60 text-sm mb-1">Travel Style</p>
              <p className="text-xl font-black text-primary">
                {analytics.avgBudget > 5000 ? 'Luxury' : analytics.avgBudget > 2000 ? 'Comfort' : 'Budget'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TripAnalytics;
