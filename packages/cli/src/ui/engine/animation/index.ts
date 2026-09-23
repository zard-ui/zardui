/**
 * animation — FPS-independent tweens (they use real dt), easing, and a keyed
 * clock that survives a re-render. The basis of spinner/progress/fade/typing/pulse.
 */

export type Easing = (t: number) => number;

const clamp01 = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t);

export const Easing: {
  readonly linear: Easing;
  readonly easeIn: Easing;
  readonly easeOut: Easing;
  readonly easeInOut: Easing;
  readonly spring: Easing;
} = {
  linear: t => clamp01(t),
  easeIn: t => {
    t = clamp01(t);
    return t * t;
  },
  easeOut: t => {
    t = clamp01(t);
    return 1 - (1 - t) * (1 - t);
  },
  easeInOut: t => {
    t = clamp01(t);
    return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  },
  spring: t => {
    t = clamp01(t);
    return 1 - Math.cos(t * Math.PI * 1.5) * (1 - t);
  },
};

export interface TweenOptions {
  readonly from: number;
  readonly to: number;
  readonly duration: number; // ms
  readonly easing?: Easing;
  readonly loop?: boolean | 'pingpong';
}

export interface Tween {
  readonly value: number;
  readonly done: boolean;
  update(dtMs: number): void;
  reset(): void;
}

export function tween(options: TweenOptions): Tween {
  const easing = options.easing ?? Easing.linear;
  const dur = Math.max(1, options.duration);
  let elapsed = 0;
  let dir = 1;

  const compute = (): { value: number; done: boolean } => {
    let t = elapsed / dur;
    let done = false;
    if (options.loop === 'pingpong') {
      t = clamp01(t);
    } else if (options.loop) {
      t = t % 1;
    } else if (t >= 1) {
      t = 1;
      done = true;
    }
    const eased = easing(t);
    const value = options.from + (options.to - options.from) * (dir < 0 ? 1 - eased : eased);
    return { value, done };
  };

  return {
    get value() {
      return compute().value;
    },
    get done() {
      return compute().done;
    },
    update(dtMs) {
      elapsed += dtMs;
      if (options.loop === 'pingpong' && elapsed >= dur) {
        elapsed = elapsed % dur;
        dir *= -1;
      }
    },
    reset() {
      elapsed = 0;
      dir = 1;
    },
  };
}

export interface AnimationClock {
  register(key: string, tween: Tween): void;
  has(key: string): boolean;
  phase(key: string): number;
  remove(key: string): void;
  tick(dtMs: number): void;
  readonly active: boolean;
}

export function createAnimationClock(): AnimationClock {
  const tweens = new Map<string, Tween>();
  return {
    register(key, t) {
      tweens.set(key, t);
    },
    has(key) {
      return tweens.has(key);
    },
    phase(key) {
      return tweens.get(key)?.value ?? 0;
    },
    remove(key) {
      tweens.delete(key);
    },
    tick(dtMs) {
      for (const t of tweens.values()) t.update(dtMs);
    },
    get active() {
      for (const t of tweens.values()) if (!t.done) return true;
      return false;
    },
  };
}

/** Frames de spinner nomeados (dots, line, arc, bounce, pulse). */
export const spinnerFrames: Readonly<Record<string, readonly string[]>> = {
  dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  line: ['-', '\\', '|', '/'],
  arc: ['◜', '◠', '◝', '◞', '◡', '◟'],
  bounce: ['⠁', '⠂', '⠄', '⠂'],
  pulse: ['•', '●', '◉', '●'],
};
