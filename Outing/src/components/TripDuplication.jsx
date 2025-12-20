import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const TripDuplication = ({ trip, onDuplicate }) => {
  const [copied, setCopied] = useState(false);

  const duplicateTrip = () => {
    const duplicated = {
      ...trip,
      id: Date.now(),
      title: `${trip.title} (Copy)`,
      createdAt: new Date().toISOString(),
      duplicatedFrom: trip.id
    };

    onDuplicate?.(duplicated);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={duplicateTrip}
      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-2 transition-all"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-green-400">Duplicated!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Duplicate Trip
        </>
      )}
    </button>
  );
};

export default TripDuplication;
