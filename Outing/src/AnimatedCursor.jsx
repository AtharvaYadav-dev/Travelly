import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const AnimatedCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the outer ring
  const springConfig = { damping: 25, stiffness: 200 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Check if hovering over clickable elements
    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer');
      setIsHovering(isClickable);
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* 📍 Main Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: mouseX,
          top: mouseY,
          width: 8,
          height: 8,
          backgroundColor: '#d4af37',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999999,
          translateX: '-50%',
          translateY: '-50%',
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.8)',
        }}
        animate={{
          scale: isClicking ? 0.5 : (isHovering ? 1.5 : 1),
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* 💍 Luxury Outer Ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: ringX,
          top: ringY,
          width: 40,
          height: 40,
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999998,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 1.8 : (isHovering ? 2.2 : 1),
          backgroundColor: isHovering ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
          borderColor: isClicking ? 'rgba(212, 175, 55, 0.8)' : (isHovering ? 'rgba(212, 175, 55, 0.6)' : 'rgba(212, 175, 55, 0.3)'),
        }}
      />
    </>
  );
};

export default AnimatedCursor;
