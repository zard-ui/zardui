import { type ComponentMeta } from '@cli/commands/add/dependency-resolver.js';
import {
  answeredLine,
  checkList,
  commandHeader,
  confirmField,
  controls,
  createGate,
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
  type Choice,
  type KeyEvent,
  type LogRecord,
  type Node,
  type TaskLine,
  type WizardContext,
} from '@cli/ui/index.js';

type Phase = 'selecting' | 'resolving' | 'confirming' | 'installing' | 'darkMode' | 'done' | 'failed';

interface State {
  phase: Phase;
  /** Nomes disponíveis no registry, na ordem em que serão exibidos. */
  names: string[];
  /** Texto do filtro de busca. */
  filter: string;
  /** Índices (sobre `names`) que passaram no filtro. */
  visible: number[];
  cursor: number;
  selected: Set<number>;
  /** Resumo do que a resolução de dependências encontrou. */
  componentCount: number;
  dependencyCount: number;
  confirmValue: boolean;
  tasks: TaskLine[];
  tasksDone: number;
  /** Quando a etapa atual começou, para exibir há quanto tempo ela roda. */
  taskStartedAt: number;
  indexHtml: string;
  /** Ver init/wizard.ts: a primeira tecla substitui o caminho sugerido. */
  indexHtmlPristine: boolean;
  transcript: [string, string][];
  failure: string | null;
  installed: string[];
}

export interface AddWizardOptions {
  /** Componentes já informados na linha de comando — pulam a seleção. */
  readonly preselected: readonly string[];
  /** Carrega os nomes disponíveis; só é chamado quando há seleção a fazer. */
  loadNames(): Promise<string[]>;
  resolve(names: string[]): Promise<{ components: ComponentMeta[]; dependencies: string[] }>;
  /** Pula a confirmação (`--yes`). */
  readonly skipConfirmation: boolean;
  installDependencies(packages: string[]): Promise<void>;
  installComponent(component: ComponentMeta): Promise<void>;
  /** Só é chamado quando dark-mode entra na instalação. */
  setupDarkMode(indexHtml: string): Promise<void>;
}

export interface AddWizardResult {
  readonly installed: readonly string[];
  readonly logs: readonly LogRecord[];
}

const DARK_MODE = 'dark-mode';
const DEFAULT_INDEX_HTML = 'src/index.html';

export async function runAddWizard(options: AddWizardOptions): Promise<AddWizardResult> {
  const state: State = {
    phase: options.preselected.length ? 'resolving' : 'selecting',
    names: [],
    filter: '',
    visible: [],
    cursor: 0,
    selected: new Set(),
    componentCount: 0,
    dependencyCount: 0,
    confirmValue: true,
    tasks: [],
    tasksDone: 0,
    taskStartedAt: 0,
    indexHtml: DEFAULT_INDEX_HTML,
    indexHtmlPristine: true,
    transcript: [],
    failure: null,
    installed: [],
  };

  const selection = createGate<string[]>();
  const confirmation = createGate<boolean>();
  const darkMode = createGate<string | null>();
  const finish = createGate<void>();

  const applyFilter = (): void => {
    const term = state.filter.trim().toLowerCase();
    state.visible = state.names
      .map((_, index) => index)
      .filter(index => !term || (state.names[index] as string).toLowerCase().includes(term));
    state.cursor = Math.min(state.cursor, Math.max(0, state.visible.length - 1));
  };

  const onKey = (event: KeyEvent, ctx: WizardContext<string[]>): void => {
    if (state.phase === 'selecting') {
      handleSelectionKey(event, state, applyFilter, selection);
      return;
    }

    if (state.phase === 'confirming') {
      if (event.key === 'left' || event.key === 'right') state.confirmValue = !state.confirmValue;
      else if (event.key === 'y' || event.key === 'Y') confirmation.settle(true);
      else if (event.key === 'n' || event.key === 'N' || event.key === 'escape') confirmation.settle(false);
      else if (event.key === 'enter') confirmation.settle(state.confirmValue);
      return;
    }

    if (state.phase === 'darkMode') {
      if (event.key === 'enter') darkMode.settle(state.indexHtml.trim() || DEFAULT_INDEX_HTML);
      else if (event.key === 'escape') darkMode.settle(null);
      else if (event.key === 'backspace') {
        state.indexHtmlPristine = false;
        state.indexHtml = [...state.indexHtml].slice(0, -1).join('');
      } else if (event.key.length === 1 && !event.ctrl && !event.alt) {
        state.indexHtml = state.indexHtmlPristine ? event.key : state.indexHtml + event.key;
        state.indexHtmlPristine = false;
      }
      return;
    }

    if (state.phase === 'done' || state.phase === 'failed') {
      if (event.key === 'enter') finish.settle(undefined);
      return;
    }

    void ctx;
  };

  const run = async (ctx: WizardContext<string[]>): Promise<void> => {
    let names: string[];

    if (options.preselected.length) {
      names = [...options.preselected];
    } else {
      state.names = await options.loadNames();
      applyFilter();
      ctx.refresh();
      names = await selection.wait();
      if (!names.length) {
        ctx.cancel('No components selected.');
        return;
      }
      state.transcript.push(['components', names.join(', ')]);
    }

    state.phase = 'resolving';
    ctx.refresh();

    const { components, dependencies } = await options.resolve(names);

    if (components.length === 0) {
      state.phase = 'done';
      state.installed = [];
      ctx.refresh();
      await finish.wait();
      ctx.done([]);
      return;
    }

    state.componentCount = components.length;
    state.dependencyCount = dependencies.length;

    if (!options.skipConfirmation) {
      state.phase = 'confirming';
      ctx.refresh();
      if (!(await confirmation.wait())) {
        ctx.cancel();
        return;
      }
      state.transcript.push(['install', `${components.length} component(s), ${dependencies.length} dependencies`]);
    }

    state.phase = 'installing';
    state.tasks = [
      ...(dependencies.length ? [{ label: 'dependencies', note: dependencies.join(', ') }] : []),
      ...components.map(component => ({ label: component.name, note: 'component source' })),
    ];
    state.tasksDone = 0;
    state.taskStartedAt = Date.now();
    ctx.refresh();

    if (dependencies.length) {
      await options.installDependencies(dependencies);
      state.tasksDone++;
      state.taskStartedAt = Date.now();
      ctx.refresh();
    }

    const failed: string[] = [];
    for (const component of components) {
      try {
        await options.installComponent(component);
        state.installed.push(component.name);
      } catch (error) {
        failed.push(component.name);
        state.failure = `${component.name}: ${error instanceof Error ? error.message : String(error)}`;
      }
      state.tasksDone++;
      state.taskStartedAt = Date.now();
      ctx.refresh();
    }

    if (components.some(component => component.name === DARK_MODE)) {
      state.phase = 'darkMode';
      ctx.refresh();
      const indexHtml = await darkMode.wait();
      if (indexHtml) {
        state.transcript.push(['index.html', indexHtml]);
        await options.setupDarkMode(indexHtml);
      }
    }

    state.phase = failed.length ? 'failed' : 'done';
    ctx.refresh();

    await finish.wait();
    ctx.done(state.installed);
  };

  const result = await runWizard<string[]>({
    view: () => buildView(state),
    onKey,
    run,
  });

  return { installed: result.value, logs: result.logs };
}

function handleSelectionKey(
  event: KeyEvent,
  state: State,
  applyFilter: () => void,
  selection: ReturnType<typeof createGate<string[]>>,
): void {
  const total = state.visible.length;

  if (event.key === 'up') {
    state.cursor = total ? (state.cursor - 1 + total) % total : 0;
    return;
  }
  if (event.key === 'down') {
    state.cursor = total ? (state.cursor + 1) % total : 0;
    return;
  }
  if (event.key === ' ' || event.key === 'space') {
    const index = state.visible[state.cursor];
    if (index !== undefined) {
      if (state.selected.has(index)) state.selected.delete(index);
      else state.selected.add(index);
    }
    return;
  }
  if (event.ctrl && event.key === 'a') {
    // Alterna tudo que está visível, respeitando o filtro corrente.
    const allSelected = state.visible.every(index => state.selected.has(index));
    for (const index of state.visible) {
      if (allSelected) state.selected.delete(index);
      else state.selected.add(index);
    }
    return;
  }
  if (event.key === 'enter') {
    selection.settle([...state.selected].sort((a, b) => a - b).map(index => state.names[index] as string));
    return;
  }
  if (event.key === 'backspace') {
    state.filter = [...state.filter].slice(0, -1).join('');
    applyFilter();
    return;
  }
  if (event.key.length === 1 && !event.ctrl && !event.alt) {
    state.filter += event.key;
    applyFilter();
  }
}

/** Janela deslizante da lista: mantém o cursor sempre visível. */
const VISIBLE_ROWS = 10;

function windowOf(state: State): { slice: number[]; offset: number } {
  if (state.visible.length <= VISIBLE_ROWS) return { slice: state.visible, offset: 0 };
  const half = Math.floor(VISIBLE_ROWS / 2);
  const max = state.visible.length - VISIBLE_ROWS;
  const offset = Math.max(0, Math.min(state.cursor - half, max));
  return { slice: state.visible.slice(offset, offset + VISIBLE_ROWS), offset };
}

function buildView(state: State): Node {
  const body: Node[] = [commandHeader('add', 'Add components to your project'), text('')];

  for (const [label, value] of state.transcript) body.push(answeredLine(label, value));
  if (state.transcript.length) body.push(text(''));

  if (state.phase === 'selecting') {
    const { slice, offset } = windowOf(state);
    const choices: Choice[] = slice.map(index => ({ label: state.names[index] as string }));
    const localCursor = state.cursor - offset;
    const localSelected = new Set(
      slice.map((index, position) => (state.selected.has(index) ? position : -1)).filter(position => position >= 0),
    );

    body.push(question('Which components would you like to add?'));
    body.push(textField(state.filter));

    if (choices.length) {
      body.push(...checkList(choices, localCursor, localSelected));
    } else {
      body.push(hint('No component matches this filter.'));
    }

    body.push(text(''));
    body.push(hint(`${state.selected.size} selected · ${state.visible.length} of ${state.names.length} shown`));
    body.push(spacer());
    body.push(
      controls([
        ['↑/↓', 'move'],
        ['space', 'select'],
        ['ctrl+a', 'toggle all'],
        ['enter', 'confirm'],
      ]),
    );
  } else if (state.phase === 'resolving') {
    body.push(taskHeader('Resolving components and dependencies…', false));
    body.push(spacer());
  } else if (state.phase === 'confirming') {
    body.push(
      question(
        `Ready to install ${state.componentCount} component(s) and ${state.dependencyCount} dependencies. Proceed?`,
      ),
    );
    body.push(confirmField(state.confirmValue));
    body.push(hint('Existing files are kept unless you passed --overwrite.'));
    body.push(spacer());
    body.push(
      controls([
        ['y/n · ←/→', 'toggle'],
        ['enter', 'confirm'],
      ]),
    );
  } else if (state.phase === 'darkMode') {
    body.push(question('Where is your index.html file?'));
    body.push(textField(state.indexHtml));
    body.push(hint('Dark mode injects a small script there to apply the theme before first paint.'));
    body.push(spacer());
    body.push(
      controls([
        ['enter', 'confirm'],
        ['esc', 'skip'],
      ]),
    );
  } else {
    body.push(...installBlock(state));
    body.push(spacer());
    body.push(controls([['enter', state.phase === 'failed' ? 'exit' : 'finish']]));
  }

  return screen(page(...body));
}

function installBlock(state: State): Node[] {
  const allDone = state.tasksDone >= state.tasks.length;
  const nodes: Node[] = [];

  if (state.tasks.length) {
    nodes.push(
      taskHeader(state.phase === 'failed' ? 'Finished with errors' : 'Installing…', allDone),
      text(''),
      ...taskList(
        state.tasks,
        state.tasksDone,
        state.phase === 'installing' ? Date.now() - state.taskStartedAt : undefined,
      ),
      text(''),
      progress(state.tasksDone, state.tasks.length),
      text(''),
    );
  }

  if (state.phase === 'failed') {
    nodes.push(resultPanel('danger', state.failure ?? 'Some components could not be installed.'));
  } else if (state.installed.length) {
    nodes.push(
      resultPanel('success', `Installed ${state.installed.length} component${state.installed.length > 1 ? 's' : ''}.`),
    );
  } else {
    nodes.push(resultPanel('success', 'All components are already installed.'));
  }

  return nodes;
}
