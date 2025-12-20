import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, MapPin, DollarSign, TrendingUp, Calendar,
  Globe, Activity, Award, BarChart3, PieChart
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { supabase } from '../supabaseClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalRevenue: 0,
    activeUsers: 0,
    avgBudget: 0,
    conversionRate: 0
  });

  const [userGrowth, setUserGrowth] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [budgetDistribution, setBudgetDistribution] = useState([]);
  const [tripTypes, setTripTypes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load all stats
      await Promise.all([
        loadStats(),
        loadUserGrowth(),
        loadPopularDestinations(),
        loadBudgetDistribution(),
        loadTripTypes(),
        loadRecentActivity()
      ]);
    } catch (error) {
      console.error('Dashboard load error:', error);
      loadMockData();
    }
  };

  const loadStats = async () => {
    try {
      const { data: users } = await supabase.from('profiles').select('*');
      const { data: trips } = await supabase.from('itineraries').select('*');

      const totalBudget = trips?.reduce((sum, trip) => sum + (trip.budget || 0), 0) || 0;
      const avgBudget = trips?.length ? totalBudget / trips.length : 0;

      setStats({
        totalUsers: users?.length || 0,
        totalTrips: trips?.length || 0,
        totalRevenue: totalBudget * 0.05, // 5% commission estimate
        activeUsers: users?.filter(u => {
          const lastActive = new Date(u.last_sign_in_at);
          const daysSince = (Date.now() - lastActive) / (1000 * 60 * 60 * 24);
          return daysSince < 30;
        }).length || 0,
        avgBudget: Math.round(avgBudget),
        conversionRate: trips?.length && users?.length ? (trips.length / users.length * 100).toFixed(1) : 0
      });
    } catch (error) {
      console.error('Stats load error:', error);
    }
  };

  const loadUserGrowth = async () => {
    // Mock data for demonstration
    setUserGrowth([
      { month: 'Jan', users: 120, trips: 45 },
      { month: 'Feb', users: 180, trips: 72 },
      { month: 'Mar', users: 250, trips: 105 },
      { month: 'Apr', users: 340, trips: 156 },
      { month: 'May', users: 480, trips: 234 },
      { month: 'Jun', users: 620, trips: 312 }
    ]);
  };

  const loadPopularDestinations = async () => {
    try {
      const { data: trips } = await supabase
        .from('itineraries')
        .select('location');

      const locationCounts = {};
      trips?.forEach(trip => {
        const loc = trip.location;
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
      });

      const sorted = Object.entries(locationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      setPopularDestinations(sorted.length ? sorted : getMockDestinations());
    } catch (error) {
      setPopularDestinations(getMockDestinations());
    }
  };

  const getMockDestinations = () => [
    { name: 'Paris', count: 145 },
    { name: 'Tokyo', count: 132 },
    { name: 'New York', count: 118 },
    { name: 'London', count: 95 },
    { name: 'Barcelona', count: 87 },
    { name: 'Rome', count: 76 },
    { name: 'Dubai', count: 64 },
    { name: 'Singapore', count: 58 }
  ];

  const loadBudgetDistribution = () => {
    setBudgetDistribution([
      { range: '$0-1k', count: 234, color: '#10b981' },
      { range: '$1k-3k', count: 456, color: '#3b82f6' },
      { range: '$3k-5k', count: 312, color: '#8b5cf6' },
      { range: '$5k-10k', count: 189, color: '#f59e0b' },
      { range: '$10k+', count: 87, color: '#ef4444' }
    ]);
  };

  const loadTripTypes = () => {
    setTripTypes([
      { name: 'Luxury Travel', value: 28, color: '#FF7A2D' },
      { name: 'Hiking Adventure', value: 22, color: '#10b981' },
      { name: 'Beach Escapes', value: 18, color: '#3b82f6' },
      { name: 'Family Vacations', value: 15, color: '#8b5cf6' },
      { name: 'Historic Discovery', value: 10, color: '#f59e0b' },
      { name: 'Other', value: 7, color: '#6b7280' }
    ]);
  };

  const loadRecentActivity = () => {
    setRecentActivity([
      { type: 'trip_created', user: 'user@example.com', details: 'Paris trip', time: '2 min ago' },
      { type: 'user_signup', user: 'newuser@example.com', details: 'New registration', time: '15 min ago' },
      { type: 'trip_shared', user: 'traveler@example.com', details: 'Tokyo itinerary', time: '1 hour ago' },
      { type: 'achievement', user: 'explorer@example.com', details: 'Globe Trotter unlocked', time: '2 hours ago' }
    ]);
  };

  const loadMockData = () => {
    setStats({
      totalUsers: 1247,
      totalTrips: 3456,
      totalRevenue: 52340,
      activeUsers: 892,
      avgBudget: 3200,
      conversionRate: 68.5
    });
    loadUserGrowth();
    setPopularDestinations(getMockDestinations());
    loadBudgetDistribution();
    loadTripTypes();
    loadRecentActivity();
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-glass p-6 rounded-2xl border border-white/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-400 text-sm font-bold">
            <TrendingUp className="w-4 h-4" />
            {trend}%
          </div>
        )}
      </div>
      <p className="text-3xl font-black text-white mb-1">{value}</p>
      <p className="text-sm text-white/60">{title}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">
            📊 Admin Dashboard
          </h1>
          <p className="text-white/60">
            Real-time analytics and insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            trend={12}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Trips"
            value={stats.totalTrips.toLocaleString()}
            icon={MapPin}
            trend={8}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Revenue (Est.)"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={15}
            color="from-yellow-500 to-yellow-600"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            icon={Activity}
            trend={5}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Avg Budget"
            value={`$${stats.avgBudget.toLocaleString()}`}
            icon={BarChart3}
            color="from-pink-500 to-pink-600"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={TrendingUp}
            trend={3}
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="premium-glass p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-black text-white mb-4">User & Trip Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="month" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="trips" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Trip Types Pie Chart */}
          <div className="premium-glass p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-black text-white mb-4">Trip Types Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={tripTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tripTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Destinations & Budget Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Popular Destinations */}
          <div className="premium-glass p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-black text-white mb-4">Popular Destinations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularDestinations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff60" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#FF7A2D" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Budget Distribution */}
          <div className="premium-glass p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-black text-white mb-4">Budget Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="range" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count">
                  {budgetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="premium-glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-black text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'trip_created' ? 'bg-green-500/20 text-green-400' :
                    activity.type === 'user_signup' ? 'bg-blue-500/20 text-blue-400' :
                      activity.type === 'trip_shared' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-yellow-500/20 text-yellow-400'
                  }`}>
                  {activity.type === 'trip_created' && <MapPin className="w-5 h-5" />}
                  {activity.type === 'user_signup' && <Users className="w-5 h-5" />}
                  {activity.type === 'trip_shared' && <Globe className="w-5 h-5" />}
                  {activity.type === 'achievement' && <Award className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold">{activity.user}</p>
                  <p className="text-sm text-white/60">{activity.details}</p>
                </div>
                <span className="text-xs text-white/40">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
