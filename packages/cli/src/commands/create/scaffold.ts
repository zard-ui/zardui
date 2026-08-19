/**
 * O projeto vazio, antes de o zard entrar nele.
 *
 * Cada template é um gerador de terceiros, e o que este arquivo faz é montar a
 * linha de comando de cada um — nada mais. A montagem fica separada da execução
 * de propósito: é o comando montado que os testes verificam, porque rodar o
 * gerador de verdade num teste levaria minutos e dependeria da rede, e o que
 * quebra na prática é uma flag renomeada, não o `execa`.
 *
 * As flags abaixo foram conferidas com `--help` de cada gerador. Elas mudam: se
 * uma sumir, o gerador falha com a mensagem dele, e o relatório entrega o
 * comando pronto para a pessoa rodar à mão.
 */

import { CliError } from '@cli/utils/errors.js';
import { logger } from '@cli/utils/logger.js';
import type { PackageManager } from '@cli/utils/package-manager.js';
import { execa } from 'execa';

export type CreateTemplate = 'angular' | 'angular-library' | 'nx' | 'nx-library' | 'analog';

export interface TemplateOption {
  readonly value: CreateTemplate;
  readonly label: string;
  readonly detail: string;
}

export const CREATE_TEMPLATES: readonly TemplateOption[] = [
  { value: 'angular', label: 'Angular', detail: 'A standalone Angular application.' },
  {
    value: 'angular-library',
    label: 'Angular Library',
    detail: 'A publishable library, plus a workspace to build it.',
  },
  { value: 'nx', label: 'Nx', detail: 'An Angular application inside an Nx workspace.' },
  { value: 'nx-library', label: 'Nx Library', detail: 'An Nx workspace whose components live in a library.' },
  { value: 'analog', label: 'Analog.js', detail: 'A Vite-powered Angular app. Its generator asks its own questions.' },
];

export interface ScaffoldCommand {
  readonly file: string;
  readonly args: string[];
  /**
   * O gerador só roda com alguém para responder.
   *
   * `create-analog` não publica modo não interativo — nem `--help` ele tem. Em
   * CI isso é um beco sem saída, e é melhor dizê-lo antes de criar o diretório
   * do que travar num prompt que ninguém vai ver.
   */
  readonly needsTerminal?: boolean;
  /** O gerador instala as dependências de qualquer jeito; `--no-install` não o alcança. */
  readonly alwaysInstalls?: boolean;
}

export interface ScaffoldOptions {
  readonly name: string;
  readonly template: CreateTemplate;
  readonly packageManager: PackageManager;
  readonly install: boolean;
  readonly git: boolean;
}

/** O que o Nx chama de preset para cada um dos nossos dois templates. */
const NX_PRESET: Record<'nx' | 'nx-library', string> = {
  nx: 'angular-standalone',
  'nx-library': 'angular-monorepo',
};

export function scaffoldCommandFor(options: ScaffoldOptions): ScaffoldCommand {
  const { name, template, packageManager, install, git } = options;

  if (template === 'angular' || template === 'angular-library') {
    return {
      file: 'npx',
      args: [
        '-y',
        '@angular/cli@latest',
        'new',
        name,
        '--style=css',
        '--ssr=false',
        `--package-manager=${packageManager}`,
        '--defaults',
        // Numa biblioteca o workspace nasce sem aplicação: `ng generate library`
        // é o passo seguinte, e criar um app junto deixaria para trás um
        // projeto que ninguém pediu.
        ...(template === 'angular-library' ? ['--create-application=false'] : []),
        ...(install ? [] : ['--skip-install']),
        ...(git ? [] : ['--skip-git']),
      ],
    };
  }

  if (template === 'nx' || template === 'nx-library') {
    return {
      file: 'npx',
      args: [
        '-y',
        'create-nx-workspace@latest',
        name,
        `--preset=${NX_PRESET[template]}`,
        '--style=css',
        '--e2eTestRunner=none',
        '--nxCloud=skip',
        `--packageManager=${packageManager}`,
        '--interactive=false',
        ...(git ? [] : ['--skipGit']),
      ],
      // O create-nx-workspace não expõe nada equivalente a --skip-install: ele
      // precisa das dependências instaladas para rodar os próprios generators.
      alwaysInstalls: true,
    };
  }

  return {
    file: 'npx',
    args: ['-y', 'create-analog@latest', name],
    needsTerminal: true,
    alwaysInstalls: true,
  };
}

/** O comando como alguém o digitaria — para o relatório quando ele falha. */
export function describeCommand({ file, args }: ScaffoldCommand): string {
  return [file, ...args].join(' ');
}

export interface RunScaffoldOptions extends ScaffoldOptions {
  /** Onde o diretório do projeto será criado. */
  readonly cwd: string;
  readonly interactive: boolean;
}

/**
 * Roda o gerador.
 *
 * `execa` com argumentos separados, e não uma linha de shell: um nome de projeto
 * com espaço ou aspas viraria injeção de comando, e no Windows a linha montada
 * nem sequer passaria pelo mesmo interpretador.
 */
export async function runScaffold(options: RunScaffoldOptions): Promise<void> {
  const command = scaffoldCommandFor(options);

  if (command.needsTerminal && !options.interactive) {
    throw new CliError(
      `The ${options.template} generator only runs with an interactive terminal. ` +
        `Run \`${describeCommand(command)}\` yourself, then \`zard-cli init --preset <code>\` inside it.`,
      'GENERATOR_NEEDS_TTY',
    );
  }

  logger.debug(`Scaffolding with: ${describeCommand(command)}`);

  try {
    await execa(command.file, command.args, {
      cwd: options.cwd,
      // O gerador é quem fala com quem está olhando enquanto roda: engolir a
      // saída dele deixaria a instalação de dependências parecendo travada, e no
      // Analog esconderia as perguntas que precisam ser respondidas.
      stdio: 'inherit',
    });
  } catch (error) {
    logger.debug(`Generator failed: ${error instanceof Error ? error.message : String(error)}`);

    throw new CliError(
      `The ${options.template} generator failed. Run it yourself to see why:\n  ${describeCommand(command)}`,
      'SCAFFOLD_FAILED',
    );
  }
}
