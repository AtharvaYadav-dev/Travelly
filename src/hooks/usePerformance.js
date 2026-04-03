import { useEffect, useState } from 'react';

/**
 * usePerformance: Sovereign Performance Sharding Engine
 * Detects low-power devices and toggles 'low-power-mode' class.
 */
export const usePerformance = () => {
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // 1. Check Hardware
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4; // in GB

    // 2. Performance Threshold
    const lowPower = cores < 4 || memory < 4;
    
    if (lowPower) {
      console.warn("📉 Sovereign: Low-power device detected. Sharding UI for performance.");
      document.documentElement.classList.add('low-power-mode');
      setIsLowPower(true);
    } else {
      document.documentElement.classList.remove('low-power-mode');
      setIsLowPower(false);
    }
  }, []);

  return { isLowPower };
};
