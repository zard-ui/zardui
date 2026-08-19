/**
 * O componente de exemplo e a home que o mostra.
 *
 * Um projeto recém-criado que abre na página padrão do gerador não prova nada:
 * a pessoa rodou um comando que promete "um projeto com zard/ui pronto" e vê
 * exatamente a mesma tela de sempre. Instalar um botão e colocá-lo na home é o
 * que transforma o `create` num resultado visível — e é o teste de fumaça mais
 * barato de que os tokens, os aliases e os providers ficaram todos no lugar.
 *
 * Nada aqui é obrigatório: `--no-example` existe, e cada passo que não casa com
 * o que o gerador produziu é reportado em vez de quebrar. O projeto já está de
 * pé; o exemplo é cortesia.
 */

import { installComponent } from '@cli/commands/add/component-installer.js';
import { getTargetDir, resolveDependencies } from '@cli/commands/add/dependency-resolver.js';
import { isLibraryKind } from '@cli/commands/init/project-kind.js';
import { resolveConfigPaths, type Config } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import { installPackagesWithRetry } from '@cli/utils/package-manager.js';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

/** O componente que o exemplo usa. Um botão é o menor que ainda parece um design system. */
const EXAMPLE_COMPONENT = 'button';

export interface ExampleResult {
  /** `true` quando a home passou a mostrar o componente. */
  readonly homeRewritten: boolean;
  /** O que não deu para fazer, em linguagem de relatório. */
  readonly skipped: string[];
}

export interface InstallExampleOptions {
  readonly cwd: string;
  readonly config: Config;
  readonly install: boolean;
}

export async function installExample(options: InstallExampleOptions): Promise<ExampleResult> {
  const { cwd, config } = options;
  const skipped: string[] = [];

  const resolved = await resolveConfigPaths(cwd, config);
  const { componentsToInstall, dependenciesToInstall } = await resolveDependencies(
    [EXAMPLE_COMPONENT],
    resolved,
    cwd,
    {},
  );

  const dependencies = [...dependenciesToInstall];

  if (options.install && dependencies.length > 0) {
    await installPackagesWithRetry(dependencies, cwd, config.packageManager);
  }

  for (const component of componentsToInstall) {
    await installComponent(component.name, getTargetDir(component, resolved, cwd), resolved);
  }

  // Uma biblioteca não tem home para reescrever: o app que a consome é que tem.
  if (isLibraryKind(config.projectType)) {
    return { homeRewritten: false, skipped: ['The example component was installed, but a library has no home page.'] };
  }

  const rewritten = await rewriteHome(cwd, config);
  if (!rewritten) {
    skipped.push('Could not find the root component to show the example on — the component is installed either way.');
  }

  return { homeRewritten: rewritten, skipped };
}

/** Onde o componente raiz costuma estar, nas duas convenções de nome do Angular. */
const ROOT_COMPONENT_NAMES = ['app', 'app.component'];

interface RootComponent {
  readonly source: string;
  readonly template: string | null;
}

function findRootComponent(cwd: string, config: Config): RootComponent | null {
  const base = path.resolve(cwd, config.baseUrl);

  for (const name of ROOT_COMPONENT_NAMES) {
    const source = path.join(base, `${name}.ts`);
    if (!existsSync(source)) continue;

    const template = path.join(base, `${name}.html`);

    return { source, template: existsSync(template) ? template : null };
  }

  return null;
}

const HOME_TEMPLATE = `<main class="flex min-h-svh flex-col items-center justify-center gap-6 p-8">
  <div class="flex flex-col items-center gap-2 text-center">
    <h1 class="text-3xl font-semibold tracking-tight">Your project is ready</h1>
    <p class="max-w-prose text-muted-foreground">
      This button is a real zard/ui component, generated into your codebase. Edit it, or run
      <code class="rounded bg-muted px-1.5 py-0.5 text-sm">zard-cli add</code> to bring in more.
    </p>
  </div>

  <z-button zType="default">Get started</z-button>
</main>
`;

/**
 * Coloca o botão na home.
 *
 * São três edições no componente raiz — o import, a lista de `imports` e o
 * template — e cada uma pode não casar: o gerador muda o formato do arquivo
 * entre versões, e a pessoa pode ter criado o projeto de um jeito que não
 * previmos. Nesse caso a função desiste e devolve `false`; o relatório diz o que
 * ficou faltando, e o projeto continua de pé.
 */
async function rewriteHome(cwd: string, config: Config): Promise<boolean> {
  const root = findRootComponent(cwd, config);
  if (!root) return false;

  const source = await readFile(root.source, 'utf8');
  // O diretório do componente, e não o arquivo: o `index.ts` que o `add` grava
  // é o que reexporta o componente e as suas variantes juntos.
  const importPath = `${config.aliases.components}/${EXAMPLE_COMPONENT}`;
  const importLine = `import { ZardButtonComponent } from '${importPath}';\n`;

  let updated = source.includes('ZardButtonComponent') ? source : importLine + source;

  updated = addToImportsArray(updated);
  if (!updated) return false;

  if (root.template) {
    await writeFile(root.template, HOME_TEMPLATE, 'utf8');
  } else {
    // Template inline: sem um arquivo para trocar, mexer no decorator seria
    // reescrever à mão um literal que pode estar em qualquer formato.
    logger.debug('Root component uses an inline template; leaving it alone.');
    return false;
  }

  await writeFile(root.source, updated, 'utf8');

  return true;
}

/**
 * Acrescenta o componente ao `imports` do decorator.
 *
 * Devolve string vazia quando não encontra o array — é o sinal para desistir
 * inteiro, porque escrever o template sem registrar o componente deixaria a
 * home quebrada, que é pior do que deixá-la como o gerador a fez.
 */
function addToImportsArray(source: string): string {
  if (/imports:\s*\[[^\]]*ZardButtonComponent/.test(source)) return source;

  const match = /imports:\s*\[([^\]]*)\]/.exec(source);
  if (!match) return '';

  const existing = (match[1] ?? '').trim();
  const separator = existing.length > 0 && !existing.endsWith(',') ? ', ' : ' ';
  const replacement = `imports: [${existing}${existing ? separator : ''}ZardButtonComponent]`;

  return source.slice(0, match.index) + replacement + source.slice(match.index + match[0].length);
}
