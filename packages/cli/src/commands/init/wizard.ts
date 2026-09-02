import { buildConfig, defaultAnswers, inspectCssFile, type InitAnswers } from '@cli/commands/init/config-prompter.js';
import { candidateProjects, isLibraryKind, PROJECT_KINDS, type ProjectKind } from '@cli/commands/init/project-kind.js';
import { type InitStep } from '@cli/commands/init/steps.js';
import {
  answeredLine,
  brandBanner,
  choiceList,
  commandHeader,
  confirmField,
  controls,
  hint,
  page,
  progress,
  question,
  resultPanel,
  editInput,
  runWizard,
  screen,
  spacer,
  startInput,
  taskHeader,
  taskList,
  text,
  textField,
  warning,
  type Choice,
  type KeyEvent,
  type LogRecord,
  type Node,
  type TaskLine,
  type TextInput,
  type WizardContext,
} from '@cli/ui/index.js';
import { type Config } from '@cli/utils/config.js';
import { type ProjectInfo, type WorkspaceProject } from '@cli/utils/get-project-info.js';
import { presetCatalog } from '@cli/utils/preset-catalog.js';
import { getAvailableThemes, getThemeDisplayName } from '@cli/utils/theme-selector.js';
import { encodePreset, entryById, type Preset } from '@zardui/preset';

type StepKind = 'text' | 'select' | 'confirm';

interface Step {
  readonly id: keyof InitAnswers | 'overwriteCss';
  readonly kind: StepKind;
  /** The question itself, identical to what the CLI used to ask. */
  readonly prompt: string;
  /** Short label used in the transcript of answers. */
  readonly label: string;
  /** What the step does — disappears as soon as it is answered. */
  readonly detail: string;
  readonly choices?: readonly Choice[];
  readonly values?: readonly string[];
  readonly confirmDefault?: boolean;
  /** Warning shown when declining the step aborts the install. */
  readonly danger?: string;
}

const OVERWRITE_STEP: Step = {
  id: 'overwriteCss',
  kind: 'confirm',
  prompt:
    'Your CSS file already has content. This will overwrite everything with zard/ui theme configuration. Continue?',
  label: 'overwrite CSS',
  detail: 'The theme tokens must live in your global CSS, or the components will not render.',
  confirmDefault: true,
  danger: 'Choosing No cancels the installation. This step is essential for zard/ui to work.',
};

function themeStep(): Step {
  const themes = getAvailableThemes();
  return {
    id: 'theme',
    kind: 'select',
    prompt: 'Choose a theme for your components:',
    label: 'theme',
    detail: 'Defines the base color palette, exposed as CSS variables on :root.',
    choices: themes.map(theme => ({ label: getThemeDisplayName(theme) })),
    values: themes,
  };
}

/**
 * The header line, saying where the install will land.
 *
 * Before the first answer there is no target to announce — the type is the
 * user's choice, and pre-empting it here would suggest the CLI already decided.
 * With a single compatible project the wizard does not ask which one either, so
 * this is where its name appears, to keep the choice from being implicit.
 */
function targetDescription(state: State, options: InitWizardOptions): string {
  if (!state.kindChosen) return 'Setting up zard/ui in your project…';

  const label = PROJECT_KINDS.find(option => option.value === state.answers.kind)?.label ?? 'Angular';
  const project = candidateProjects(state.answers.kind, options.projectInfo).find(
    candidate => candidate.root === state.answers.projectRoot,
  );

  if (project) return `Setting up zard/ui in ${project.name} (${label})…`;

  return `Setting up zard/ui in your ${label} project…`;
}

/**
 * The first question, always.
 *
 * The user decides the type: the list opens in full, in menu order, with no
 * preselection derived from what is in the directory. Everything that comes
 * after — the suggested paths, the steps that run — follows from this answer.
 */
function kindStep(): Step {
  return {
    id: 'kind',
    kind: 'select',
    prompt: 'What are you setting up?',
    label: 'project type',
    detail: 'Decides where the components live and what init has to configure.',
    choices: PROJECT_KINDS.map(option => ({ label: option.label, hint: option.detail, color: option.color })),
    values: PROJECT_KINDS.map(option => option.value),
  };
}

/**
 * Project choice, only when more than one is compatible.
 *
 * With a single candidate the question would have no alternative answer; the
 * name appears in the header and the user goes straight to the next step.
 */
function projectStep(projects: WorkspaceProject[], kind: ProjectKind): Step {
  const library = isLibraryKind(kind);

  return {
    id: 'projectRoot',
    kind: 'select',
    prompt: library ? 'Which library should receive the components?' : 'Which app should receive the components?',
    label: library ? 'library' : 'app',
    detail: library
      ? 'The components become part of this library and ship with it.'
      : 'Its app.config.ts and global CSS are the ones init configures.',
    choices: projects.map(project => ({ label: project.name, hint: project.root || '.' })),
    values: projects.map(project => project.root),
  };
}

/**
 * As perguntas, na ordem.
 *
 * Com um preset em mãos, a do tema sai: ela já foi respondida em `/create` ou
 * na linha de comando, e perguntá-la de novo daria ao usuário a chance de
 * contradizer, sem perceber, o design system que ele mesmo escolheu. O que o
 * preset decidiu aparece no transcript, marcado como vindo dele.
 */
function baseSteps(projectInfo: ProjectInfo, kind: ProjectKind, hasPreset = false): Step[] {
  const candidates = candidateProjects(kind, projectInfo);
  const chooseProject = candidates.length > 1 ? [projectStep(candidates, kind)] : [];
  const chooseTheme = hasPreset ? [] : [themeStep()];

  if (isLibraryKind(kind)) {
    return [
      kindStep(),
      ...chooseProject,
      ...chooseTheme,
      {
        id: 'globalCss',
        kind: 'text',
        prompt: 'Where should the theme tokens live?',
        label: 'theme CSS',
        detail: 'Created inside the library and shipped with it, for the consuming app to import.',
      },
      {
        id: 'componentsAlias',
        kind: 'text',
        prompt: 'Configure the import alias for components:',
        label: 'components alias',
        detail: 'Where `add` generates component source; also written to tsconfig paths.',
      },
      {
        id: 'utilsAlias',
        kind: 'text',
        prompt: 'Configure the import alias for utils:',
        label: 'utils alias',
        detail: 'Home of the class-merging helpers shared by every component.',
      },
    ];
  }

  return [
    kindStep(),
    ...chooseProject,
    {
      id: 'appConfig',
      kind: 'text',
      prompt: 'Where is your app.config.ts file?',
      label: 'app.config.ts',
      detail: 'zard/ui registers its global providers in this file.',
    },
    ...chooseTheme,
    {
      id: 'globalCss',
      kind: 'text',
      prompt: 'Where is your global CSS file?',
      label: 'global CSS',
      detail: 'zard/ui writes its design tokens and the base layer into this file.',
    },
    {
      id: 'componentsAlias',
      kind: 'text',
      prompt: 'Configure the import alias for components:',
      label: 'components alias',
      detail: 'Where `add` generates component source; also written to tsconfig paths.',
    },
    {
      id: 'utilsAlias',
      kind: 'text',
      prompt: 'Configure the import alias for utils:',
      label: 'utils alias',
      detail: 'Home of the class-merging helpers shared by every component.',
    },
  ];
}

type Phase = 'reinit' | 'prompting' | 'confirming' | 'running' | 'done' | 'aborted' | 'failed';

interface State {
  phase: Phase;
  steps: Step[];
  stepIndex: number;
  answers: InitAnswers;
  /** False until the user answers the type — the header does not pre-empt the choice. */
  kindChosen: boolean;
  /** Valor e cursor do campo de texto ativo. */
  input: TextInput;
  choiceIndex: number;
  confirmValue: boolean;
  /** Validation error for the current step — clears when the user edits. */
  error: string | null;
  /** Blocks input while a check against disk is in flight. */
  checking: boolean;
  tasks: TaskLine[];
  tasksDone: number;
  /** When the current step started, so its elapsed time can be shown. */
  taskStartedAt: number;
  failure: string | null;
}

export interface InitWizardOptions {
  readonly cwd: string;
  readonly projectInfo: ProjectInfo;
  readonly packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  readonly isReInitializing: boolean;
  /** Skips the final confirmation (`--yes`). */
  readonly skipConfirmation: boolean;
  /**
   * The type asked for with `--type`, if any.
   *
   * The question is still asked — the flag only puts the cursor on what the user
   * already said they wanted, instead of making them find it in the list again.
   */
  readonly presetKind?: ProjectKind;
  /** O projeto pedido em `--project`, pelo mesmo motivo. */
  readonly presetProjectRoot?: string;
  /** O design system já escolhido. Presente, as perguntas que ele responde não são feitas. */
  readonly preset?: Preset;
  /** Execution steps, built only once the config is ready. */
  buildSteps(config: Config): InitStep[];
}

export interface InitWizardResult {
  readonly config: Config;
  readonly logs: readonly LogRecord[];
}

export async function runInitWizard(options: InitWizardOptions): Promise<InitWizardResult> {
  // The menu opens on the first type in the list, not on what the directory
  // suggests: the choice is the user's, and a cursor already parked on another
  // item would turn a CLI guess into the answer they confirm without reading.
  const firstKind = options.presetKind ?? (PROJECT_KINDS[0] as (typeof PROJECT_KINDS)[number]).value;
  const answers = defaultAnswers(options.projectInfo, firstKind, options.presetProjectRoot);
  const state: State = {
    // Re-initializing overwrites existing configuration: the confirmation comes
    // before any question and is not skipped by --yes.
    phase: options.isReInitializing ? 'reinit' : 'prompting',
    steps: baseSteps(options.projectInfo, firstKind, Boolean(options.preset)),
    stepIndex: 0,
    answers,
    kindChosen: false,
    input: startInput(answers.appConfig),
    choiceIndex: 0,
    confirmValue: true,
    error: null,
    checking: false,
    tasks: [],
    tasksDone: 0,
    taskStartedAt: 0,
    failure: null,
  };

  let config: Config | null = null;

  const currentStep = (): Step => state.steps[state.stepIndex] as Step;

  const answerOf = (step: Step): string => {
    if (step.id === 'overwriteCss') return 'yes';
    return state.answers[step.id];
  };

  /** Prepares the input fields for the step that has just become active. */
  const enterStep = (): void => {
    const step = currentStep();
    state.error = null;
    if (step.kind === 'text') {
      state.input = startInput(answerOf(step));
    } else if (step.kind === 'select') {
      const values = step.values ?? [];
      state.choiceIndex = Math.max(0, values.indexOf(answerOf(step)));
    } else {
      state.confirmValue = step.confirmDefault ?? true;
    }
  };

  // The first step needs its fields prepared too: without this the menu opens
  // with the cursor at the top instead of on the type detection suggested.
  enterStep();

  const startExecution = (ctx: WizardContext<Config>): void => {
    const resolved = buildConfig(state.answers, options.packageManager, options.preset);
    config = resolved;

    const steps = options.buildSteps(resolved);
    state.phase = 'running';
    state.tasks = steps.map(step => ({ label: step.label, note: step.note }));
    state.tasksDone = 0;
    state.taskStartedAt = Date.now();
    ctx.refresh();

    void (async () => {
      for (const step of steps) {
        state.taskStartedAt = Date.now();
        try {
          await step.run();
        } catch (error) {
          state.phase = 'failed';
          state.failure = `${step.label}: ${error instanceof Error ? error.message : String(error)}`;
          ctx.refresh();
          return;
        }
        state.tasksDone++;
        ctx.refresh();
      }
      state.phase = 'done';
      ctx.refresh();
    })();
  };

  const advance = (ctx: WizardContext<Config>): void => {
    if (state.stepIndex < state.steps.length - 1) {
      state.stepIndex++;
      enterStep();
      return;
    }
    if (options.skipConfirmation) {
      startExecution(ctx);
      return;
    }
    state.phase = 'confirming';
    state.confirmValue = true;
  };

  const goBack = (ctx: WizardContext<Config>): void => {
    if (state.phase === 'confirming') {
      state.phase = 'prompting';
      enterStep();
      return;
    }
    if (state.stepIndex === 0) {
      ctx.cancel();
      return;
    }
    state.stepIndex--;
    enterStep();
  };

  /** Insere ou remove o passo de sobrescrita conforme o CSS informado. */
  const syncOverwriteStep = (needed: boolean): void => {
    const index = state.steps.findIndex(step => step.id === 'overwriteCss');
    if (needed && index === -1) {
      state.steps.splice(state.stepIndex + 1, 0, OVERWRITE_STEP);
    } else if (!needed && index !== -1) {
      state.steps.splice(index, 1);
    }
  };

  const commit = (ctx: WizardContext<Config>, value: string): void => {
    const step = currentStep();

    if (step.id === 'overwriteCss') {
      if (value === 'no') {
        state.phase = 'aborted';
        return;
      }
      advance(ctx);
      return;
    }

    // Changing the project type changes the following questions and the defaults
    // that depend on it — the CSS path, for one, stops being the app's. The theme
    // is preserved because it does not depend on the type.
    if (step.id === 'kind') {
      const kind = value as ProjectKind;
      state.answers = { ...defaultAnswers(options.projectInfo, kind), theme: state.answers.theme };
      state.steps = baseSteps(options.projectInfo, kind, Boolean(options.preset));
      state.kindChosen = true;
      advance(ctx);
      return;
    }

    // Changing the target project moves app.config and the global CSS with it:
    // those are that project's paths, and leaving them pointing at the previous
    // one would make init write into the wrong app.
    if (step.id === 'projectRoot') {
      state.answers = {
        ...defaultAnswers(options.projectInfo, state.answers.kind, value),
        theme: state.answers.theme,
      };
      advance(ctx);
      return;
    }

    state.answers[step.id] = value;

    if (step.id !== 'globalCss') {
      advance(ctx);
      return;
    }

    // The CSS path is the only one that has to exist before going on: it is what
    // receives the theme tokens. A library has no pre-existing global CSS — init
    // creates the file, so "does not exist" is the expected case.
    state.checking = true;
    ctx.refresh();
    void inspectCssFile(options.cwd, value).then(
      result => {
        state.checking = false;
        if (result === 'missing' && !isLibraryKind(state.answers.kind)) {
          state.error = 'File not found. Check the path and try again.';
        } else {
          syncOverwriteStep(result === 'has-content');
          advance(ctx);
        }
        ctx.refresh();
      },
      error => {
        state.checking = false;
        state.error = error instanceof Error ? error.message : String(error);
        ctx.refresh();
      },
    );
  };

  const onKey = (event: KeyEvent, ctx: WizardContext<Config>): void => {
    if (state.checking || state.phase === 'running') return;

    if (state.phase === 'done') {
      if (event.key === 'enter' && config) ctx.done(config);
      return;
    }

    if (state.phase === 'failed') {
      if (event.key === 'enter') ctx.cancel(state.failure ?? 'Initialization failed.');
      return;
    }

    if (state.phase === 'aborted') {
      if (event.key === 'escape') {
        state.phase = 'prompting';
        state.confirmValue = true;
        return;
      }
      if (event.key === 'enter') ctx.cancel('Installation cancelled.');
      return;
    }

    if (state.phase === 'reinit') {
      if (event.key === 'left' || event.key === 'right') state.confirmValue = !state.confirmValue;
      else if (event.key === 'y' || event.key === 'Y') state.phase = 'prompting';
      else if (event.key === 'n' || event.key === 'N' || event.key === 'escape') {
        ctx.cancel('Re-initialization cancelled.');
      } else if (event.key === 'enter') {
        if (state.confirmValue) state.phase = 'prompting';
        else ctx.cancel('Re-initialization cancelled.');
      }
      return;
    }

    if (state.phase === 'confirming') {
      if (event.key === 'escape') goBack(ctx);
      else if (event.key === 'left' || event.key === 'right') state.confirmValue = !state.confirmValue;
      else if (event.key === 'y' || event.key === 'Y') startExecution(ctx);
      else if (event.key === 'n' || event.key === 'N') ctx.cancel();
      else if (event.key === 'enter') {
        if (state.confirmValue) startExecution(ctx);
        else ctx.cancel();
      }
      return;
    }

    const step = currentStep();

    if (event.key === 'escape') {
      goBack(ctx);
      return;
    }

    if (step.kind === 'text') {
      if (event.key === 'enter') {
        commit(ctx, state.input.value.trim() || answerOf(step));
        return;
      }

      const edited = editInput(state.input, event);
      if (edited) {
        state.input = edited;
        state.error = null;
      }
      return;
    }

    if (step.kind === 'select') {
      const values = step.values ?? [];
      if (event.key === 'up') state.choiceIndex = (state.choiceIndex - 1 + values.length) % values.length;
      else if (event.key === 'down') state.choiceIndex = (state.choiceIndex + 1) % values.length;
      else if (event.key === 'enter') commit(ctx, values[state.choiceIndex] ?? '');
      return;
    }

    if (event.key === 'y' || event.key === 'Y') commit(ctx, 'yes');
    else if (event.key === 'n' || event.key === 'N') commit(ctx, 'no');
    else if (event.key === 'left' || event.key === 'right') state.confirmValue = !state.confirmValue;
    else if (event.key === 'enter') commit(ctx, state.confirmValue ? 'yes' : 'no');
  };

  const view = (rows: number): Node => {
    const body: Node[] = [
      ...brandBanner(rows),
      text(''),
      commandHeader(options.isReInitializing ? 're-initialize' : 'initialize', targetDescription(state, options)),
      text(''),
    ];

    if (state.phase === 'prompting' || state.phase === 'confirming' || state.phase === 'aborted') {
      const answered = state.phase === 'confirming' ? state.steps.length : state.stepIndex;

      // O que veio do preset entra no transcript como resposta já dada: sem
      // isso, o tema simplesmente não apareceria em lugar nenhum, e a instalação
      // pareceria ter escolhido a cor sozinha.
      if (options.preset) body.push(answeredLine('preset', presetSummary(options.preset)));

      for (let index = 0; index < answered; index++) {
        const step = state.steps[index] as Step;
        body.push(answeredLine(step.label, displayValue(step, state)));
      }
      if (answered > 0 || options.preset) body.push(text(''));
    }

    if (state.phase === 'reinit') {
      body.push(question('zard/ui is already initialized. Re-initialize this project?'));
      body.push(confirmField(state.confirmValue));
      body.push(hint('This overwrites your existing components.json, theme tokens and shared utils.'));
      body.push(spacer());
      body.push(
        controls([
          ['y/n · ←/→', 'toggle'],
          ['enter', 'confirm'],
        ]),
      );
      return screen(page(...body));
    }

    if (state.phase === 'prompting') {
      body.push(...activeStep(state));
      body.push(spacer());
      body.push(controls(hintsFor(currentStep())));
    } else if (state.phase === 'confirming') {
      body.push(question('Write configuration to components.json?'));
      body.push(confirmField(state.confirmValue));
      body.push(hint('Nothing has been written yet — this is the last step before zard/ui touches your project.'));
      body.push(spacer());
      body.push(
        controls([
          ['y/n · ←/→', 'toggle'],
          ['enter', 'confirm'],
          ['esc', 'back'],
        ]),
      );
    } else if (state.phase === 'running' || state.phase === 'done' || state.phase === 'failed') {
      body.push(...executionBlock(state));
      body.push(spacer());
      if (state.phase === 'done') body.push(controls([['enter', 'finish']]));
      else if (state.phase === 'failed') body.push(controls([['enter', 'exit']]));
    } else {
      body.push(...abortBlock());
      body.push(spacer());
      body.push(
        controls([
          ['esc', 'go back'],
          ['enter', 'exit'],
        ]),
      );
    }

    return screen(page(...body));
  };

  const result = await runWizard<Config>({
    view: () => view(process.stdout.rows ?? 24),
    onKey,
  });

  return { config: result.value, logs: result.logs };
}

function displayValue(step: Step, state: State): string {
  if (step.id === 'overwriteCss') return 'yes';
  const value = state.answers[step.id];
  if (step.kind === 'select') {
    const index = (step.values ?? []).indexOf(value);
    return step.choices?.[index]?.label ?? value;
  }
  return value;
}

function activeStep(state: State): Node[] {
  const step = state.steps[state.stepIndex] as Step;
  const nodes: Node[] = [question(step.prompt)];

  if (step.kind === 'text') {
    nodes.push(textField(state.input.value, state.input.caret));
  } else if (step.kind === 'select') {
    nodes.push(...choiceList(step.choices ?? [], state.choiceIndex));
  } else {
    nodes.push(confirmField(state.confirmValue));
  }

  if (state.error) nodes.push(text(`   ✖  ${state.error}`, { color: 'danger', bold: true }));
  else if (state.checking) nodes.push(hint('Checking…'));
  else nodes.push(hint(step.detail));

  if (step.danger) nodes.push(warning(step.danger));

  return nodes;
}

function hintsFor(step: Step): [string, string][] {
  if (step.kind === 'text') {
    return [
      ['enter', 'confirm'],
      ['⌫', 'edit'],
      ['esc', 'back'],
    ];
  }
  if (step.kind === 'select') {
    return [
      ['↑/↓', 'choose'],
      ['enter', 'confirm'],
      ['esc', 'back'],
    ];
  }
  return [
    ['y/n · ←/→', 'toggle'],
    ['enter', 'confirm'],
    ['esc', 'back'],
  ];
}

function executionBlock(state: State): Node[] {
  const allDone = state.tasksDone >= state.tasks.length;
  const nodes: Node[] = [
    taskHeader(state.phase === 'failed' ? 'Initialization failed' : 'Writing configuration…', allDone),
    text(''),
    ...taskList(state.tasks, state.tasksDone, state.phase === 'running' ? Date.now() - state.taskStartedAt : undefined),
    text(''),
    progress(state.tasksDone, state.tasks.length),
  ];

  if (state.phase === 'failed') {
    nodes.push(text(''));
    nodes.push(resultPanel('danger', state.failure ?? 'Something went wrong.'));
    return nodes;
  }

  if (state.phase === 'done') {
    nodes.push(text(''));
    nodes.push(resultPanel('success', 'zard/ui has been initialized successfully!'));
  }

  return nodes;
}

function abortBlock(): Node[] {
  return [
    resultPanel('danger', 'Installation stopped'),
    text(''),
    text('   zard/ui must write its theme configuration into your global CSS.', { color: 'foreground' }),
    text('   Without it, the components will not render correctly.', { color: 'muted' }),
    text(''),
    text('   Nothing was changed. Run init again and accept that step, or move', { color: 'muted', dim: true }),
    text('   your existing styles elsewhere first.', { color: 'muted', dim: true }),
  ];
}

/**
 * O preset em uma linha, para o transcript.
 *
 * Mostra o código quando existe um — é ele que quem leu a instalação vai colar
 * no próximo projeto. Um preset com cores editadas à mão não tem código, e aí
 * ficam só os nomes, que é o que há para mostrar.
 */
function presetSummary(preset: Preset): string {
  const catalog = presetCatalog();
  const baseColor = entryById(catalog.baseColors, preset.baseColor)?.label ?? preset.baseColor;
  const theme = entryById(catalog.themes, preset.theme)?.label ?? preset.theme;
  const radius = entryById(catalog.radii, preset.radius)?.label ?? preset.radius;

  const description = `${baseColor} · ${theme} · radius ${radius.toLowerCase()}`;

  try {
    const code = encodePreset(preset, catalog);
    return code ? `${code} — ${description}` : description;
  } catch {
    return description;
  }
}
