/**
 * Superfície pública da UI da CLI.
 *
 * Os comandos importam daqui — nunca de `./engine` diretamente — para que a
 * troca ou atualização da engine fique contida nesta camada.
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
export * from './theme.js';
