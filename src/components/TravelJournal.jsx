import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Star, Image, Download, Share2 } from 'lucide-react';

const TravelJournal = ({ tripId, onClose }) => {
  const [entries, setEntries] = useState([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    rating: 5,
    photos: [],
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadEntries();
  }, [tripId]);

  const loadEntries = () => {
    const saved = localStorage.getItem(`journal_${tripId}`);
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  };

  const saveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    const entry = {
      ...newEntry,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    const updated = [entry, ...entries];
    localStorage.setItem(`journal_${tripId}`, JSON.stringify(updated));
    setEntries(updated);
    setNewEntry({
      title: '',
      content: '',
      rating: 5,
      photos: [],
      date: new Date().toISOString().split('T')[0]
    });
    setShowNewEntry(false);
  };

  const deleteEntry = (id) => {
    if (confirm('Delete this journal entry?')) {
      const updated = entries.filter(e => e.id !== id);
      localStorage.setItem(`journal_${tripId}`, JSON.stringify(updated));
      setEntries(updated);
    }
  };

  const exportJournal = () => {
    const markdown = entries.map(entry => `
# ${entry.title}
**Date:** ${new Date(entry.date).toLocaleDateString()}
**Rating:** ${'⭐'.repeat(entry.rating)}

${entry.content}

---
    `).join('\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travel-journal-${tripId}.md`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="premium-glass max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                📔
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Travel Journal</h2>
                <p className="text-white/80 text-sm">Document your journey</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {entries.length > 0 && (
                <>
                  <button
                    onClick={exportJournal}
                    className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    onClick={() => setShowNewEntry(true)}
                    className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    New Entry
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* New Entry Form */}
          <AnimatePresence>
            {showNewEntry && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 premium-glass p-6 rounded-2xl border border-white/10"
              >
                <h3 className="text-white font-bold mb-4">New Journal Entry</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Title</label>
                    <input
                      type="text"
                      value={newEntry.title}
                      onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                      placeholder="e.g., Day at the Eiffel Tower"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Date</label>
                    <input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setNewEntry({ ...newEntry, rating })}
                          className="text-3xl transition-all"
                        >
                          <Star
                            className={`w-8 h-8 ${rating <= newEntry.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-white/20'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-white/60 text-sm mb-2 block">Your Experience</label>
                    <textarea
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                      placeholder="Write about your experience..."
                      rows={6}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowNewEntry(false)}
                      className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEntry}
                      className="flex-1 py-3 rounded-lg bg-primary hover:bg-primary/80 text-white font-bold transition-all"
                    >
                      Save Entry
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Entries List */}
          {entries.length === 0 && !showNewEntry ? (
            <div className="text-center py-12 text-white/40">
              <div className="text-6xl mb-4">📔</div>
              <p className="mb-4">No journal entries yet</p>
              <button
                onClick={() => setShowNewEntry(true)}
                className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 text-white font-bold transition-all"
              >
                Create First Entry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="premium-glass p-6 rounded-2xl border border-white/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-white mb-2">{entry.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                        <div className="flex">
                          {[...Array(entry.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-white/80 whitespace-pre-wrap">{entry.content}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TravelJournal;
