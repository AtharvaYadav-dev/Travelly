import React from 'react';
import { motion } from 'framer-motion';

const LuxuryMesh = () => {
  return (
    <div className="mesh-bg-luxury">
      <motion.div
        animate={{
          x: [0, 200, 0],
          y: [0, -150, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="mesh-blob w-[800px] h-[800px] bg-[var(--gradient-primary)] top-[-20%] left-[-20%] opacity-20"
      />
      <motion.div
        animate={{
          x: [0, -250, 0],
          y: [0, 150, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="mesh-blob w-[700px] h-[700px] bg-[var(--gradient-secondary)] bottom-[-20%] right-[-10%] opacity-15"
      />
      <motion.div
        animate={{
          x: [100, -100, 100],
          y: [100, -100, 100],
          scale: [1, 1.6, 1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        className="mesh-blob w-[600px] h-[600px] bg-[var(--gradient-ocean)] top-[30%] left-[30%] opacity-10"
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[120px]" />
    </div>
  );
};

export default LuxuryMesh;
