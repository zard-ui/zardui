/**
 * Version resolution — the path from the compiled module to its own manifest.
 *
 * The layout differs between the monorepo (`dist/`) and what npm installs
 * (`node_modules/zard-cli/`, whose root is that same `dist/`). A path that is
 * right for one and wrong for the other fails silently: the CLI falls back to
 * `0.0.0` instead of crashing, so the regression only shows up after publish.
 * Each case below pins one real layout.
 */

import { resolveAppVersion } from '@cli/constants/app.constants.js';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

describe('resolveAppVersion', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'zard-cli-version-'));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  function writeManifest(dir: string, manifest: Record<string, unknown>) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'package.json'), JSON.stringify(manifest));
  }

  it('reads the version from the package root of an npm install', () => {
    const installed = join(root, 'node_modules', 'zard-cli');
    writeManifest(installed, { name: 'zard-cli', version: '1.2.3' });

    expect(resolveAppVersion(join(installed, 'constants'))).toBe('1.2.3');
  });

  it('reads the version from dist/ inside the monorepo', () => {
    const dist = join(root, 'packages', 'cli', 'dist');
    writeManifest(dist, { name: 'zard-cli', version: '1.0.0-beta.119' });

    expect(resolveAppVersion(join(dist, 'constants'))).toBe('1.0.0-beta.119');
  });

  it('accepts the linked dev build, published under its own name', () => {
    const dist = join(root, 'dist');
    writeManifest(dist, { name: 'zard-cli-dev', version: '0.0.0-dev' });

    expect(resolveAppVersion(join(dist, 'constants'))).toBe('0.0.0-dev');
  });

  it('falls back to src/ when running uncompiled', () => {
    const pkg = join(root, 'packages', 'cli');
    writeManifest(pkg, { name: 'zard-cli', version: '4.5.6' });
    mkdirSync(join(pkg, 'src', 'constants'), { recursive: true });

    expect(resolveAppVersion(join(pkg, 'src', 'constants'))).toBe('4.5.6');
  });

  /**
   * Walking up the tree eventually reaches manifests the CLI does not own —
   * `node_modules/package.json`, or the consumer's own project. Reporting their
   * version as the CLI's would be worse than reporting nothing.
   */
  it('ignores a package.json that does not belong to the CLI', () => {
    const installed = join(root, 'node_modules', 'zard-cli');
    writeManifest(join(root, 'node_modules'), { name: 'not-the-cli', version: '9.9.9' });
    mkdirSync(join(installed, 'constants'), { recursive: true });
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(resolveAppVersion(join(installed, 'constants'))).toBe('0.0.0');
    expect(warn).toHaveBeenCalledWith('Failed to read version from package.json');

    warn.mockRestore();
  });
});
