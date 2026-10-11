/**
 * The questions `create` asks when the flags did not answer them: template, then name, then preset.
 *
 * Only the questions live here. When they are answered the screen closes and the scaffolding runs
 * in the terminal's normal flow, where the generators' own output stays readable and scrollable.
 * The first question opens with the cursor on the first template — never on one the CLI guessed.
 */

import { nameProblem, targetProblem } from '@cli/commands/create/options.js';
import { CREATE_URL, CUSTOM_PRESET, presetChoices, type PresetChoice } from '@cli/commands/create/preset-choices.js';
import { TEMPLATES, type TemplateOption } from '@cli/commands/create/templates.js';
import { type AppliedPreset } from '@cli/commands/init/config-prompter.js';
import { resolvePreset } from '@cli/commands/init/preset.js';
import {
  answeredLine,
  brandBanner,
  choiceList,
  commandHeader,
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
  type KeyEvent,
  type Node,
} from '@cli/ui/index.js';
import { CliError } from '@cli/utils/errors.js';

export interface CreateAnswers {
  readonly template: TemplateOption;
  readonly name: string;
  readonly preset: AppliedPreset;
}

export interface CreateWizardOptions {
  readonly cwd: string;
  /** Answers already given as flags: their questions are skipped. */
  readonly template?: TemplateOption;
  readonly name?: string;
  readonly preset?: AppliedPreset;
  /** The name proposed in the field before the user types. */
  readonly suggestedName?: string;
  /** Hook for tests: where the choices come from. */
  readonly presetOptions?: readonly PresetChoice[];
}

type StepId = 'template' | 'name' | 'preset' | 'customPreset';

const VISIBLE_ROWS = 8;

/** The slice of a long list around the active item, so the list never outgrows the screen. */
export function windowOf<T>(items: readonly T[], active: number, size = VISIBLE_ROWS): { start: number; items: T[] } {
  if (items.length <= size) return { start: 0, items: [...items] };

  const start = Math.max(0, Math.min(active - Math.floor(size / 2), items.length - size));
  return { start, items: items.slice(start, start + size) };
}

export async function runCreateWizard(options: CreateWizardOptions): Promise<CreateAnswers> {
  const presets = options.presetOptions ?? presetChoices();

  const steps: StepId[] = [];
  if (!options.template) steps.push('template');
  if (!options.name) steps.push('name');
  if (!options.preset) steps.push('preset');

  const state = {
    stepIndex: 0,
    template: options.template,
    name: options.name,
    preset: options.preset,
    choice: 0,
    input: startInput(options.suggestedName ?? 'my-app'),
    error: null as string | null,
  };

  const current = (): StepId => steps[state.stepIndex] as StepId;

  const enter = (): void => {
    state.error = null;
    state.choice = 0;
    if (current() === 'name') state.input = startInput(state.name ?? options.suggestedName ?? 'my-app');
    if (current() === 'customPreset') state.input = startInput('');
  };

  const labelOfTemplate = (): string => state.template?.label ?? '';

  const result = await runWizard<CreateAnswers>({
    view: () => view(),
    onKey: (event, ctx) => {
      const step = current();

      if (event.key === 'escape') {
        if (step === 'customPreset') {
          steps.splice(state.stepIndex, 1);
          state.stepIndex--;
          enter();
        } else if (state.stepIndex === 0) ctx.cancel();
        else {
          state.stepIndex--;
          enter();
        }
        ctx.refresh();
        return;
      }

      const finish = (): void => {
        if (state.stepIndex < steps.length - 1) {
          state.stepIndex++;
          enter();
          return;
        }
        ctx.done({
          template: state.template as TemplateOption,
          name: state.name as string,
          preset: state.preset as AppliedPreset,
        });
      };

      if (step === 'template') {
        if (moveChoice(event, TEMPLATES.length)) return;
        if (event.key === 'enter') {
          state.template = TEMPLATES[state.choice];
          finish();
        }
      } else if (step === 'preset') {
        if (moveChoice(event, presets.length)) return;
        if (event.key === 'enter') {
          const picked = presets[state.choice] as PresetChoice;
          if (picked.value === CUSTOM_PRESET) {
            steps.splice(state.stepIndex + 1, 0, 'customPreset');
            state.stepIndex++;
            enter();
            return;
          }
          state.preset = resolvePreset(picked.value);
          finish();
        }
      } else {
        // name, customPreset: single-line text
        if (event.key === 'enter') {
          const value = state.input.value.trim();
          if (step === 'name') {
            const problem = nameProblem(value) ?? targetProblem(options.cwd, value);
            if (problem) state.error = problem;
            else {
              state.name = value;
              finish();
            }
          } else {
            try {
              state.preset = resolvePreset(value);
              finish();
            } catch (error) {
              state.error = error instanceof CliError ? error.message : String(error);
            }
          }
        } else {
          const edited = editInput(state.input, event);
          if (edited) {
            state.input = edited;
            state.error = null;
          }
        }
      }

      ctx.refresh();
    },
  });

  return result.value;

  /** Moves the cursor of a list; returns whether the key was one of those. */
  function moveChoice(event: KeyEvent, length: number): boolean {
    if (event.key === 'up') state.choice = (state.choice - 1 + length) % length;
    else if (event.key === 'down') state.choice = (state.choice + 1) % length;
    else return false;
    return true;
  }

  function view(): Node {
    const rows = process.stdout.rows ?? 24;
    const body: Node[] = [
      ...brandBanner(rows),
      text(''),
      commandHeader('create', 'Setting up a new zard/ui project…'),
      text(''),
    ];

    // The transcript: what was answered so far, in the order it was asked.
    if (state.template && current() !== 'template') body.push(answeredLine('template', labelOfTemplate()));
    if (state.name && steps.indexOf('name') < state.stepIndex) body.push(answeredLine('name', state.name));
    if (state.template || state.name) body.push(text(''));

    const step = current();
    if (step === 'template') {
      body.push(question('Which template do you want to start from?'));
      body.push(
        ...choiceList(
          TEMPLATES.map(template => ({ label: template.label, hint: template.detail, color: template.color })),
          state.choice,
        ),
      );
      body.push(hint('The project is generated with the framework’s own tool, then configured for zard/ui.'));
    } else if (step === 'name') {
      body.push(question('What is your project called?'));
      body.push(textField(state.input.value, state.input.caret));
      body.push(statusLine(`It becomes the directory name, in ${options.cwd}.`));
    } else if (step === 'preset') {
      body.push(question('Which design do you want to start from?'));
      const shown = windowOf(presets, state.choice);
      if (shown.start > 0) body.push(hint(`↑ ${shown.start} more`));
      body.push(
        ...choiceList(
          shown.items.map(item => ({ label: item.label, hint: item.hint })),
          state.choice - shown.start,
        ),
      );
      const below = presets.length - shown.start - shown.items.length;
      if (below > 0) body.push(hint(`↓ ${below} more`));
      body.push(hint('A preset is the style, colors, fonts, icons and radius in one code.'));
    } else {
      body.push(question('Paste your preset code:'));
      body.push(textField(state.input.value, state.input.caret));
      body.push(statusLine(`Design one at ${CREATE_URL}, then copy its code (or the whole command).`));
    }

    body.push(spacer());
    body.push(controls(hintsFor(step)));
    return screen(page(...body));
  }

  function statusLine(fallback: string): Node {
    return state.error ? text(`   ✖  ${state.error}`, { color: 'danger', bold: true }) : hint(fallback);
  }
}

function hintsFor(step: StepId): [string, string][] {
  if (step === 'name' || step === 'customPreset') {
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
