import { PROJECT_KINDS, isLibraryKind } from '@cli/commands/init/project-kind.js';
import { initProject, type InitProjectResult } from '@cli/commands/init/run.js';
import { printReport } from '@cli/ui/index.js';
import { type Config } from '@cli/utils/config.js';
import { suggestedRunner } from '@cli/utils/package-manager.js';
import { loadPresetCatalog, presetCatalog } from '@cli/utils/preset-catalog.js';
import { resolvePresetInput } from '@cli/utils/preset-input.js';
import { getRegistryUrl } from '@cli/utils/registry.js';
import { Command } from 'commander';
import * as path from 'node:path';

export const init = new Command()
  .name('init')
  .description('initialize your project and install dependencies')
  .option('-y, --yes', 'skip confirmation prompt.', false)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('-t, --type <type>', `the project type: ${PROJECT_KINDS.map(kind => kind.value).join(', ')}.`)
  .option('-p, --project <name>', 'the workspace project to configure. defaults to the first compatible one.')
  .option(
    '--preset <preset>',
    'the design system to set up: a preset code from zardui.com/create, a path to a zard.preset.json, or a URL.',
  )
  .action(async options => {
    const cwd = path.resolve(options.cwd);

    // O preset é resolvido antes de qualquer escrita: um código inválido tem que
    // parar o comando com o projeto intacto, e não no meio da instalação.
    const preset = options.preset ? await resolvePreset(options.preset, cwd) : undefined;

    const result = await initProject({
      cwd,
      yes: options.yes,
      type: options.type,
      project: options.project,
      preset,
    });

    if (result.cancelled) {
      printReport({
        status: 'cancelled',
        headline: result.cancelReason ?? 'Cancelled.',
        notes: ['Nothing was changed in your project.'],
      });
      process.exit(0);
    }

    reportSuccess(result);
  });

async function resolvePreset(value: string, cwd: string) {
  await loadPresetCatalog(getRegistryUrl());

  return resolvePresetInput(value, { cwd, catalog: presetCatalog() });
}

function reportSuccess({ config, steps, logs }: InitProjectResult): void {
  printReport({
    status: 'success',
    headline: 'zard/ui has been initialized successfully!',
    items: steps.map(step => `${step.label} — ${step.note}`),
    notes: nextStepsFor(config),
    commands: [{ command: `${suggestedRunner(config.packageManager)} zard-cli add`, argument: '[component]' }],
    logs: [...logs],
  });
}

/**
 * O que ainda falta fazer à mão.
 *
 * Numa biblioteca o init não tem onde registrar `provideZard()` nem como
 * importar os tokens — as duas coisas pertencem ao app que consome a lib, e
 * sem esse aviso o usuário só descobre quando os componentes não renderizam.
 */
function nextStepsFor(config: Config): string[] {
  if (!isLibraryKind(config.projectType)) {
    return ['You can now add components using:'];
  }

  return [
    'The consuming app still needs to register provideZard() in its app.config.ts',
    `and import the theme tokens from this library's ${path.basename(config.tailwind.css)}.`,
    '',
    'You can now add components using:',
  ];
}
