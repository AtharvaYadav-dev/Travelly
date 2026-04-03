import { useMemo } from 'react';

/**
 * The Aura Engine: Biometric UI Hook
 * Shifts GSAP and CSS properties based on destination 'energy level'
 */
export const useAura = (destinationType = 'low-frequency') => {
  const aura = useMemo(() => {
    const configs = {
      'high-frequency': { // Tokyo, NYC, Mumbai
        gsap: {
          ease: "expo.out",
          duration: 0.4,
          stagger: 0.05
        },
        tailwind: {
          accent: "text-rose-500",
          bg: "bg-rose-500/10",
          glow: "shadow-[0_0_20px_rgba(244,63,94,0.4)]",
          animation: "animate-pulse"
        },
        vibe: "staccato"
      },
      'low-frequency': { // Bali, Swiss Alps, Kerala
        gsap: {
          ease: "sine.inOut",
          duration: 1.5,
          stagger: 0.2
        },
        tailwind: {
          accent: "text-emerald-400",
          bg: "bg-emerald-400/10",
          glow: "shadow-[0_0_20px_rgba(52,211,153,0.2)]",
          animation: "animate-float"
        },
        vibe: "fluid"
      },
      'royal': { // Rajasthan, Palace stays
        gsap: {
          ease: "power4.inOut",
          duration: 1.0,
          stagger: 0.1
        },
        tailwind: {
          accent: "text-amber-400",
          bg: "bg-amber-400/10",
          glow: "shadow-[0_0_30px_rgba(251,191,36,0.3)]",
          animation: "animate-shimmer"
        },
        vibe: "grand"
      }
    };

    return configs[destinationType] || configs['low-frequency'];
  }, [destinationType]);

  return aura;
};
