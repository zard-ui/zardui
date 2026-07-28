import { buildConfig, defaultAnswers, inspectCssFile, type InitAnswers } from '@cli/commands/init/config-prompter.js';
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
  runWizard,
  screen,
  spacer,
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
  type WizardContext,
} from '@cli/ui/index.js';
import { type Config } from '@cli/utils/config.js';
import { type ProjectInfo } from '@cli/utils/get-project-info.js';
import { getAvailableThemes, getThemeDisplayName } from '@cli/utils/theme-selector.js';

type StepKind = 'text' | 'select' | 'confirm';

interface Step {
  readonly id: keyof InitAnswers | 'overwriteCss';
  readonly kind: StepKind;
  /** Enunciado, idêntico ao que a CLI perguntava antes. */
  readonly prompt: string;
  /** Rótulo curto usado no transcript das respostas. */
  readonly label: string;
  /** O que a etapa faz — some assim que ela é respondida. */
  readonly detail: string;
  readonly choices?: readonly Choice[];
  readonly values?: readonly string[];
  readonly confirmDefault?: boolean;
  /** Aviso exibido quando recusar a etapa interrompe a instalação. */
  readonly danger?: string;
}

const OVERWRITE_STEP: Step = {
  id: 'overwriteCss',
  kind: 'confirm',
  prompt:
    'Your CSS file already has content. This will overwrite everything with ZardUI theme configuration. Continue?',
  label: 'overwrite CSS',
  detail: 'The theme tokens must live in your global CSS, or the components will not render.',
  confirmDefault: true,
  danger: 'Choosing No cancels the installation. This step is essential for ZardUI to work.',
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

function baseSteps(): Step[] {
  return [
    {
      id: 'appConfig',
      kind: 'text',
      prompt: 'Where is your app.config.ts file?',
      label: 'app.config.ts',
      detail: 'ZardUI registers its global providers in this file.',
    },
    themeStep(),
    {
      id: 'globalCss',
      kind: 'text',
      prompt: 'Where is your global CSS file?',
      label: 'global CSS',
      detail: 'ZardUI writes its design tokens and the base layer into this file.',
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
  input: string;
  /**
   * true enquanto o campo ainda mostra o valor sugerido e o usuário não digitou
   * nada: a primeira tecla substitui a sugestão inteira, em vez de emendar nela.
   */
  inputPristine: boolean;
  choiceIndex: number;
  confirmValue: boolean;
  /** Erro de validação do passo atual — some quando o usuário edita. */
  error: string | null;
  /** Bloqueia a entrada enquanto uma checagem em disco está em curso. */
  checking: boolean;
  tasks: TaskLine[];
  tasksDone: number;
  /** Quando a etapa atual começou, para exibir há quanto tempo ela roda. */
  taskStartedAt: number;
  failure: string | null;
}

export interface InitWizardOptions {
  readonly cwd: string;
  readonly projectInfo: ProjectInfo;
  readonly packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  readonly isReInitializing: boolean;
  /** Pula a confirmação final (`--yes`). */
  readonly skipConfirmation: boolean;
  /** Etapas de execução, montadas só quando o config está pronto. */
  buildSteps(config: Config): InitStep[];
}

export interface InitWizardResult {
  readonly config: Config;
  readonly logs: readonly LogRecord[];
}

export async function runInitWizard(options: InitWizardOptions): Promise<InitWizardResult> {
  const answers = defaultAnswers(options.projectInfo);
  const state: State = {
    // Reinicializar sobrescreve configuração já existente: a confirmação vem
    // antes de qualquer pergunta e não é pulada por --yes.
    phase: options.isReInitializing ? 'reinit' : 'prompting',
    steps: baseSteps(),
    stepIndex: 0,
    answers,
    input: answers.appConfig,
    inputPristine: true,
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

  /** Prepara os campos de entrada para o passo que acabou de virar ativo. */
  const enterStep = (): void => {
    const step = currentStep();
    state.error = null;
    if (step.kind === 'text') {
      state.input = answerOf(step);
      state.inputPristine = true;
    } else if (step.kind === 'select') {
      const values = step.values ?? [];
      state.choiceIndex = Math.max(0, values.indexOf(answerOf(step)));
    } else {
      state.confirmValue = step.confirmDefault ?? true;
    }
  };

  const startExecution = (ctx: WizardContext<Config>): void => {
    const resolved = buildConfig(state.answers, options.packageManager);
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

    state.answers[step.id] = value;

    if (step.id !== 'globalCss') {
      advance(ctx);
      return;
    }

    // O caminho do CSS é o único que precisa existir antes de seguir: é ele que
    // recebe os tokens do tema.
    state.checking = true;
    ctx.refresh();
    void inspectCssFile(options.cwd, value).then(
      result => {
        state.checking = false;
        if (result === 'missing') {
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
        const value = state.input.trim() || answerOf(step);
        commit(ctx, value);
      } else if (event.key === 'backspace') {
        // Backspace assume o valor sugerido e passa a editá-lo.
        state.inputPristine = false;
        state.input = [...state.input].slice(0, -1).join('');
        state.error = null;
      } else if (event.key.length === 1 && !event.ctrl && !event.alt) {
        state.input = state.inputPristine ? event.key : state.input + event.key;
        state.inputPristine = false;
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
      commandHeader(
        options.isReInitializing ? 're-initialize' : 'initialize',
        `Setting up ZardUI in your ${options.projectInfo.hasNx ? 'Nx' : 'Angular'} project…`,
      ),
      text(''),
    ];

    if (state.phase === 'prompting' || state.phase === 'confirming' || state.phase === 'aborted') {
      const answered = state.phase === 'confirming' ? state.steps.length : state.stepIndex;
      for (let index = 0; index < answered; index++) {
        const step = state.steps[index] as Step;
        body.push(answeredLine(step.label, displayValue(step, state)));
      }
      if (answered > 0) body.push(text(''));
    }

    if (state.phase === 'reinit') {
      body.push(question('ZardUI is already initialized. Re-initialize this project?'));
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
      body.push(hint('Nothing has been written yet — this is the last step before ZardUI touches your project.'));
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
    nodes.push(textField(state.input));
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
    nodes.push(resultPanel('success', 'ZardUI has been initialized successfully!'));
  }

  return nodes;
}

function abortBlock(): Node[] {
  return [
    resultPanel('danger', 'Installation stopped'),
    text(''),
    text('   ZardUI must write its theme configuration into your global CSS.', { color: 'foreground' }),
    text('   Without it, the components will not render correctly.', { color: 'muted' }),
    text(''),
    text('   Nothing was changed. Run init again and accept that step, or move', { color: 'muted', dim: true }),
    text('   your existing styles elsewhere first.', { color: 'muted', dim: true }),
  ];
}
