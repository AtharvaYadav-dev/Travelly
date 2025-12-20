import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, MapPin, Calendar, DollarSign,
  Clock, Globe, Activity, Target, Zap
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdvancedAnalytics = ({ userId }) => {
  const [analytics, setAnalytics] = useState({
    userBehavior: [],
    featureUsage: [],
    timeAnalysis: [],
    conversionFunnel: [],
    retentionCohort: [],
    performanceMetrics: {}
  });

  useEffect(() => {
    loadAnalytics();
  }, [userId]);

  const loadAnalytics = () => {
    // In production, this would fetch from your analytics service
    setAnalytics({
      userBehavior: [
        { action: 'Page Views', count: 1245, avgTime: 45 },
        { action: 'Trip Created', count: 234, avgTime: 180 },
        { action: 'PDF Downloaded', count: 156, avgTime: 5 },
        { action: 'Share Clicked', count: 89, avgTime: 10 },
        { action: 'AI Chat Used', count: 312, avgTime: 120 }
      ],
      featureUsage: [
        { feature: 'AI Itinerary', usage: 95, satisfaction: 4.8 },
        { feature: 'Weather', usage: 78, satisfaction: 4.5 },
        { feature: 'Maps', usage: 82, satisfaction: 4.7 },
        { feature: 'Currency', usage: 65, satisfaction: 4.3 },
        { feature: 'Budget Tracker', usage: 58, satisfaction: 4.6 },
        { feature: 'Packing List', usage: 71, satisfaction: 4.4 }
      ],
      timeAnalysis: [
        { hour: '00:00', users: 12, trips: 3 },
        { hour: '04:00', users: 8, trips: 1 },
        { hour: '08:00', users: 145, trips: 45 },
        { hour: '12:00', users: 234, trips: 78 },
        { hour: '16:00', users: 198, trips: 62 },
        { hour: '20:00', users: 267, trips: 89 },
        { hour: '23:00', users: 89, trips: 23 }
      ],
      conversionFunnel: [
        { stage: 'Visitors', count: 10000, percentage: 100 },
        { stage: 'Signed Up', count: 3500, percentage: 35 },
        { stage: 'Created Trip', count: 2400, percentage: 24 },
        { stage: 'Completed Trip', count: 1680, percentage: 16.8 },
        { stage: 'Shared Trip', count: 504, percentage: 5 }
      ],
      retentionCohort: [
        { week: 'Week 1', retention: 100 },
        { week: 'Week 2', retention: 68 },
        { week: 'Week 3', retention: 52 },
        { week: 'Week 4', retention: 45 },
        { week: 'Week 8', retention: 38 },
        { week: 'Week 12', retention: 32 }
      ],
      performanceMetrics: {
        avgLoadTime: 1.2,
        avgSessionDuration: 8.5,
        bounceRate: 32,
        pagesPerSession: 4.2,
        conversionRate: 24,
        userSatisfaction: 4.6
      }
    });
  };

  const MetricCard = ({ title, value, unit, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="premium-glass p-6 rounded-2xl border border-white/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-bold ${trend > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-3xl font-black text-white mb-1">
        {value}
        {unit && <span className="text-lg text-white/60 ml-1">{unit}</span>}
      </p>
      <p className="text-sm text-white/60">{title}</p>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div>
        <h2 className="text-2xl font-black text-white mb-6">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Avg Load Time"
            value={analytics.performanceMetrics.avgLoadTime}
            unit="sec"
            icon={Zap}
            color="from-yellow-500 to-yellow-600"
            trend={-12}
          />
          <MetricCard
            title="Session Duration"
            value={analytics.performanceMetrics.avgSessionDuration}
            unit="min"
            icon={Clock}
            color="from-blue-500 to-blue-600"
            trend={8}
          />
          <MetricCard
            title="Bounce Rate"
            value={analytics.performanceMetrics.bounceRate}
            unit="%"
            icon={Activity}
            color="from-red-500 to-red-600"
            trend={-5}
          />
          <MetricCard
            title="Pages/Session"
            value={analytics.performanceMetrics.pagesPerSession}
            icon={Globe}
            color="from-green-500 to-green-600"
            trend={15}
          />
          <MetricCard
            title="Conversion Rate"
            value={analytics.performanceMetrics.conversionRate}
            unit="%"
            icon={Target}
            color="from-purple-500 to-purple-600"
            trend={6}
          />
          <MetricCard
            title="User Satisfaction"
            value={analytics.performanceMetrics.userSatisfaction}
            unit="/5"
            icon={Users}
            color="from-pink-500 to-pink-600"
            trend={3}
          />
        </div>
      </div>

      {/* User Behavior & Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Behavior */}
        <div className="premium-glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-black text-white mb-4">User Behavior</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.userBehavior}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="action" stroke="#ffffff60" angle={-20} textAnchor="end" height={80} />
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

        {/* Time Analysis */}
        <div className="premium-glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-black text-white mb-4">Activity by Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.timeAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="hour" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="trips" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Usage Radar */}
      <div className="premium-glass p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-black text-white mb-4">Feature Usage & Satisfaction</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={analytics.featureUsage}>
            <PolarGrid stroke="#ffffff20" />
            <PolarAngleAxis dataKey="feature" stroke="#ffffff60" />
            <PolarRadiusAxis stroke="#ffffff60" />
            <Radar name="Usage %" dataKey="usage" stroke="#FF7A2D" fill="#FF7A2D" fillOpacity={0.6} />
            <Radar name="Satisfaction" dataKey="satisfaction" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Legend />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #ffffff20',
                borderRadius: '8px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel & Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="premium-glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-black text-white mb-4">Conversion Funnel</h3>
          <div className="space-y-4">
            {analytics.conversionFunnel.map((stage, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">{stage.stage}</span>
                  <span className="text-white/60">{stage.count.toLocaleString()} ({stage.percentage}%)</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retention Cohort */}
        <div className="premium-glass p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-black text-white mb-4">User Retention</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.retentionCohort}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="week" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="retention" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="premium-glass p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-black text-white mb-4">💡 Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <p className="text-green-400 font-bold mb-2">✅ Strong Points</p>
            <ul className="text-sm text-white/80 space-y-1">
              <li>• High AI feature adoption (95%)</li>
              <li>• Good user satisfaction (4.6/5)</li>
              <li>• Improving conversion rate (+6%)</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <p className="text-orange-400 font-bold mb-2">⚠️ Areas to Improve</p>
            <ul className="text-sm text-white/80 space-y-1">
              <li>• Increase budget tracker usage (58%)</li>
              <li>• Reduce bounce rate (32%)</li>
              <li>• Improve week 12 retention (32%)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
