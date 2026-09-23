/**
 * The init wizard, from the point of view of whoever is typing.
 *
 * The first question is the project type, and the user answers it — the CLI does
 * not choose for them from what it finds in the directory. Everything that comes
 * after (the suggested paths, the steps that run) follows from that answer, and
 * that is what these tests exercise: choosing another type has to change the
 * rest of the form, not just the label.
 */

jest.mock('@antfu/ni', () => ({ detect: jest.fn() }));

import { runInitWizard, type InitWizardOptions } from '@cli/commands/init/wizard.js';
import { fakeTty, KEY, type FakeTty } from '@cli/ui/testing/fake-tty.js';
import type { Config } from '@cli/utils/config.js';
import type { ProjectInfo, WorkspaceProject } from '@cli/utils/get-project-info.js';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

const tick = (ms = 5) => new Promise(resolve => setTimeout(resolve, ms));

jest.setTimeout(30_000);

/**
 * The screen's text with no ANSI and no whitespace at all.
 *
 * The renderer wraps the frame at the terminal width, and the break falls
 * wherever it falls — including mid-word. Comparing without spaces is what makes
 * an assertion about what is written independent of where it wrapped.
 */
const onScreen = (value: string): string =>
  value
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '')
    .replace(/\s+/g, '');

const nxApp: WorkspaceProject = {
  name: 'nx-app',
  projectType: 'application',
  root: 'apps/nx-app',
  sourceRoot: 'apps/nx-app/src',
  flavor: 'angular',
  styles: ['apps/nx-app/src/styles.css'],
  index: null,
};

const nxLibrary: WorkspaceProject = {
  name: 'ui',
  projectType: 'library',
  root: 'libs/ui',
  sourceRoot: 'libs/ui/src',
  flavor: 'angular',
  styles: [],
  index: null,
};

const nxWorkspace: ProjectInfo = {
  framework: 'angular',
  root: '/proj',
  workspace: 'nx',
  hasTypeScript: true,
  hasTailwind: false,
  hasNx: true,
  hasAnalog: false,
  tsconfigFile: 'tsconfig.base.json',
  angularVersion: '22.0.0',
  angularVersionRaw: '^22.0.0',
  projects: [nxApp, nxLibrary],
};

/** Um workspace em disco, para a checagem do CSS global ter o que encontrar. */
async function workspaceOnDisk(): Promise<string> {
  const cwd = await mkdtemp(path.join(tmpdir(), 'zard-wizard-'));

  await mkdir(path.join(cwd, 'apps', 'nx-app', 'src'), { recursive: true });
  await writeFile(path.join(cwd, 'apps', 'nx-app', 'src', 'styles.css'), '', 'utf8');
  await mkdir(path.join(cwd, 'src'), { recursive: true });
  await writeFile(path.join(cwd, 'src', 'styles.css'), '', 'utf8');

  return cwd;
}

interface Run {
  readonly tty: FakeTty;
  readonly config: Promise<Config>;
  /** Envia teclas e espera a tela chegar onde deveria. */
  reach(keys: string[], expected: string): Promise<void>;
  press(keys: string[]): void;
  /** What has been written so far, normalized for assertions. */
  screen(): string;
}

const PROMPTS = {
  kind: 'What are you setting up?',
  app: 'Which app should receive the components?',
  appConfig: 'Where is your app.config.ts file?',
  theme: 'Choose a theme for your components:',
  globalCss: 'Where is your global CSS file?',
  themeCss: 'Where should the theme tokens live?',
  components: 'Configure the import alias for components:',
  utils: 'Configure the import alias for utils:',
  done: 'zard/ui has been initialized successfully!',
} as const;

async function startWizard(cwd: string, over: Partial<InitWizardOptions> = {}): Promise<Run> {
  const tty = fakeTty();

  const config = runInitWizard({
    cwd,
    projectInfo: nxWorkspace,
    packageManager: 'npm',
    isReInitializing: false,
    // With no final confirmation and no steps, the wizard goes straight to the
    // result as soon as the last question is answered.
    skipConfirmation: true,
    buildSteps: () => [],
    ...over,
  }).then(result => result.config);

  const screen = (): string => onScreen(tty.output());

  /**
   * Waits until the screen shows what is expected of it.
   *
   * Pausing for a fixed time between keys looks like enough until the machine is
   * busy — and then the next key arrives while the wizard is still checking the
   * CSS on disk, which is exactly when it ignores input. Waiting for the next
   * step's text takes the test out of the scheduler's hands.
   */
  const reach = async (keys: string[], expected: string): Promise<void> => {
    for (const key of keys) tty.press(key);

    const deadline = Date.now() + 5_000;
    const target = onScreen(expected);

    while (!screen().includes(target) && Date.now() < deadline) {
      await tick();
    }
  };

  await reach([], PROMPTS.kind);

  return {
    tty,
    config,
    reach,
    press: keys => keys.forEach(key => tty.press(key)),
    screen,
  };
}

describe('runInitWizard', () => {
  it('should ask for the project type before anything else', async () => {
    const run = await startWizard(await workspaceOnDisk());

    try {
      // The list opens in full: no type hides behind detection.
      for (const label of ['Angular', 'Nx', 'Analog.js', 'Angular Library', 'Nx Library']) {
        expect(run.screen()).toContain(onScreen(label));
      }

      // E nada foi perguntado antes dela.
      expect(run.screen()).not.toContain(onScreen(PROMPTS.appConfig));
    } finally {
      run.tty.restore();
    }
  });

  it('should derive the paths of the Nx app once Nx is chosen', async () => {
    const run = await startWizard(await workspaceOnDisk());

    try {
      // Nx is the third menu item; there is only one application in the
      // workspace, so the wizard does not ask which — it suggests its paths.
      await run.reach([KEY.down, KEY.down, KEY.enter], PROMPTS.appConfig);
      expect(run.screen()).toContain(onScreen('apps/nx-app/src/app/app.config.ts'));
      expect(run.screen()).not.toContain(onScreen(PROMPTS.app));

      await run.reach([KEY.enter], PROMPTS.theme);
      await run.reach([KEY.enter], PROMPTS.globalCss);
      // The on-disk CSS check happens here, between one screen and the next.
      await run.reach([KEY.enter], PROMPTS.components);
      await run.reach([KEY.enter], PROMPTS.utils);
      await run.reach([KEY.enter], PROMPTS.done);
      run.press([KEY.enter]);

      const result = await run.config;

      expect(result.projectType).toBe('nx');
      expect(result.appConfigFile).toBe('apps/nx-app/src/app/app.config.ts');
      expect(result.tailwind.css).toBe('apps/nx-app/src/styles.css');
      expect(result.baseUrl).toBe('apps/nx-app/src/app');
    } finally {
      run.tty.restore();
    }
  });

  /**
   * Choosing a library removes the app.config question — it would have no
   * possible answer — and starts aiming at `src/lib` inside the chosen library.
   */
  it('should drop the app.config question when a library is chosen', async () => {
    const run = await startWizard(await workspaceOnDisk());

    try {
      // Nx Library is the fourth menu item, and the theme is the next question.
      await run.reach([KEY.down, KEY.down, KEY.down, KEY.enter], PROMPTS.theme);
      await run.reach([KEY.enter], PROMPTS.themeCss);

      expect(run.screen()).not.toContain(onScreen(PROMPTS.appConfig));

      // The theme CSS does not exist yet: in a library init is what creates it.
      await run.reach([KEY.enter], PROMPTS.components);
      await run.reach([KEY.enter], PROMPTS.utils);
      await run.reach([KEY.enter], PROMPTS.done);
      run.press([KEY.enter]);

      const result = await run.config;

      expect(result.projectType).toBe('nx-library');
      expect(result.appConfigFile).toBe('');
      expect(result.baseUrl).toBe('libs/ui/src/lib');
      expect(result.tailwind.css).toBe('libs/ui/src/styles.css');
    } finally {
      run.tty.restore();
    }
  });

  /**
   * A text field has to accept what is typed into it.
   *
   * The alias is the answer most people change — anyone already using `@app/...`
   * in their project has to say so here, or every generated import points at a
   * prefix the tsconfig does not map.
   */
  it('should accept typing into a text field', async () => {
    const run = await startWizard(await workspaceOnDisk());

    try {
      await run.reach([KEY.enter], PROMPTS.appConfig);
      await run.reach([KEY.enter], PROMPTS.theme);
      await run.reach([KEY.enter], PROMPTS.globalCss);
      await run.reach([KEY.enter], PROMPTS.components);

      await run.reach([...'@app/components'], '@app/components');
      await run.reach([KEY.enter], PROMPTS.utils);
      await run.reach([KEY.enter], PROMPTS.done);
      run.press([KEY.enter]);

      const result = await run.config;

      expect(result.aliases.components).toBe('@app/components');
      // The new alias drags the siblings derived from it along with it.
      expect(result.aliases.core).toBe('@app/core');
    } finally {
      run.tty.restore();
    }
  });

  it('should let backspace edit the suggested value instead of only clearing it', async () => {
    const run = await startWizard(await workspaceOnDisk());

    try {
      await run.reach([KEY.enter], PROMPTS.appConfig);
      await run.reach([KEY.enter], PROMPTS.theme);
      await run.reach([KEY.enter], PROMPTS.globalCss);
      await run.reach([KEY.enter], PROMPTS.components);

      // `@/shared/components` minus its last 10 characters is `@/shared/`.
      await run.reach([...Array(10).fill(KEY.backspace), ...'ui'], '@/shared/ui');
      await run.reach([KEY.enter], PROMPTS.utils);
      await run.reach([KEY.enter], PROMPTS.done);
      run.press([KEY.enter]);

      expect((await run.config).aliases.components).toBe('@/shared/ui');
    } finally {
      run.tty.restore();
    }
  });

  it('should open on the type given by --type', async () => {
    const run = await startWizard(await workspaceOnDisk(), { presetKind: 'nx-library' });

    try {
      await run.reach([KEY.enter], PROMPTS.theme);
      await run.reach([KEY.enter], PROMPTS.themeCss);
      await run.reach([KEY.enter], PROMPTS.components);
      await run.reach([KEY.enter], PROMPTS.utils);
      await run.reach([KEY.enter], PROMPTS.done);
      run.press([KEY.enter]);

      expect((await run.config).projectType).toBe('nx-library');
    } finally {
      run.tty.restore();
    }
  });
});
