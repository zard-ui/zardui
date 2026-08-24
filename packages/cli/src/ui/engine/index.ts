/**
 * terminal-engine — the public surface of the terminal rendering engine.
 *
 * A diff-driven engine over Node.js and plain ANSI: no React, no Ink, no virtual
 * DOM and no external dependencies. The application describes what appears each
 * frame; the engine works out what changed and writes the fewest bytes it can.
 *
 * This directory is vendored code — the original source lives in the
 * `@zardui/terminal-engine` package. Behavioural changes belong there and should
 * be resynced here, so the two sides cannot diverge.
 */

export * from './utils/index.js';
export * from './ansi/index.js';
export * from './cursor/index.js';
export * from './events/index.js';
export * from './frame/index.js';
export * from './diff/index.js';
export * from './theme/index.js';
export * from './layout/index.js';
export * from './terminal/index.js';
export * from './input/index.js';
export * from './focus/index.js';
export * from './scheduler/index.js';
export * from './animation/index.js';
export * from './components/index.js';
export * from './renderer/index.js';
export * from './screen/index.js';
