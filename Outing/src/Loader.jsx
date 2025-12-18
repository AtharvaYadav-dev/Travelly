import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ message = "Architecting Reality..." }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="mesh-bg" />
      </div>

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
            className="absolute inset-0 border-[2px] border-indigo-500/20 rounded-[3rem]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-[2px] border-fuchsia-500/20 rounded-[2.5rem]"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 border-t-2 border-indigo-500 rounded-[2rem]"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              🧠
            </motion.span>
          </div>
        </div>

        {/* Text Animation */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-4 animate-reveal"
          >
            {message}
          </motion.h2>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-indigo-500"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Decorative Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20" />
    </div>
  );
};

export default Loader;
