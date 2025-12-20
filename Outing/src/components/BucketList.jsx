import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Star, MapPin, DollarSign, Bell } from 'lucide-react';

const BucketList = ({ userId, onClose }) => {
  const [bucketList, setBucketList] = useState([]);
  const [newDestination, setNewDestination] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newPriority, setNewPriority] = useState(3);

  useEffect(() => {
    loadBucketList();
  }, [userId]);

  const loadBucketList = () => {
    const saved = localStorage.getItem(`bucketList_${userId || 'guest'}`);
    if (saved) {
      setBucketList(JSON.parse(saved));
    }
  };

  const saveBucketList = (list) => {
    localStorage.setItem(`bucketList_${userId || 'guest'}`, JSON.stringify(list));
    setBucketList(list);
  };

  const addDestination = () => {
    if (!newDestination.trim()) return;

    const newItem = {
      id: Date.now(),
      destination: newDestination,
      budget: newBudget || 'TBD',
      priority: newPriority,
      added: new Date().toISOString(),
      completed: false
    };

    saveBucketList([...bucketList, newItem]);
    setNewDestination('');
    setNewBudget('');
    setNewPriority(3);
  };

  const removeDestination = (id) => {
    saveBucketList(bucketList.filter(item => item.id !== id));
  };

  const toggleComplete = (id) => {
    saveBucketList(
      bucketList.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const setPriceAlert = (destination) => {
    alert(`Price alert set for ${destination}! You'll be notified when prices drop.`);
  };

  const sortedList = [...bucketList].sort((a, b) => a.priority - b.priority);

  const getPriorityColor = (priority) => {
    if (priority === 1) return 'text-red-400 border-red-400/30 bg-red-400/10';
    if (priority === 2) return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
    if (priority === 3) return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    if (priority === 4) return 'text-green-400 border-green-400/30 bg-green-400/10';
    return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
  };

  const getPriorityLabel = (priority) => {
    const labels = ['', 'Must Do!', 'High', 'Medium', 'Low', 'Someday'];
    return labels[priority];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="premium-glass max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                🎯
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  Travel Bucket List
                </h2>
                <p className="text-white/80 text-sm">
                  Dream destinations you want to visit
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

        {/* Add New */}
        <div className="p-6 border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <input
                type="text"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addDestination()}
                placeholder="Destination (e.g., Bali, Indonesia)"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="md:col-span-3">
              <input
                type="text"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                placeholder="Budget (optional)"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="md:col-span-3">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(parseInt(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50"
              >
                <option value={1}>Must Do!</option>
                <option value={2}>High Priority</option>
                <option value={3}>Medium</option>
                <option value={4}>Low</option>
                <option value={5}>Someday</option>
              </select>
            </div>
            <div className="md:col-span-1">
              <button
                onClick={addDestination}
                className="w-full h-full bg-primary hover:bg-primary/80 rounded-lg flex items-center justify-center transition-all"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-350px)]">
          {sortedList.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No destinations yet. Start adding your dream places!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {sortedList.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    className={`premium-glass p-4 rounded-xl border transition-all ${item.completed
                        ? 'opacity-60 border-green-500/30 bg-green-500/5'
                        : 'border-white/10'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-white/30 hover:border-primary'
                          }`}
                      >
                        {item.completed && <span className="text-white text-xs">✓</span>}
                      </button>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className={`text-lg font-bold ${item.completed ? 'text-white/60 line-through' : 'text-white'
                              }`}>
                              {item.destination}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              {item.budget !== 'TBD' && (
                                <span className="text-sm text-white/60 flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {item.budget}
                                </span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(item.priority)}`}>
                                <Star className="w-3 h-3 inline mr-1" />
                                {getPriorityLabel(item.priority)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPriceAlert(item.destination)}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                              title="Set price alert"
                            >
                              <Bell className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => removeDestination(item.id)}
                              className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-white/40">
                          Added {new Date(item.added).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="p-6 bg-slate-900/50 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-black text-white">{bucketList.length}</div>
              <div className="text-xs text-white/60">Total Destinations</div>
            </div>
            <div>
              <div className="text-2xl font-black text-green-400">
                {bucketList.filter(i => i.completed).length}
              </div>
              <div className="text-xs text-white/60">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-black text-primary">
                {bucketList.filter(i => !i.completed).length}
              </div>
              <div className="text-xs text-white/60">To Visit</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BucketList;
