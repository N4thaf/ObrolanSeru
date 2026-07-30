// Web Audio API Zero-Latency Cached AudioBuffer Synthesizer for ObrolanSeru

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private isWarmedUp: boolean = false;
  private buffers: Record<string, AudioBuffer> = {};

  constructor() {
    if (typeof window !== "undefined") {
      const initAudio = () => {
        this.warmup();
      };
      window.addEventListener("pointerdown", initAudio, { passive: true });
      window.addEventListener("touchstart", initAudio, { passive: true });
      window.addEventListener("click", initAudio, { passive: true });
    }
  }

  private warmup() {
    if (typeof window === "undefined") return;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx({ latencyHint: "interactive" });
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      if (this.ctx && !this.isWarmedUp) {
        this.isWarmedUp = true;
        // Pre-render PCM AudioBuffers for 0ms instant playback
        this.generateBuffers(this.ctx);
        // Play 1-frame silent buffer to unlock iOS Safari hardware audio output bus
        const silent = this.ctx.createBuffer(1, 1, 22050);
        const src = this.ctx.createBufferSource();
        src.buffer = silent;
        src.connect(this.ctx.destination);
        src.start(0);
      }
    } catch {
      // Ignore
    }
  }

  private generateBuffers(ctx: AudioContext) {
    const sampleRate = ctx.sampleRate || 44100;

    // 1. Click Sound Buffer (0.03s Crisp Pop)
    const clickLen = Math.floor(sampleRate * 0.035);
    const clickBuf = ctx.createBuffer(1, clickLen, sampleRate);
    const clickData = clickBuf.getChannelData(0);
    for (let i = 0; i < clickLen; i++) {
      const t = i / sampleRate;
      const freq = 650 * Math.exp(-t * 50);
      const env = Math.exp(-t * 70);
      clickData[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.35;
    }
    this.buffers["click"] = clickBuf;

    // 2. Flip Sound Buffer (0.06s Warm Card Snap)
    const flipLen = Math.floor(sampleRate * 0.07);
    const flipBuf = ctx.createBuffer(1, flipLen, sampleRate);
    const flipData = flipBuf.getChannelData(0);
    for (let i = 0; i < flipLen; i++) {
      const t = i / sampleRate;
      const freq = 320 + 650 * (t / 0.07);
      const env = Math.exp(-t * 35);
      flipData[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.4;
    }
    this.buffers["flip"] = flipBuf;

    // 3. Tick Sound Buffer (0.02s High Click)
    const tickLen = Math.floor(sampleRate * 0.02);
    const tickBuf = ctx.createBuffer(1, tickLen, sampleRate);
    const tickData = tickBuf.getChannelData(0);
    for (let i = 0; i < tickLen; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-t * 120);
      tickData[i] = Math.sin(2 * Math.PI * 950 * t) * env * 0.25;
    }
    this.buffers["tick"] = tickBuf;

    // 4. Chime Sound Buffer (0.35s Harmony Chime)
    const chimeLen = Math.floor(sampleRate * 0.35);
    const chimeBuf = ctx.createBuffer(1, chimeLen, sampleRate);
    const chimeData = chimeBuf.getChannelData(0);
    const notes = [523.25, 659.25, 783.99, 1046.5];
    for (let i = 0; i < chimeLen; i++) {
      const t = i / sampleRate;
      let sample = 0;
      notes.forEach((freq, idx) => {
        const noteStart = idx * 0.06;
        if (t >= noteStart) {
          const noteT = t - noteStart;
          const env = Math.exp(-noteT * 12);
          sample += Math.sin(2 * Math.PI * freq * noteT) * env * 0.2;
        }
      });
      chimeData[i] = sample;
    }
    this.buffers["chime"] = chimeBuf;
  }

  private playBuffer(name: string) {
    if (!this.enabled) return;
    this.warmup();
    if (!this.ctx) return;
    try {
      const buf = this.buffers[name];
      if (buf) {
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        src.connect(this.ctx.destination);
        src.start(0);
      }
    } catch {
      // Ignore
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playClick();
    }
    return this.enabled;
  }

  public playClick() {
    this.playBuffer("click");
  }

  public playFlip() {
    this.playBuffer("flip");
  }

  public playTick() {
    this.playBuffer("tick");
  }

  public playChime() {
    this.playBuffer("chime");
  }
}

export const sound = new SoundEngine();
