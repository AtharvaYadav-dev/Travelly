import React, { use, Suspense } from 'react';
import { motion } from 'framer-motion';

/**
 * Orchestrated Micro-Frontends: Itinerary Fragment
 * Uses React 19 'use' API to consume streaming data from promises
 */
const ItineraryFragment = ({ dayPromise, index }) => {
  // If the promise is not resolved, this will suspend the component
  const day = use(dayPromise);

  const containerVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom Apple-style ease
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="group relative bg-[#0A0A0B]/40 backdrop-blur-3xl p-6 md:p-10 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all duration-700 overflow-hidden"
    >
      <div className="flex items-center gap-6 mb-8">
        <span className="text-4xl md:text-5xl font-black text-primary/20 italic">0{index + 1}</span>
        <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">{day.title}</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          {day.items.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="flex gap-6 group/item"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shadow-primary-glow group-hover/item:scale-150 transition-all" />
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">
                  {item.time || "Scheduled"}
                </p>
                <p className="text-base md:text-lg text-white/80 leading-relaxed group-hover/item:text-white transition-all">
                  {item.description || item}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-5 relative rounded-3xl overflow-hidden aspect-video lg:aspect-auto border border-white/5">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={day.image || `https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800`}
            className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2000ms]"
            alt={day.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
};

export default ItineraryFragment;
