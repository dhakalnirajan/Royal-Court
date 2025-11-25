import { SoundEffectType } from '../types';

class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  
  private volumes = {
    master: 0.5,
    sfx: 1.0,
    music: 0.5
  };

  constructor() {
    // Initialize lazily on first user interaction to comply with browser policies
    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => this.init(), { once: true });
    }
  }

  private init() {
    if (this.context) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.context = new AudioContextClass();
    
    // Master Gain
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    
    // SFX Gain (connected to Master)
    this.sfxGain = this.context.createGain();
    this.sfxGain.connect(this.masterGain);
    
    // Music Gain (connected to Master)
    this.musicGain = this.context.createGain();
    this.musicGain.connect(this.masterGain);

    this.updateVolumes();
  }

  public setVolumes(master: number, sfx: number, music: number) {
    this.volumes = { master, sfx, music };
    this.updateVolumes();
  }

  private updateVolumes() {
    if (!this.context || !this.masterGain || !this.sfxGain || !this.musicGain) return;
    
    const now = this.context.currentTime;
    this.masterGain.gain.setTargetAtTime(this.volumes.master, now, 0.1);
    this.sfxGain.gain.setTargetAtTime(this.volumes.sfx, now, 0.1);
    this.musicGain.gain.setTargetAtTime(this.volumes.music, now, 0.1);
  }

  public play(type: SoundEffectType) {
    if (!this.context || !this.masterGain || !this.sfxGain) return;
    
    // Resume context if suspended
    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    const t = this.context.currentTime;
    const osc = this.context.createOscillator();
    const noteGain = this.context.createGain();

    // Connect to SFX bus
    osc.connect(noteGain);
    noteGain.connect(this.sfxGain);

    switch (type) {
      case 'CARD_FLIP':
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);
        noteGain.gain.setValueAtTime(0.3, t);
        noteGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case 'CLICK':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, t);
        noteGain.gain.setValueAtTime(0.1, t);
        noteGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
        break;

      case 'SUCCESS':
        // Major Arpeggio
        this.playNote(523.25, t, 0.2); // C5
        this.playNote(659.25, t + 0.1, 0.2); // E5
        this.playNote(783.99, t + 0.2, 0.4); // G5
        break;

      case 'FAILURE':
        // Dissonant Cluster
        this.playNote(100, t, 0.5, 'sawtooth');
        this.playNote(106, t, 0.5, 'sawtooth'); // Minor 2nd clash
        break;

      case 'GAME_START':
        // Rising sweep
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.5);
        noteGain.gain.setValueAtTime(0.1, t);
        noteGain.gain.linearRampToValueAtTime(0.3, t + 0.3);
        noteGain.gain.linearRampToValueAtTime(0, t + 0.5);
        osc.start(t);
        osc.stop(t + 0.5);
        break;

      case 'ROUND_END':
         // Chime
         osc.type = 'sine';
         osc.frequency.setValueAtTime(880, t);
         noteGain.gain.setValueAtTime(0.4, t);
         noteGain.gain.exponentialRampToValueAtTime(0.01, t + 1);
         osc.start(t);
         osc.stop(t + 1);
         break;
    }
  }

  private playNote(freq: number, time: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.context || !this.sfxGain) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
    
    osc.start(time);
    osc.stop(time + duration);
  }
}

export const audioManager = new AudioManager();
