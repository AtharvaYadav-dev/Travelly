import { useEffect, useRef } from 'react';

/**
 * Ghost Cursor Logic: Predictive Mouse Trajectory
 * Predicts which destination or CTA the user is about to click.
 */
export const useGhostCursor = (targets, onPredict) => {
  const lastPos = useRef({ x: 0, y: 0, t: performance.now() });
  const predictedTargetId = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = performance.now();
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dt = now - lastPos.current.t;

      if (dt === 0) return;

      const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
      const angle = Math.atan2(dy, dx);

      // Cast a ray 400px ahead based on current velocity and angle
      // Velocity factor: higher speed = longer prediction ray
      const rayLength = Math.max(100, velocity * 150); 
      const predictX = e.clientX + Math.cos(angle) * rayLength;
      const predictY = e.clientY + Math.sin(angle) * rayLength;

      targets.forEach((target) => {
        if (!target.ref?.current) return;

        const rect = target.ref.current.getBoundingClientRect();
        
        // Check if the predicted ray intersects with the target bounds
        const isHeadingToward = 
          predictX > rect.left && predictX < rect.right &&
          predictY > rect.top && predictY < rect.bottom;

        if (isHeadingToward && velocity > 0.8) {
          if (predictedTargetId.current !== target.id) {
            predictedTargetId.current = target.id;
            console.log(`🎯 Ghost Cursor Predicts: ${target.id}`);
            onPredict(target.id);
          }
        }
      });

      lastPos.current = { x: e.clientX, y: e.clientY, t: now };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [targets, onPredict]);

  return { predictedTargetId: predictedTargetId.current };
};
