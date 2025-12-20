import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ message = "Synthesizing Experience..." }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b1120] overflow-hidden">

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex flex-col items-center"
      >
        {/* Cinematic Rings */}
        <div className="relative w-48 h-48 mb-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-[2px] border-primary/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-[2px] border-primary/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 border-t-2 border-primary rounded-full"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl italic font-black text-primary"
            >
              CH
            </motion.span>
          </div>
        </div>

        {/* Text Animation */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase mb-4"
          >
            {message}
          </motion.h2>
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,122,45,0.8)]"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Background Noise */}
      <div className="noise-bg opacity-5" />
    </div>
  );
};

export default Loader;
