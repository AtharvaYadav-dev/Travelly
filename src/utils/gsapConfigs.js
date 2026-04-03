/**
 * GSAP Configurations for Antigravity Design
 * Floating, cinematic, and weightless animation presets
 */
export const ANTIGRAVITY_FLOAT = {
  y: "-15px",
  rotationZ: 1.5,
  duration: 3.5,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
  stagger: {
    each: 0.8,
    from: "random"
  }
};

export const CINEMATIC_REVEAL = {
  y: 100,
  opacity: 0,
  rotateX: 45,
  transformOrigin: "0% 50% -50",
  duration: 1.8,
  stagger: 0.15,
  ease: "power4.out"
};

export const STACCATO_REVEAL = {
  scale: 0.8,
  opacity: 0,
  duration: 0.4,
  stagger: 0.05,
  ease: "expo.out"
};
