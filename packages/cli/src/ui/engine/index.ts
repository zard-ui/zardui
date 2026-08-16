/**
 * terminal-engine — superfície pública da engine de renderização do terminal.
 *
 * Engine orientada a diff sobre Node.js + ANSI puro: sem React, sem Ink, sem
 * Virtual DOM e sem dependências externas. A aplicação descreve o que aparece
 * a cada frame; a engine descobre o que mudou e escreve o mínimo de bytes.
 *
 * Este diretório é código vendorizado — a fonte original vive no pacote
 * `@zardui/terminal-engine`. Ajustes de comportamento devem ser feitos lá e
 * ressincronizados aqui, para que os dois lados não divirjam.
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
