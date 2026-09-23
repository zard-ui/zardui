/**
 * The public surface of the CLI's UI.
 *
 * Commands import from here — never from `./engine` directly — so that replacing
 * or upgrading the engine stays contained in this layer.
 */

export * from './engine/index.js';
export * from './blocks.js';
export * from './brand.js';
export * from './gate.js';
export * from './log-sink.js';
export * from './output.js';
export * from './report.js';
export * from './runner.js';
export * from './style.js';
export * from './text-input.js';
export * from './theme.js';
