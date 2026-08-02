/**
 * O wizard do init, do ponto de vista de quem digita.
 *
 * A primeira pergunta é o tipo de projeto, e é o usuário quem a responde — a
 * CLI não escolhe por ele a partir do que encontra no diretório. Tudo o que vem
 * depois (os caminhos sugeridos, as etapas que rodam) é consequência dessa
 * resposta, e é isso que estes testes exercitam: escolher outro tipo tem de
 * mudar o resto do formulário, não só o rótulo.
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
 * O texto da tela sem ANSI e sem espaço nenhum.
 *
 * O renderer quebra o frame na largura do terminal, e a quebra cai onde tiver
 * de cair — inclusive no meio de uma palavra. Comparar sem espaços é o que
 * torna a asserção sobre o que está escrito independente de onde ela quebrou.
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
  /** O que já foi escrito, normalizado para asserções. */
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
    // Sem confirmação final e sem etapas, o wizard vai direto ao resultado
    // assim que a última pergunta é respondida.
    skipConfirmation: true,
    buildSteps: () => [],
    ...over,
  }).then(result => result.config);

  const screen = (): string => onScreen(tty.output());

  /**
   * Espera até a tela mostrar o que se espera dela.
   *
   * Pausar por um tempo fixo entre teclas parece bastar até a máquina estar
   * ocupada — e aí a tecla seguinte chega enquanto o wizard ainda checava o CSS
   * em disco, que é justamente quando ele ignora a entrada. Esperar pelo texto
   * do passo seguinte tira o teste das mãos do agendador.
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
      // A lista abre inteira: nenhum tipo fica escondido atrás da detecção.
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
      // Nx é o terceiro item do menu; só há uma aplicação no workspace, então
      // o wizard não pergunta qual — ele já sugere os caminhos dela.
      await run.reach([KEY.down, KEY.down, KEY.enter], PROMPTS.appConfig);
      expect(run.screen()).toContain(onScreen('apps/nx-app/src/app/app.config.ts'));
      expect(run.screen()).not.toContain(onScreen(PROMPTS.app));

      await run.reach([KEY.enter], PROMPTS.theme);
      await run.reach([KEY.enter], PROMPTS.globalCss);
      // A checagem do CSS em disco acontece aqui, entre uma tela e outra.
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
   * Escolher biblioteca remove a pergunta do app.config — ela não teria
   * resposta possível — e passa a mirar `src/lib` dentro da lib escolhida.
   */
  it('should drop the app.config question when a library is chosen', async () => {
    const run = await startWizard(await workspaceOnDisk());

    try {
      // Nx Library é o quarto item do menu, e o tema é a pergunta seguinte.
      await run.reach([KEY.down, KEY.down, KEY.down, KEY.enter], PROMPTS.theme);
      await run.reach([KEY.enter], PROMPTS.themeCss);

      expect(run.screen()).not.toContain(onScreen(PROMPTS.appConfig));

      // O CSS de tema ainda não existe: numa biblioteca é o init que o cria.
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
   * Um campo de texto tem de aceitar o que se digita nele.
   *
   * O alias é a resposta que mais gente troca — quem já usa `@app/...` no
   * projeto precisa dizer isso aqui, ou todo import gerado aponta para um
   * prefixo que o tsconfig não mapeia.
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
      // O alias novo arrasta consigo os irmãos derivados dele.
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

      // `@/shared/components` sem os 10 últimos caracteres é `@/shared/`.
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
