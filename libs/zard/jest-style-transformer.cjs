/**
 * Jest transformer that resolves style markers before the Angular transformer runs.
 *
 * The library's sources write `cn-button` where the look is decided (see
 * packages/cli/src/core/styles), and the docs site resolves them with CSS. A unit
 * test runs without that stylesheet, so a spec asserting `toHaveClass('h-8')`
 * would see a bare marker. Here the markers are replaced by the default style's
 * classes — the same replacement the CLI makes at install time — so the specs
 * keep asserting the classes a user ends up with.
 *
 * The style comes straight from `style-nova.css`: the specs exercise the sheet
 * the docs and the registry are built from, not a copy of it.
 */

const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const angularPreset = require('jest-preset-angular').default;

const STYLES_DIR = path.join(__dirname, 'src/lib/shared/core/css/styles');
const CORE_DIR = path.join(__dirname, '../../packages/cli/src/core/styles');
const STYLE = process.env.ZARD_TEST_STYLE || 'nova';

let helpers;
let sheetStamp = '';

function load() {
  if (helpers) return helpers;

  const bundle = esbuild.buildSync({
    stdin: {
      contents: `export { transformStyle } from './transform-style'; export { parseStyleSheet } from './parse-style-sheet';`,
      resolveDir: CORE_DIR,
      loader: 'ts',
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    logLevel: 'silent',
  });

  const module_ = { exports: {} };
  new Function('module', 'exports', 'require', bundle.outputFiles[0].text)(module_, module_.exports, require);

  const sheetPath = path.join(STYLES_DIR, `style-${STYLE}.css`);
  const sheet = fs.existsSync(sheetPath) ? fs.readFileSync(sheetPath, 'utf8') : '';
  sheetStamp = String(sheet.length) + ':' + sheet.charCodeAt(0) + ':' + sheet.charCodeAt(sheet.length >> 1);
  helpers = {
    transformStyle: module_.exports.transformStyle,
    catalog: { [STYLE]: module_.exports.parseStyleSheet(sheet) },
  };

  return helpers;
}

function resolveMarkers(source, filename) {
  if (!filename.endsWith('.ts') || !source.includes('cn-')) return source;

  const { transformStyle, catalog } = load();
  return transformStyle(source, STYLE, catalog);
}

module.exports = {
  createTransformer(config) {
    const inner = angularPreset.createTransformer(config);

    return {
      canInstrument: inner.canInstrument,
      process: (source, filename, options) => inner.process(resolveMarkers(source, filename), filename, options),
      processAsync: (source, filename, options) =>
        inner.processAsync(resolveMarkers(source, filename), filename, options),
      getCacheKey: (source, filename, options) =>
        inner.getCacheKey(resolveMarkers(source, filename), filename, options) + sheetStamp,
      getCacheKeyAsync: (source, filename, options) =>
        inner.getCacheKeyAsync(resolveMarkers(source, filename), filename, options).then(key => key + sheetStamp),
    };
  },
};
