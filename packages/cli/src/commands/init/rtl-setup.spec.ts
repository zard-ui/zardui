/**
 * `init --rtl` sets `dir="rtl"` on the app's index.html and nothing else.
 *
 * The components are direction-agnostic, so the attribute is all a project needs;
 * without the flag the file must not be touched at all.
 */

jest.mock('@antfu/ni', () => ({ detect: jest.fn() }));
jest.mock('@cli/utils/logger.js', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn(), debug: jest.fn() },
}));

import { buildConfig, defaultAnswers, withPresets } from '@cli/commands/init/config-prompter.js';
import { setupRtlDirection, withRtlDirection } from '@cli/commands/init/rtl-setup.js';
import { buildInitSteps } from '@cli/commands/init/steps.js';
import type { ProjectInfo } from '@cli/utils/get-project-info.js';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

const projectInfo: ProjectInfo = {
  framework: 'angular',
  root: '/proj',
  workspace: 'angular',
  hasTypeScript: true,
  hasTailwind: false,
  hasNx: false,
  hasAnalog: false,
  tsconfigFile: 'tsconfig.json',
  angularVersion: '22.0.0',
  angularVersionRaw: '^22.0.0',
  projects: [],
};

const INDEX = '<!doctype html>\n<html lang="en">\n<head></head>\n<body><app-root></app-root></body>\n</html>\n';

describe('withRtlDirection', () => {
  it('should add dir="rtl" to <html>, keeping the other attributes', () => {
    expect(withRtlDirection(INDEX)).toContain('<html lang="en" dir="rtl">');
  });

  it('should add it to a bare <html>', () => {
    expect(withRtlDirection('<html><body></body></html>')).toBe('<html dir="rtl"><body></body></html>');
  });

  it('should replace a dir that says ltr', () => {
    expect(withRtlDirection('<html dir="ltr" lang="en">')).toBe('<html dir="rtl" lang="en">');
  });

  it('should be idempotent', () => {
    const once = withRtlDirection(INDEX);
    expect(withRtlDirection(once)).toBe(once);
  });

  it('should not touch a dir attribute on other tags', () => {
    expect(withRtlDirection('<html lang="en"><body dir="ltr">')).toBe('<html lang="en" dir="rtl"><body dir="ltr">');
  });
});

describe('setupRtlDirection', () => {
  async function appOnDisk(index: string | null): Promise<string> {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-rtl-'));
    await mkdir(path.join(cwd, 'src'), { recursive: true });
    if (index !== null) await writeFile(path.join(cwd, 'src', 'index.html'), index, 'utf8');
    return cwd;
  }

  it('should write dir="rtl" into index.html', async () => {
    const cwd = await appOnDisk(INDEX);

    expect(await setupRtlDirection(cwd, 'src/index.html')).toBe('updated');
    expect(await readFile(path.join(cwd, 'src', 'index.html'), 'utf8')).toContain('<html lang="en" dir="rtl">');
  });

  it('should report unchanged when it is already rtl', async () => {
    const cwd = await appOnDisk('<html dir="rtl"></html>');

    expect(await setupRtlDirection(cwd, 'src/index.html')).toBe('unchanged');
  });

  it('should skip, not fail, when there is no index.html', async () => {
    const cwd = await appOnDisk(null);

    expect(await setupRtlDirection(cwd, 'src/index.html')).toBe('missing');
  });

  it('should skip a file with no <html> tag', async () => {
    const cwd = await appOnDisk('<app-root></app-root>');

    expect(await setupRtlDirection(cwd, 'src/index.html')).toBe('no-html-tag');
    expect(await readFile(path.join(cwd, 'src', 'index.html'), 'utf8')).toBe('<app-root></app-root>');
  });
});

describe('the init steps', () => {
  const answersFor = (kind: 'angular' | 'angular-library', rtl: boolean) =>
    withPresets(defaultAnswers(projectInfo, kind), { rtl });

  const labelsOf = (kind: 'angular' | 'angular-library', rtl: boolean): string[] =>
    buildInitSteps('/proj', buildConfig(answersFor(kind, rtl), 'npm'), projectInfo, false).map(step => step.label);

  it('should record rtl in components.json only when asked', () => {
    expect(buildConfig(answersFor('angular', true), 'npm').rtl).toBe(true);
    expect(buildConfig(answersFor('angular', false), 'npm').rtl).toBe(false);
  });

  it('should add the index.html step only with rtl', () => {
    expect(labelsOf('angular', true)).toContain('src/index.html');
    expect(labelsOf('angular', false)).not.toContain('src/index.html');
  });

  it('should have no index.html step in a library, even with rtl', () => {
    expect(labelsOf('angular-library', true).some(label => label.endsWith('index.html'))).toBe(false);
  });

  it('should prefer the index the build target declares', () => {
    const info: ProjectInfo = {
      ...projectInfo,
      projects: [
        {
          name: 'app',
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          flavor: 'angular',
          styles: ['src/styles.css'],
          index: 'src/main.html',
        },
      ],
    };
    const labels = buildInitSteps('/proj', buildConfig(answersFor('angular', true), 'npm'), info, false).map(
      step => step.label,
    );

    expect(labels).toContain('src/main.html');
  });
});
