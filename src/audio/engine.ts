/**
 * Procedural Web Audio engine.
 * Generates an ambient drone pad + UI SFX entirely from oscillators — no asset files.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private ambientNodes: AudioNode[] = [];
  private lfo: OscillatorNode | null = null;
  private started = false;
  private _enabled = true;
  private _volume = 0.6;

  get isStarted() {
    return this.started;
  }

  get enabled() {
    return this._enabled;
  }

  get volume() {
    return this._volume;
  }

  /** Must be called from a user gesture (Enter click). */
  async unlock() {
    if (this.started) {
      if (this.ctx?.state === 'suspended') await this.ctx.resume();
      return;
    }
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.ctx = new Ctx();
    await this.ctx.resume();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this._enabled ? this._volume : 0;
    this.masterGain.connect(this.ctx.destination);

    // Procedural reverb impulse
    this.convolver = this.ctx.createConvolver();
    this.convolver.buffer = this.makeImpulse(3.2, 2.4);
    const reverbGain = this.ctx.createGain();
    reverbGain.gain.value = 0.35;
    this.convolver.connect(reverbGain);
    reverbGain.connect(this.masterGain);

    // Ambient bus + SFX bus
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0;
    this.ambientGain.connect(this.masterGain);
    this.ambientGain.connect(this.convolver);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.9;
    this.sfxGain.connect(this.masterGain);
    this.sfxGain.connect(this.convolver);

    this.startAmbient();
    this.started = true;
  }

  /** Build a noise-decay impulse response for the convolver reverb. */
  private makeImpulse(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const length = Math.max(1, Math.floor(rate * seconds));
    const impulse = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return impulse;
  }

  /** Layered detuned drone — a slow, evolving ambient pad. */
  private startAmbient() {
    const ctx = this.ctx!;
    // Root notes: A1, E2, A2 (open fifth-ish drone), low and warm.
    const freqs = [55, 82.41, 110, 164.81];

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      // gentle detune drift
      osc.detune.value = (Math.random() - 0.5) * 8;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600 + i * 120;
      filter.Q.value = 0.7;

      const gain = ctx.createGain();
      gain.gain.value = 0.12 / (i + 1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain!);
      osc.start();
      this.ambientNodes.push(osc, filter, gain);
    });

    // Slow amplitude LFO for breathing pad
    this.lfo = ctx.createOscillator();
    this.lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.06;
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.ambientGain!.gain);
    this.lfo.start();
    this.ambientNodes.push(this.lfo, lfoGain);

    // Fade ambient in
    this.ambientGain!.gain.setValueAtTime(0, ctx.currentTime);
    this.ambientGain!.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 4);
  }

  setEnabled(enabled: boolean) {
    this._enabled = enabled;
    if (!this.ctx || !this.masterGain) return;
    const target = enabled ? this._volume : 0;
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.6);
  }

  setVolume(volume: number) {
    this._volume = volume;
    if (!this._enabled) return;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.3);
    }
  }

  /** Short sine blip for hover. */
  playHover() {
    if (!this.ctx || !this._enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(g);
    g.connect(this.sfxGain!);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  /** Noise + pitch drop for click — punchy UI confirm. */
  playClick() {
    if (!this.ctx || !this._enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // Tonal component
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(660, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.18);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(0.2, t + 0.008);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    osc.connect(og);
    og.connect(this.sfxGain!);
    osc.start(t);
    osc.stop(t + 0.28);

    // Noise transient
    const noise = ctx.createBufferSource();
    noise.buffer = this.makeNoiseBuffer(0.12);
    const nf = ctx.createBiquadFilter();
    nf.type = 'highpass';
    nf.frequency.value = 1800;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.15, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    noise.connect(nf);
    nf.connect(ng);
    ng.connect(this.sfxGain!);
    noise.start(t);
  }

  /** Filter sweep for section transitions. */
  playTransition(direction: 'up' | 'down' = 'up') {
    if (!this.ctx || !this._enabled) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const start = direction === 'up' ? 180 : 900;
    const end = direction === 'up' ? 900 : 180;
    osc.frequency.setValueAtTime(start, t);
    osc.frequency.exponentialRampToValueAtTime(end, t + 0.5);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 6;
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.5);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.1, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.sfxGain!);
    osc.start(t);
    osc.stop(t + 0.65);
  }

  private makeNoiseBuffer(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  dispose() {
    this.ambientNodes.forEach((n) => {
      try {
        'stop' in n && (n as OscillatorNode).stop?.();
      } catch {
        /* noop */
      }
      try {
        n.disconnect();
      } catch {
        /* noop */
      }
    });
    this.ambientNodes = [];
    try {
      this.ctx?.close();
    } catch {
      /* noop */
    }
    this.ctx = null;
    this.started = false;
  }
}

// Singleton — browser only.
export const audioEngine =
  typeof window !== 'undefined' ? new AudioEngine() : (null as unknown as AudioEngine);
