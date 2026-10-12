import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  type ElementRef,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';

type WaveformMode = 'static' | 'scrolling';

// The props shadcn's card passes to its LiveWaveform, plus that component's defaults.
const BAR_WIDTH = 3;
const BAR_GAP = 2;
const BAR_RADIUS = 1.5;
const BAR_COLOR = 'gray';
const BASE_BAR_HEIGHT = 4;
const FADE_WIDTH = 24;
const SENSITIVITY = 1;
const SMOOTHING_TIME_CONSTANT = 0.8;
const FFT_SIZE = 256;
const HISTORY_SIZE = 120;
const UPDATE_RATE = 30;

/**
 * A port of shadcn's LiveWaveform: a canvas of bars that idles as a dotted line, plays a synthetic "processing" wave,
 * or follows the microphone while listening.
 */
@Component({
  selector: 'z-preview-02-live-waveform',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardCardImports],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Live Audio Waveform" />
        <z-card-description zDescription="Real-time microphone input visualization with audio reactivity" />
      </z-card-header>
      <z-card-content>
        <div
          #container
          class="relative h-full w-full"
          style="height: 80px"
          role="img"
          [attr.aria-label]="
            active() ? 'Live audio waveform' : processing() ? 'Processing audio' : 'Audio waveform idle'
          "
        >
          @if (!active() && !processing()) {
            <div
              class="border-muted-foreground/20 absolute top-1/2 right-0 left-0 -translate-y-1/2 border-t-2 border-dotted"
            ></div>
          }
          <canvas #canvas class="block h-full w-full" aria-hidden="true"></canvas>
        </div>
      </z-card-content>
      <z-card-footer class="gap-2">
        <button type="button" z-button zSize="sm" [zType]="active() ? 'default' : 'outline'" (click)="toggleActive()">
          {{ active() ? 'Stop' : 'Start' }} Listening
        </button>
        <button
          type="button"
          z-button
          zSize="sm"
          [zType]="processing() ? 'default' : 'outline'"
          (click)="toggleProcessing()"
        >
          {{ processing() ? 'Stop' : 'Start' }} Processing
        </button>
        <button type="button" z-button zSize="sm" zType="outline" (click)="toggleMode()">
          {{ mode() === 'static' ? 'Static' : 'Scrolling' }}
        </button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02LiveWaveformComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly containerRef = viewChild.required<ElementRef<HTMLDivElement>>('container');

  protected readonly active = signal(false);
  protected readonly processing = signal(true);
  protected readonly mode = signal<WaveformMode>('static');

  private ready = false;
  private history: number[] = [];
  private staticBars: number[] = [];
  private lastActiveData: number[] = [];
  private transitionProgress = 0;
  private needsRedraw = true;
  private lastUpdate = 0;
  private gradient: CanvasGradient | null = null;
  private lastWidth = 0;
  private processingFrame: number | null = null;
  private fadeFrame: number | null = null;
  private drawFrame = 0;
  private analyser: AnalyserNode | null = null;
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private micActive = false;

  constructor() {
    effect(() => {
      const active = this.active();
      const processing = this.processing();
      const mode = this.mode();
      untracked(() => this.sync(active, processing, mode));
    });

    afterNextRender(() => {
      const canvas = this.canvasRef().nativeElement;
      const container = this.containerRef().nativeElement;
      const resizeObserver = new ResizeObserver(() => {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        canvas.getContext('2d')?.scale(dpr, dpr);
        this.gradient = null;
        this.lastWidth = rect.width;
        this.needsRedraw = true;
      });
      resizeObserver.observe(container);
      this.ready = true;
      this.sync(this.active(), this.processing(), this.mode());
      this.drawFrame = requestAnimationFrame(time => this.animate(time));
      this.destroyRef.onDestroy(() => resizeObserver.disconnect());
    });

    this.destroyRef.onDestroy(() => {
      this.stopProcessing();
      if (this.fadeFrame) cancelAnimationFrame(this.fadeFrame);
      if (this.drawFrame) cancelAnimationFrame(this.drawFrame);
      this.teardownMicrophone();
    });
  }

  protected toggleActive(): void {
    const active = this.active();
    this.active.set(!active);
    if (!active) this.processing.set(false);
  }

  protected toggleProcessing(): void {
    const processing = this.processing();
    this.processing.set(!processing);
    if (!processing) this.active.set(false);
  }

  protected toggleMode(): void {
    this.mode.update(mode => (mode === 'static' ? 'scrolling' : 'static'));
  }

  private sync(active: boolean, processing: boolean, mode: WaveformMode): void {
    if (!this.ready) return;

    this.stopProcessing();
    if (processing && !active) {
      this.startProcessing(mode);
    } else if (!active && !processing) {
      this.fadeToIdle(mode);
    }

    if (active && !this.micActive) {
      this.micActive = true;
      void this.setupMicrophone();
    } else if (!active && this.micActive) {
      this.micActive = false;
      this.teardownMicrophone();
    }
  }

  private startProcessing(mode: WaveformMode): void {
    let time = 0;
    this.transitionProgress = 0;
    const animateProcessing = () => {
      time += 0.03;
      this.transitionProgress = Math.min(1, this.transitionProgress + 0.02);
      const data: number[] = [];
      const width = this.containerRef().nativeElement.getBoundingClientRect().width || 200;
      const barCount = Math.floor(width / (BAR_WIDTH + BAR_GAP));
      const last = this.lastActiveData;
      const blending = last.length > 0 && this.transitionProgress < 1;

      if (mode === 'static') {
        const halfCount = Math.floor(barCount / 2);
        for (let i = 0; i < barCount; i++) {
          const position = (i - halfCount) / halfCount;
          const centerWeight = 1 - Math.abs(position) * 0.4;
          const wave =
            Math.sin(time * 1.5 + position * 3) * 0.25 +
            Math.sin(time * 0.8 - position * 2) * 0.2 +
            Math.cos(time * 2 + position) * 0.15;
          const value = (0.2 + wave) * centerWeight;
          const lastValue = blending ? last[Math.min(i, last.length - 1)] || 0 : 0;
          const finalValue = blending
            ? lastValue * (1 - this.transitionProgress) + value * this.transitionProgress
            : value;
          data.push(Math.max(0.05, Math.min(1, finalValue)));
        }
        this.staticBars = data;
      } else {
        for (let i = 0; i < barCount; i++) {
          const position = (i - barCount / 2) / (barCount / 2);
          const centerWeight = 1 - Math.abs(position) * 0.4;
          const wave =
            Math.sin(time * 1.5 + i * 0.15) * 0.25 +
            Math.sin(time * 0.8 - i * 0.1) * 0.2 +
            Math.cos(time * 2 + i * 0.05) * 0.15;
          const value = (0.2 + wave) * centerWeight;
          const lastValue = blending ? last[Math.floor((i / barCount) * last.length)] || 0 : 0;
          const finalValue = blending
            ? lastValue * (1 - this.transitionProgress) + value * this.transitionProgress
            : value;
          data.push(Math.max(0.05, Math.min(1, finalValue)));
        }
        this.history = data;
      }
      this.needsRedraw = true;
      this.processingFrame = requestAnimationFrame(animateProcessing);
    };
    animateProcessing();
  }

  private stopProcessing(): void {
    if (this.processingFrame) {
      cancelAnimationFrame(this.processingFrame);
      this.processingFrame = null;
    }
  }

  private fadeToIdle(mode: WaveformMode): void {
    const hasData = mode === 'static' ? this.staticBars.length > 0 : this.history.length > 0;
    if (!hasData) return;
    let fadeProgress = 0;
    const fade = () => {
      fadeProgress += 0.03;
      if (fadeProgress < 1) {
        if (mode === 'static') {
          this.staticBars = this.staticBars.map(value => value * (1 - fadeProgress));
        } else {
          this.history = this.history.map(value => value * (1 - fadeProgress));
        }
        this.needsRedraw = true;
        this.fadeFrame = requestAnimationFrame(fade);
      } else if (mode === 'static') {
        this.staticBars = [];
      } else {
        this.history = [];
      }
    };
    fade();
  }

  private async setupMicrophone(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      if (!this.micActive) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      this.stream = stream;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = SMOOTHING_TIME_CONSTANT;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      this.audioContext = audioContext;
      this.analyser = analyser;
      this.history = [];
    } catch {
      // No microphone or permission denied: the waveform stays idle, as shadcn's does without an onError handler.
    }
  }

  private teardownMicrophone(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
    if (this.audioContext && this.audioContext.state !== 'closed') {
      void this.audioContext.close();
    }
    this.audioContext = null;
    this.analyser = null;
  }

  private animate(currentTime: number): void {
    this.drawFrame = requestAnimationFrame(time => this.animate(time));
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const active = this.active();
    const mode = this.mode();
    const rect = canvas.getBoundingClientRect();

    if (active && currentTime - this.lastUpdate > UPDATE_RATE) {
      this.lastUpdate = currentTime;
      if (this.analyser) {
        this.readMicrophone(this.analyser, rect.width, mode);
        this.needsRedraw = true;
      }
    }

    if (!this.needsRedraw && !active) return;
    this.needsRedraw = active;

    ctx.clearRect(0, 0, rect.width, rect.height);
    const step = BAR_WIDTH + BAR_GAP;
    const barCount = Math.floor(rect.width / step);
    const centerY = rect.height / 2;
    const bars = mode === 'static' ? this.staticBars : this.history;

    for (let i = 0; i < barCount && i < bars.length; i++) {
      const value = (mode === 'static' ? bars[i] : bars[bars.length - 1 - i]) || 0.1;
      const x = mode === 'static' ? i * step : rect.width - (i + 1) * step;
      const height = Math.max(BASE_BAR_HEIGHT, value * rect.height * 0.8);
      ctx.fillStyle = BAR_COLOR;
      ctx.globalAlpha = 0.4 + value * 0.6;
      ctx.beginPath();
      ctx.roundRect(x, centerY - height / 2, BAR_WIDTH, height, BAR_RADIUS);
      ctx.fill();
    }

    if (rect.width > 0) {
      if (!this.gradient || this.lastWidth !== rect.width) {
        const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
        const fadePercent = Math.min(0.3, FADE_WIDTH / rect.width);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(fadePercent, 'rgba(255,255,255,0)');
        gradient.addColorStop(1 - fadePercent, 'rgba(255,255,255,0)');
        gradient.addColorStop(1, 'rgba(255,255,255,1)');
        this.gradient = gradient;
        this.lastWidth = rect.width;
      }
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = this.gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  private readMicrophone(analyser: AnalyserNode, width: number, mode: WaveformMode): void {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    const relevant = dataArray.slice(Math.floor(dataArray.length * 0.05), Math.floor(dataArray.length * 0.4));

    if (mode === 'static') {
      const halfCount = Math.floor(Math.floor(width / (BAR_WIDTH + BAR_GAP)) / 2);
      const bar = (i: number) =>
        Math.max(0.05, Math.min(1, (relevant[Math.floor((i / halfCount) * relevant.length)] / 255) * SENSITIVITY));
      const bars: number[] = [];
      for (let i = halfCount - 1; i >= 0; i--) bars.push(bar(i));
      for (let i = 0; i < halfCount; i++) bars.push(bar(i));
      this.staticBars = bars;
      this.lastActiveData = bars;
    } else {
      const sum = relevant.reduce((total, value) => total + value, 0);
      const average = (sum / relevant.length / 255) * SENSITIVITY;
      this.history.push(Math.min(1, Math.max(0.05, average)));
      this.lastActiveData = [...this.history];
      if (this.history.length > HISTORY_SIZE) this.history.shift();
    }
  }
}
