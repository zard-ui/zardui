/**
 * As perguntas do `create`.
 *
 * Só coleta — quem executa é o comando. A separação não é estética: o gerador de
 * cada template escreve direto no terminal (`stdio: 'inherit'`), e a tela cheia
 * do wizard não pode estar montada quando isso acontece, ou as duas saídas
 * disputam o mesmo espaço e nenhuma fica legível.
 */

import { assertDirectoryAvailable, projectNameProblem } from '@cli/commands/create/project-name.js';
import { CREATE_TEMPLATES, type CreateTemplate } from '@cli/commands/create/scaffold.js';
import {
  answeredLine,
  brandBanner,
  choiceList,
  commandHeader,
  confirmField,
  controls,
  editInput,
  hint,
  page,
  question,
  runWizard,
  screen,
  spacer,
  startInput,
  text,
  textField,
  type Choice,
  type KeyEvent,
  type Node,
  type TextInput,
  type WizardContext,
} from '@cli/ui/index.js';
import { CliError } from '@cli/utils/errors.js';
import type { PackageManager } from '@cli/utils/package-manager.js';
import { decodePreset, entryById, selectable, type Preset, type PresetCatalog } from '@zardui/preset';

const PACKAGE_MANAGERS: readonly PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];

type StepId = 'name' | 'template' | 'preset' | 'packageManager';

interface Step {
  readonly id: StepId;
  readonly kind: 'text' | 'select';
  readonly prompt: string;
  readonly label: string;
  readonly detail: string;
  readonly choices?: readonly Choice[];
  readonly values?: readonly string[];
}

export interface CreateWizardOptions {
  readonly cwd: string;
  /** O que já veio por argumento; a pergunta correspondente não é feita. */
  readonly name?: string;
  readonly template?: CreateTemplate;
  readonly preset?: Preset;
  readonly packageManager: PackageManager;
  readonly catalog: PresetCatalog;
}

export interface CreateWizardResult {
  readonly name: string;
  readonly template: CreateTemplate;
  readonly preset: Preset;
  readonly packageManager: PackageManager;
}

interface State {
  phase: 'prompting' | 'confirming';
  steps: Step[];
  stepIndex: number;
  answers: Record<StepId, string>;
  input: TextInput;
  choiceIndex: number;
  confirmValue: boolean;
  error: string | null;
}

function templateStep(): Step {
  return {
    id: 'template',
    kind: 'select',
    prompt: 'What are you building?',
    label: 'template',
    detail: 'Decides which generator creates the project and how zard/ui is wired into it.',
    choices: CREATE_TEMPLATES.map(option => ({ label: option.label, hint: option.detail })),
    values: CREATE_TEMPLATES.map(option => option.value),
  };
}

/**
 * A escolha do design system, entre os presets prontos.
 *
 * O catálogo inteiro seriam 5 × 18 × 3 × 5 combinações, que não é uma lista —
 * é o `/create`. Quem quer uma combinação específica traz o código dela em
 * `--preset`, que é exatamente o que a página devolve.
 */
function presetStep(catalog: PresetCatalog): Step {
  const presets = catalog.presets;

  return {
    id: 'preset',
    kind: 'select',
    prompt: 'Pick a design system:',
    label: 'design system',
    detail: 'Build your own at zardui.com/create and pass the code with --preset.',
    choices: presets.map(preset => ({ label: preset.label, hint: preset.code })),
    values: presets.map(preset => preset.code),
  };
}

function packageManagerStep(): Step {
  return {
    id: 'packageManager',
    kind: 'select',
    prompt: 'Which package manager?',
    label: 'package manager',
    detail: 'Used by the generator and by every zard-cli command in the project.',
    choices: PACKAGE_MANAGERS.map(manager => ({ label: manager })),
    values: [...PACKAGE_MANAGERS],
  };
}

function buildSteps(options: CreateWizardOptions): Step[] {
  const steps: Step[] = [];

  if (!options.name) {
    steps.push({
      id: 'name',
      kind: 'text',
      prompt: 'What is your project called?',
      label: 'name',
      detail: 'Becomes the directory and the package name.',
    });
  }

  if (!options.template) steps.push(templateStep());
  if (!options.preset) steps.push(presetStep(options.catalog));

  steps.push(packageManagerStep());

  return steps;
}

export async function runCreateWizard(options: CreateWizardOptions): Promise<CreateWizardResult> {
  const steps = buildSteps(options);
  const firstPreset = options.catalog.presets[0]?.code ?? '';

  const state: State = {
    phase: 'prompting',
    steps,
    stepIndex: 0,
    answers: {
      name: options.name ?? '',
      template: options.template ?? (CREATE_TEMPLATES[0] as (typeof CREATE_TEMPLATES)[number]).value,
      preset: firstPreset,
      packageManager: options.packageManager,
    },
    input: startInput(options.name ?? ''),
    choiceIndex: 0,
    confirmValue: true,
    error: null,
  };

  const currentStep = (): Step => state.steps[state.stepIndex] as Step;

  const enterStep = (): void => {
    const step = currentStep();
    state.error = null;

    if (step.kind === 'text') {
      state.input = startInput(state.answers[step.id]);
    } else {
      state.choiceIndex = Math.max(0, (step.values ?? []).indexOf(state.answers[step.id]));
    }
  };

  enterStep();

  const finish = (ctx: WizardContext<CreateWizardResult>): void => {
    ctx.done({
      name: state.answers.name,
      template: state.answers.template as CreateTemplate,
      preset: options.preset ?? decodePreset(state.answers.preset, options.catalog),
      packageManager: state.answers.packageManager as PackageManager,
    });
  };

  const advance = (): void => {
    if (state.stepIndex < state.steps.length - 1) {
      state.stepIndex++;
      enterStep();
      return;
    }

    state.phase = 'confirming';
    state.confirmValue = true;
  };

  const goBack = (ctx: WizardContext<CreateWizardResult>): void => {
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

  const commit = (value: string): void => {
    const step = currentStep();

    // O nome é validado aqui, e não depois: descobrir que ele não serve com o
    // gerador já rodando deixaria um diretório pela metade para trás.
    if (step.id === 'name') {
      const problem = projectNameProblem(value);
      if (problem) {
        state.error = problem;
        return;
      }

      try {
        assertDirectoryAvailable(options.cwd, value.trim());
      } catch (error) {
        state.error = error instanceof CliError ? error.message : String(error);
        return;
      }
    }

    state.answers[step.id] = value.trim();
    advance();
  };

  const onKey = (event: KeyEvent, ctx: WizardContext<CreateWizardResult>): void => {
    if (state.phase === 'confirming') {
      if (event.key === 'escape') goBack(ctx);
      else if (event.key === 'left' || event.key === 'right') state.confirmValue = !state.confirmValue;
      else if (event.key === 'y' || event.key === 'Y') finish(ctx);
      else if (event.key === 'n' || event.key === 'N') ctx.cancel();
      else if (event.key === 'enter') {
        if (state.confirmValue) finish(ctx);
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
        commit(state.input.value.trim() || state.answers[step.id]);
        return;
      }

      const edited = editInput(state.input, event);
      if (edited) {
        state.input = edited;
        state.error = null;
      }
      return;
    }

    const values = step.values ?? [];
    if (event.key === 'up') state.choiceIndex = (state.choiceIndex - 1 + values.length) % values.length;
    else if (event.key === 'down') state.choiceIndex = (state.choiceIndex + 1) % values.length;
    else if (event.key === 'enter') commit(values[state.choiceIndex] ?? '');
  };

  const view = (rows: number): Node => {
    const body: Node[] = [...brandBanner(rows), text(''), commandHeader('create', headline(state, options)), text('')];

    const answered = state.phase === 'confirming' ? state.steps.length : state.stepIndex;

    for (let index = 0; index < answered; index++) {
      const step = state.steps[index] as Step;
      body.push(answeredLine(step.label, displayValue(step, state, options)));
    }

    if (answered > 0) body.push(text(''));

    if (state.phase === 'confirming') {
      body.push(question('Create the project with these settings?'));
      body.push(confirmField(state.confirmValue));
      body.push(hint('The generator runs first, then zard/ui is set up inside it.'));
      body.push(spacer());
      body.push(
        controls([
          ['y/n · ←/→', 'toggle'],
          ['enter', 'confirm'],
          ['esc', 'back'],
        ]),
      );

      return screen(page(...body));
    }

    const step = currentStep();
    body.push(question(step.prompt));

    if (step.kind === 'text') body.push(textField(state.input.value, state.input.caret));
    else body.push(...choiceList(step.choices ?? [], state.choiceIndex));

    if (state.error) body.push(text(`   ✖  ${state.error}`, { color: 'danger', bold: true }));
    else body.push(hint(step.detail));

    body.push(spacer());
    body.push(controls(controlsFor(step)));

    return screen(page(...body));
  };

  const result = await runWizard<CreateWizardResult>({
    view: () => view(process.stdout.rows ?? 24),
    onKey,
  });

  return result.value;
}

function headline(state: State, options: CreateWizardOptions): string {
  const name = state.answers.name || options.name;

  return name ? `Creating ${name}…` : 'Creating a new project with zard/ui…';
}

function displayValue(step: Step, state: State, options: CreateWizardOptions): string {
  const value = state.answers[step.id];

  if (step.id === 'preset') return describePresetCode(value, options.catalog);

  if (step.kind === 'select') {
    const index = (step.values ?? []).indexOf(value);
    return step.choices?.[index]?.label ?? value;
  }

  return value;
}

/** O preset pelo nome do que ele contém, e não só pelo código. */
function describePresetCode(code: string, catalog: PresetCatalog): string {
  const named = catalog.presets.find(preset => preset.code === code);

  try {
    const preset = decodePreset(code, catalog);
    const baseColor = entryById(catalog.baseColors, preset.baseColor)?.label ?? preset.baseColor;
    const theme = entryById(selectable(catalog.themes), preset.theme)?.label ?? preset.theme;
    const description = preset.theme === 'neutral' ? baseColor : `${baseColor} · ${theme}`;

    return named ? `${named.label} — ${description}` : description;
  } catch {
    return named?.label ?? code;
  }
}

/** As teclas que valem no passo atual. */
function controlsFor(step: Step): [string, string][] {
  if (step.kind === 'text') {
    return [
      ['enter', 'confirm'],
      ['⌫', 'edit'],
      ['esc', 'back'],
    ];
  }

  return [
    ['↑/↓', 'choose'],
    ['enter', 'confirm'],
    ['esc', 'back'],
  ];
}
