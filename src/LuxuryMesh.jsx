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
      
      {/* 🌌 Refined Professional Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6366F1]/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0D9488]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#4F46E5]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[120px]" />
    </div>
  );
};

export default LuxuryMesh;
