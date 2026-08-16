/**
 * screen — a fronteira "ligar/desligar a UI". Amarra terminal, renderer,
 * scheduler, input, focus e animation. Setup/teardown simétricos à prova de
 * crash (ADR-0007). Traz a edição interativa embutida (input/select/checkbox…).
 * (Implementação real.)
 */

import { performance } from 'node:perf_hooks';

import { createAnimationClock, type AnimationClock } from '../animation/index.js';
import type { Node } from '../components/index.js';
import { screen as emptyScreen } from '../components/index.js';
import type { Disposable } from '../events/index.js';
import { createFocusManager, type FocusManager } from '../focus/index.js';
import { createInputManager, type InputManager, type KeyEvent } from '../input/index.js';
import { createRenderer, type Renderer, type RenderContext } from '../renderer/index.js';
import { createScheduler, type Scheduler } from '../scheduler/index.js';
import { createTerminal, type Terminal } from '../terminal/index.js';
import type { Theme } from '../theme/index.js';

export interface ScreenOptions {
  readonly theme?: Theme;
  readonly terminal?: Terminal;
  readonly fps?: number | 'uncapped';
  readonly mouse?: boolean;
  readonly handleExitSignals?: boolean;
  readonly altScreen?: boolean;
}

export interface Screen {
  readonly renderer: Renderer;
  readonly scheduler: Scheduler;
  readonly input: InputManager;
  readonly focus: FocusManager;
  readonly animation: AnimationClock;
  readonly terminal: Terminal;
  /** Registra a função-view declarativa reconstruída a cada frame. */
  setView(fn: () => Node): void;
  mount(): void;
  unmount(): void;
  onKey(cb: (e: KeyEvent) => boolean | void): Disposable;
  setTheme(theme: Theme): void;
}

const INTERACTIVE = new Set(['input', 'password', 'select', 'confirm', 'checkbox', 'textarea']);
type Fn = (...a: never[]) => void;

function asFn<T extends Fn>(v: unknown): T | undefined {
  return typeof v === 'function' ? (v as T) : undefined;
}

export function createScreen(options: ScreenOptions = {}): Screen {
  const terminal = options.terminal ?? createTerminal();
  const renderer = createRenderer(options.theme ? { terminal, theme: options.theme } : { terminal });
  const focus = createFocusManager();
  const animation = createAnimationClock();
  const globalKeys = new Set<(e: KeyEvent) => boolean | void>();
  const carets = new Map<string, number>();
  const altScreen = options.altScreen ?? true;
  const handleExit = options.handleExitSignals ?? true;

  let view: (() => Node) | undefined;
  let mounted = false;
  let frameCount = 0;
  let hasLiveAnimation = false;
  const start = performance.now();
  let focusDisposables: Disposable[] = [];
  const subs: Disposable[] = [];

  // ── edição interativa embutida: o componente focado recebe a tecla ──
  function editNode(node: Node, e: KeyEvent): boolean {
    const p = node.props as Record<string, unknown>;
    const key = node.key ?? '';
    const type = node.type;

    if (type === 'input' || type === 'password' || type === 'textarea') {
      const value = typeof p['value'] === 'string' ? p['value'] : '';
      const chars = [...value];
      const caret = Math.min(carets.get(key) ?? chars.length, chars.length);
      const onChange = asFn<(v: string) => void>(p['onChange']);
      const onSubmit = asFn<(v: string) => void>(p['onSubmit']);
      if (e.key.length === 1 && !e.ctrl && !e.alt) {
        chars.splice(caret, 0, e.key);
        carets.set(key, caret + 1);
        onChange?.(chars.join(''));
        return true;
      }
      switch (e.key) {
        case 'backspace':
          if (caret > 0) {
            chars.splice(caret - 1, 1);
            carets.set(key, caret - 1);
            onChange?.(chars.join(''));
          }
          return true;
        case 'delete':
          if (caret < chars.length) {
            chars.splice(caret, 1);
            onChange?.(chars.join(''));
          }
          return true;
        case 'left':
          carets.set(key, Math.max(0, caret - 1));
          return true;
        case 'right':
          carets.set(key, Math.min(chars.length, caret + 1));
          return true;
        case 'home':
          carets.set(key, 0);
          return true;
        case 'end':
          carets.set(key, chars.length);
          return true;
        case 'enter':
          if (type === 'textarea') {
            chars.splice(caret, 0, '\n');
            carets.set(key, caret + 1);
            onChange?.(chars.join(''));
            return true;
          }
          onSubmit?.(value);
          return true;
        default:
          return false;
      }
    }

    if (type === 'select') {
      const options2 = Array.isArray(p['options']) ? (p['options'] as { value: string; disabled?: boolean }[]) : [];
      const values = options2.filter(o => !o.disabled).map(o => o.value);
      const onChange = asFn<(v: string) => void>(p['onChange']);
      if (values.length === 0) return false;
      const cur = typeof p['value'] === 'string' ? p['value'] : values[0]!;
      let idx = values.indexOf(cur);
      if (idx < 0) idx = 0;
      if (e.key === 'up') {
        onChange?.(values[(idx - 1 + values.length) % values.length]!);
        return true;
      }
      if (e.key === 'down') {
        onChange?.(values[(idx + 1) % values.length]!);
        return true;
      }
      if (e.key === 'enter') {
        onChange?.(cur);
        return true;
      }
      return false;
    }

    if (type === 'checkbox') {
      if (e.key === ' ' || e.key === 'enter') {
        asFn<(v: boolean) => void>(p['onChange'])?.(!(p['checked'] === true));
        return true;
      }
      return false;
    }

    if (type === 'confirm') {
      const oc = asFn<(v: boolean) => void>(p['onChange']);
      if (e.key === 'y' || e.key === 'Y') return (oc?.(true), true);
      if (e.key === 'n' || e.key === 'N') return (oc?.(false), true);
      if (e.key === ' ' || e.key === 'enter') return (oc?.(!(p['value'] === true)), true);
      return false;
    }

    return false;
  }

  function collectAndRegister(tree: Node): void {
    for (const d of focusDisposables) d.dispose();
    focusDisposables = [];
    hasLiveAnimation = false;
    let order = 0;
    const walk = (n: Node): void => {
      if (n.type === 'spinner') hasLiveAnimation = true;
      if (INTERACTIVE.has(n.type) && n.key !== undefined) {
        const node = n;
        const idx = order++;
        focusDisposables.push(focus.register({ key: n.key, tabIndex: idx, onKey: e => editNode(node, e) }));
      }
      for (const c of n.children) walk(c);
    };
    walk(tree);
  }

  function render(): void {
    const tree = view ? view() : emptyScreen();
    collectAndRegister(tree);
    const active = focus.activeKey;
    const ctx: { focusKey?: string; tick?: number; elapsedMs?: number; caret?: number } = {
      tick: frameCount,
      elapsedMs: performance.now() - start,
    };
    if (active !== undefined) {
      ctx.focusKey = active;
      const caret = carets.get(active);
      if (caret !== undefined) ctx.caret = caret;
    }
    renderer.render(tree, ctx as RenderContext);
    frameCount++;
  }

  const scheduler = createScheduler({ ...(options.fps !== undefined ? { fps: options.fps } : {}), onRender: render });
  const input = createInputManager(terminal.onData.bind(terminal), options.mouse ? { mouse: true } : {});

  function handleKey(e: KeyEvent): void {
    if (handleExit && e.ctrl && (e.key === 'c' || e.key === 'd')) {
      teardown();
      process.exit(0);
    }
    const consumed = focus.routeKey(e);
    if (!consumed) {
      for (const cb of [...globalKeys]) cb(e);
    }
    // render síncrono: mantém a árvore (e o valor dos nós interativos) fresca
    // entre teclas digitadas em rajada, antes do próximo evento.
    scheduler.renderSync();
  }

  const exitHandler = (): void => teardown();
  const sigintHandler = (): void => {
    teardown();
    process.exit(0);
  };

  function teardown(): void {
    if (!mounted) return;
    mounted = false;
    for (const s of subs) s.dispose();
    subs.length = 0;
    input.stop();
    scheduler.stop();
    terminal.restore();
    process.off('exit', exitHandler);
    process.off('SIGINT', sigintHandler);
  }

  return {
    renderer,
    scheduler,
    input,
    focus,
    animation,
    terminal,
    setView(fn) {
      view = fn;
    },
    mount() {
      if (mounted) return;
      mounted = true;
      if (altScreen) terminal.enterAltScreen();
      terminal.showCursor(false);
      terminal.enterRawMode();
      if (options.mouse) terminal.enableMouse(true);

      subs.push(input.onKey(handleKey));
      subs.push(
        scheduler.onFrame(dt => {
          animation.tick(dt);
          if (hasLiveAnimation || animation.active) scheduler.requestRender();
        }),
      );
      subs.push(
        terminal.onResize(size => {
          renderer.resize(size);
          scheduler.requestRender();
        }),
      );

      if (handleExit) {
        process.on('exit', exitHandler);
        process.on('SIGINT', sigintHandler);
      }

      input.start();
      scheduler.start();
      scheduler.renderSync(); // primeiro paint imediato
    },
    unmount() {
      teardown();
    },
    onKey(cb) {
      globalKeys.add(cb);
      return { dispose: () => globalKeys.delete(cb) };
    },
    setTheme(theme) {
      renderer.setTheme(theme);
      scheduler.requestRender();
    },
  };
}
