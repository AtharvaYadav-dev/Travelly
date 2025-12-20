import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Folder, FolderPlus, Calendar, MapPin, DollarSign, Tag, X } from 'lucide-react';

const SmartFolders = ({ trips, onFolderChange }) => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [customFolders, setCustomFolders] = useState([]);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#FF7A2D');

  useEffect(() => {
    categorizeTrips();
    loadCustomFolders();
  }, [trips]);

  const categorizeTrips = () => {
    const now = new Date();
    const upcoming = trips.filter(trip => {
      const tripDate = new Date(trip.startDate || trip.createdAt);
      return tripDate > now;
    });

    const past = trips.filter(trip => {
      const tripDate = new Date(trip.startDate || trip.createdAt);
      return tripDate <= now && trip.completed;
    });

    const wishlist = trips.filter(trip => trip.wishlist || !trip.startDate);
    const archived = trips.filter(trip => trip.archived);

    const budgetCategories = {
      luxury: trips.filter(t => t.budget > 5000),
      comfort: trips.filter(t => t.budget >= 2000 && t.budget <= 5000),
      budget: trips.filter(t => t.budget < 2000)
    };

    const continents = {
      europe: trips.filter(t => isInContinent(t.location, 'Europe')),
      asia: trips.filter(t => isInContinent(t.location, 'Asia')),
      americas: trips.filter(t => isInContinent(t.location, 'Americas')),
      africa: trips.filter(t => isInContinent(t.location, 'Africa')),
      oceania: trips.filter(t => isInContinent(t.location, 'Oceania'))
    };

    setFolders([
      { id: 'all', name: 'All Trips', icon: Folder, count: trips.length, color: '#6b7280' },
      { id: 'upcoming', name: 'Upcoming', icon: Calendar, count: upcoming.length, color: '#3b82f6' },
      { id: 'past', name: 'Past Trips', icon: Calendar, count: past.length, color: '#8b5cf6' },
      { id: 'wishlist', name: 'Wishlist', icon: MapPin, count: wishlist.length, color: '#f59e0b' },
      { id: 'archived', name: 'Archived', icon: Folder, count: archived.length, color: '#6b7280' },
      { id: 'luxury', name: 'Luxury ($5k+)', icon: DollarSign, count: budgetCategories.luxury.length, color: '#10b981' },
      { id: 'comfort', name: 'Comfort ($2-5k)', icon: DollarSign, count: budgetCategories.comfort.length, color: '#3b82f6' },
      { id: 'budget', name: 'Budget (<$2k)', icon: DollarSign, count: budgetCategories.budget.length, color: '#f59e0b' },
      { id: 'europe', name: 'Europe', icon: MapPin, count: continents.europe.length, color: '#3b82f6' },
      { id: 'asia', name: 'Asia', icon: MapPin, count: continents.asia.length, color: '#f59e0b' },
      { id: 'americas', name: 'Americas', icon: MapPin, count: continents.americas.length, color: '#10b981' },
    ]);
  };

  const isInContinent = (location, continent) => {
    const continentMap = {
      'Europe': ['France', 'Italy', 'Spain', 'Germany', 'UK', 'Greece', 'Portugal'],
      'Asia': ['Japan', 'China', 'Thailand', 'India', 'Vietnam', 'Indonesia', 'Korea'],
      'Americas': ['USA', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Peru'],
      'Africa': ['Egypt', 'Kenya', 'South Africa', 'Morocco', 'Tanzania'],
      'Oceania': ['Australia', 'New Zealand', 'Fiji']
    };

    return continentMap[continent]?.some(country =>
      location?.toLowerCase().includes(country.toLowerCase())
    );
  };

  const loadCustomFolders = () => {
    const saved = localStorage.getItem('customFolders');
    if (saved) {
      setCustomFolders(JSON.parse(saved));
    }
  };

  const createCustomFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder = {
      id: `custom_${Date.now()}`,
      name: newFolderName,
      icon: Tag,
      count: 0,
      color: newFolderColor,
      custom: true,
      tripIds: []
    };

    const updated = [...customFolders, newFolder];
    setCustomFolders(updated);
    localStorage.setItem('customFolders', JSON.stringify(updated));

    setNewFolderName('');
    setShowNewFolder(false);
  };

  const deleteCustomFolder = (folderId) => {
    const updated = customFolders.filter(f => f.id !== folderId);
    setCustomFolders(updated);
    localStorage.setItem('customFolders', JSON.stringify(updated));
  };

  const allFolders = [...folders, ...customFolders];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Folder className="w-6 h-6 text-primary" />
          Smart Folders
        </h3>
        <button
          onClick={() => setShowNewFolder(!showNewFolder)}
          className="px-4 py-2 rounded-full bg-primary/20 hover:bg-primary/30 text-primary font-bold text-sm flex items-center gap-2 transition-all"
        >
          <FolderPlus className="w-4 h-4" />
          New Folder
        </button>
      </div>

      {/* Create New Folder */}
      {showNewFolder && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="premium-glass p-4 rounded-xl border border-white/10 mb-4"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50"
            />
            <input
              type="color"
              value={newFolderColor}
              onChange={(e) => setNewFolderColor(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer"
            />
            <button
              onClick={createCustomFolder}
              className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white font-bold transition-all"
            >
              Create
            </button>
          </div>
        </motion.div>
      )}

      {/* Folders Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {allFolders.map((folder) => {
          const Icon = folder.icon;
          const isSelected = selectedFolder === folder.id;

          return (
            <motion.button
              key={folder.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedFolder(folder.id);
                onFolderChange?.(folder.id);
              }}
              className={`premium-glass p-4 rounded-xl border transition-all text-left relative ${isSelected
                  ? 'border-primary/50 bg-primary/10'
                  : 'border-white/10 hover:border-white/20'
                }`}
            >
              {folder.custom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCustomFolder(folder.id);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-all"
                >
                  <X className="w-3 h-3 text-red-400" />
                </button>
              )}

              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${folder.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: folder.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">{folder.name}</p>
                  <p className="text-white/60 text-xs">{folder.count} trips</p>
                </div>
              </div>

              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-b-xl" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Active Filter Info */}
      {selectedFolder !== 'all' && (
        <div className="premium-glass p-4 rounded-xl border border-primary/30 bg-primary/5">
          <p className="text-white/80 text-sm">
            Showing: <span className="font-bold text-primary">
              {allFolders.find(f => f.id === selectedFolder)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartFolders;
