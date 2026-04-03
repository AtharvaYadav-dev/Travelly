/**
 * Spatial Soundscapes: Web Audio API Integration
 * Manages ambient noise and high-pass/low-pass filtering based on 'altitude' (scroll progress)
 */
class SoundscapeManager {
  constructor() {
    this.ctx = null;
    this.osc = null;
    this.filter = null;
    this.gain = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Filter setup: BiquadFilterNode
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass'; // Start with beach/underwater vibe
      this.filter.frequency.value = 400; // Low frequency cutoff
      this.filter.Q.value = 1;

      // Noise source: Using a simple oscillator for atmosphere (or can be an AudioBuffer)
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0.02; // Very subtle ambient noise

      // Connection: Filter -> Gain -> Destination
      this.filter.connect(this.gain);
      this.gain.connect(this.ctx.destination);

      console.log('🔊 SoundscapeManager Initialized');
      this.isInitialized = true;
    } catch (e) {
      console.warn('❌ Web Audio not supported or blocked by browser policies', e);
    }
  }

  /**
   * Set Altitude (0 to 1) 
   * Low Altitude (0.0): Underwater/Beach/City - Lowpass filter (Muffled)
   * High Altitude (1.0): Clouds/Mountain - Highpass filter (Crisp/Airy)
   */
  setAltitude(progress) {
    if (!this.isInitialized || !this.filter) return;

    // Smooth transition from Lowpass to Highpass
    // Low progress (Beach) -> 200Hz - 800Hz (Lowpass)
    // High progress (Mountain) -> 12000Hz - 16000Hz (Highpass)
    
    if (progress < 0.5) {
      this.filter.type = 'lowpass';
      this.filter.frequency.setTargetAtTime(
        400 + progress * 800, 
        this.ctx.currentTime, 
        0.1
      );
    } else {
      this.filter.type = 'highpass';
      this.filter.frequency.setTargetAtTime(
        12000 + (progress - 0.5) * 4000, 
        this.ctx.currentTime, 
        0.1
      );
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  stop() {
    if (this.ctx) {
      this.ctx.close();
      this.isInitialized = false;
    }
  }
}

export const soundscape = new SoundscapeManager();
export default soundscape;
