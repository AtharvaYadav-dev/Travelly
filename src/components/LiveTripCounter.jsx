import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const LiveTripCounter = () => {
  const [count, setCount] = useState(1247);
  const [todayCount, setTodayCount] = useState(23);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTodayCount(prev => prev + Math.floor(Math.random() * 3));
      setCount(prev => prev + Math.floor(Math.random() * 3));

      setTimeout(() => setIsAnimating(false), 500);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="premium-glass p-8 rounded-2xl border border-white/10">
      <div className="text-center">
        <p className="text-white/60 text-sm uppercase tracking-wider mb-2">
          🌍 Trips Planned Worldwide
        </p>
        <motion.div
          key={count}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-black bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent mb-4"
        >
          {count.toLocaleString()}+
        </motion.div>
        <div className="flex items-center justify-center gap-2 text-green-400">
          <motion.span
            animate={{ scale: isAnimating ? [1, 1.2, 1] : 1 }}
            className="w-2 h-2 rounded-full bg-green-400"
          />
          <span className="text-sm font-bold">
            {todayCount} trips planned today
          </span>
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default LiveTripCounter;
