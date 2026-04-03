import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * useAuraMesh: Sovereign Canvas Gradient Engine
 * Morphs 3-4 colored blobs based on the dominant Aura color.
 */
export const useAuraMesh = (canvasRef, dominantColor) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const blobs = [
      { x: 0.2, y: 0.2, r: 0.4, vx: 0.001, vy: 0.0015 },
      { x: 0.8, y: 0.3, r: 0.5, vx: -0.0012, vy: 0.0008 },
      { x: 0.3, y: 0.7, r: 0.45, vx: 0.0015, vy: -0.001 },
      { x: 0.7, y: 0.8, r: 0.35, vx: -0.0009, vy: 0.0012 }
    ];

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      blobs.forEach((blob, i) => {
        // Update positions
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce
        if (blob.x < 0 || blob.x > 1) blob.vx *= -1;
        if (blob.y < 0 || blob.y > 1) blob.vy *= -1;

        const gradient = ctx.createRadialGradient(
          blob.x * width, blob.y * height, 0,
          blob.x * width, blob.y * height, blob.r * Math.max(width, height)
        );

        const color = i === 0 ? dominantColor : '#000000';
        gradient.addColorStop(0, `${color}44`); // 44 is hex alpha
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dominantColor]);
};
