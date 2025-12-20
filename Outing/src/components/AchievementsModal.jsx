import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock, Star } from 'lucide-react';
import { achievements, categories, getTotalPoints, getUserLevel } from '../utils/achievementSystem';

const AchievementsModal = ({ userId, onClose }) => {
  const [userProgress, setUserProgress] = useState({ unlocked: [] });
  const [totalPoints, setTotalPoints] = useState(0);
  const [userLevel, setUserLevel] = useState({ level: 'Beginner', icon: '🌱', color: '#10b981' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProgress();
  }, [userId]);

  const loadProgress = () => {
    const stored = localStorage.getItem(`achievements_${userId || 'guest'}`);
    const progress = stored ? JSON.parse(stored) : { unlocked: [] };
    setUserProgress(progress);

    const points = getTotalPoints(userId || 'guest');
    setTotalPoints(points);
    setUserLevel(getUserLevel(points));
  };

  const isUnlocked = (achievementId) => {
    return userProgress.unlocked?.includes(achievementId);
  };

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return isUnlocked(a.id);
    if (filter === 'locked') return !isUnlocked(a.id);
    return a.category === filter;
  });

  const unlockedCount = achievements.filter(a => isUnlocked(a.id)).length;
  const progress = (unlockedCount / achievements.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="premium-glass max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  Achievements
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  Track your travel planning journey
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xs text-white/80 uppercase tracking-wider mb-1">Level</p>
              <p className="text-2xl font-black text-white flex items-center gap-2">
                <span>{userLevel.icon}</span>
                {userLevel.level}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xs text-white/80 uppercase tracking-wider mb-1">Total Points</p>
              <p className="text-2xl font-black text-white">
                {totalPoints}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xs text-white/80 uppercase tracking-wider mb-1">Unlocked</p>
              <p className="text-2xl font-black text-white">
                {unlockedCount}/{achievements.length}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/80 mb-2">
              <span>Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === 'unlocked'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
            >
              Unlocked
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === 'locked'
                  ? 'bg-gray-600 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
            >
              Locked
            </button>
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === key
                    ? 'text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                style={filter === key ? { backgroundColor: cat.color } : {}}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-400px)] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => {
              const unlocked = isUnlocked(achievement.id);
              const category = categories[achievement.category];

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`premium-glass p-6 rounded-2xl border transition-all ${unlocked
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-white/10 opacity-60'
                    }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-4xl relative">
                      {achievement.icon}
                      {!unlocked && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {achievement.points} pts
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-white/60 mb-4">
                    {achievement.description}
                  </p>

                  {unlocked ? (
                    <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      Unlocked!
                    </div>
                  ) : (
                    <div className="text-xs text-white/40">
                      Keep exploring to unlock
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900/50 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-full bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-wider transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AchievementsModal;
