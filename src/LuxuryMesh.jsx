import React from 'react';
import { motion } from 'framer-motion';

const LuxuryMesh = () => {
  return (
    <div className="mesh-bg-luxury">
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="mesh-blob mesh-1"
      />
      <motion.div
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="mesh-blob mesh-2"
        style={{ right: '10%', bottom: '10%' }}
      />
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[100px]" />
    </div>
  );
};

export default LuxuryMesh;
