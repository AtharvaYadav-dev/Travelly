import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, History, GitBranch, RotateCcw } from 'lucide-react';

const TripVersioning = ({ tripId, tripData, onClose, onRestore }) => {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    loadVersions();
  }, [tripId]);

  const loadVersions = () => {
    const saved = localStorage.getItem(`trip_versions_${tripId}`);
    if (saved) {
      setVersions(JSON.parse(saved));
    }
  };

  const saveNewVersion = () => {
    const newVersion = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      data: tripData,
      note: `Version ${versions.length + 1}`,
      changes: calculateChanges(versions[0]?.data, tripData)
    };

    const updated = [newVersion, ...versions].slice(0, 10); // Keep last 10 versions
    localStorage.setItem(`trip_versions_${tripId}`, JSON.stringify(updated));
    setVersions(updated);
  };

  const calculateChanges = (oldData, newData) => {
    if (!oldData) return ['Initial version'];

    const changes = [];
    if (oldData.location !== newData.location) changes.push(`Location: ${oldData.location} → ${newData.location}`);
    if (oldData.budget !== newData.budget) changes.push(`Budget: $${oldData.budget} → $${newData.budget}`);
    if (oldData.duration !== newData.duration) changes.push(`Duration: ${oldData.duration} → ${newData.duration} days`);
    if (oldData.participants !== newData.participants) changes.push(`Travelers: ${oldData.participants} → ${newData.participants}`);

    return changes.length > 0 ? changes : ['No changes'];
  };

  const restoreVersion = (version) => {
    if (confirm('Restore this version? Current changes will be saved as a new version.')) {
      saveNewVersion(); // Save current as version first
      onRestore?.(version.data);
      onClose();
    }
  };

  const compareVersions = (v1, v2) => {
    setSelectedVersion({ v1, v2 });
    setShowDiff(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="premium-glass max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-3xl border border-white/10"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GitBranch className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-black text-white">Trip Versions</h2>
                <p className="text-white/80 text-sm">Track and restore previous versions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={saveNewVersion}
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                Save Version
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Versions List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {versions.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No versions saved yet. Click "Save Version" to create one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, i) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="premium-glass p-6 rounded-xl border border-white/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                          Version {versions.length - i}
                        </span>
                        {i === 0 && (
                          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-white/60 text-sm">
                        {new Date(version.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {i > 0 && (
                      <button
                        onClick={() => restoreVersion(version)}
                        className="px-4 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary font-bold flex items-center gap-2 transition-all"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Restore
                      </button>
                    )}
                  </div>

                  {/* Changes */}
                  <div className="space-y-2">
                    <p className="text-white font-bold text-sm mb-2">Changes:</p>
                    {version.changes.map((change, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-white/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {change}
                      </div>
                    ))}
                  </div>

                  {/* Trip Details */}
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-xs text-white/60 mb-1">Location</p>
                      <p className="text-white font-bold text-sm">{version.data.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-1">Budget</p>
                      <p className="text-white font-bold text-sm">${version.data.budget}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-1">Duration</p>
                      <p className="text-white font-bold text-sm">{version.data.duration}d</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-1">Travelers</p>
                      <p className="text-white font-bold text-sm">{version.data.participants}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TripVersioning;
