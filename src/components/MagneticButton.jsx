import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/**
 * MagneticButton: High-end interaction for the Book Now CTA.
 * Pulls toward cursor within a 50px radius.
 */
const MagneticButton = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for a premium feel
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 🚀 Sovereign Gravity Threshold: 50px
    if (distance < 50) {
      x.set(dx * 0.4);
      y.set(dy * 0.4);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // 📱 Detect Touch Device (No Hover)
  const isTouch = typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches;

  return (
    <motion.div
      ref={ref}
      onMouseMove={!isTouch ? handleMouseMove : undefined}
      onMouseLeave={!isTouch ? handleMouseLeave : undefined}
      style={{ x: springX, y: springY }}
      whileTap={isTouch ? { scale: 0.95, filter: "brightness(1.2)" } : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
