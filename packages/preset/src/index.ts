/**
 * `@zardui/preset` — a fonte única do design system do zard.
 *
 * TypeScript puro: nada de Node, nada de Angular. É o que permite ao mesmo
 * módulo rodar dentro da CLI (que grava o CSS no projeto de quem usa) e dentro
 * do site (que desenha o preview de `/create`), com a garantia de que os dois
 * produzem exatamente a mesma cor — porque é literalmente o mesmo código.
 *
 * `schema.ts` fica fora daqui de propósito: é o único módulo que depende do zod,
 * e o site não deve carregar um validador para desenhar um botão.
 */

export * from './catalog/index.js';
export * from './code.js';
export * from './color.js';
export * from './css.js';
export * from './derive.js';
export * from './preset.js';
export * from './registry.js';
export * from './resolve.js';
export * from './types.js';
