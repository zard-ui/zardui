/**
 * The create wizard, from the point of view of whoever is typing: template first with the cursor on
 * the first item, then the name, then the preset — a curated list ending in Custom.
 */

import { runCreateWizard, windowOf, type CreateAnswers } from '@cli/commands/create/wizard.js';
import { fakeTty, KEY, type FakeTty } from '@cli/ui/testing/fake-tty.js';
import { mkdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

jest.setTimeout(30_000);

const tick = (ms = 5) => new Promise(resolve => setTimeout(resolve, ms));

// eslint-disable-next-line no-control-regex
const onScreen = (value: string): string => value.replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '').replace(/\s+/g, '');

interface Run {
  readonly tty: FakeTty;
  readonly answers: Promise<CreateAnswers>;
  reach(keys: string[], expected: string): Promise<void>;
  type(text: string): void;
}

async function start(cwd: string, over: Partial<Parameters<typeof runCreateWizard>[0]> = {}): Promise<Run> {
  const tty = fakeTty();
  const answers = runCreateWizard({ cwd, ...over });
  // A wizard that is cancelled rejects; keep that from surfacing as an unhandled rejection.
  answers.catch(() => undefined);

  const reach = async (keys: string[], expected: string): Promise<void> => {
    for (const key of keys) tty.press(key);

    const deadline = Date.now() + 5_000;
    const target = onScreen(expected);
    while (!onScreen(tty.output()).includes(target) && Date.now() < deadline) await tick();

    if (!onScreen(tty.output()).includes(target)) throw new Error(`Never saw "${expected}"`);
  };

  return {
    tty,
    answers,
    reach,
    type: text => {
      for (const char of text) tty.press(char);
    },
  };
}

let current: Run | undefined;
afterEach(() => {
  current?.tty.restore();
  current = undefined;
});

describe('runCreateWizard', () => {
  it('asks the template first, with the cursor on the first item', async () => {
    current = await start(await mkdtemp(path.join(tmpdir(), 'zard-wiz-')));

    await current.reach([], 'Which template do you want to start from?');

    // The active row carries the marker; Angular is the first one.
    expect(onScreen(current.tty.output())).toContain(onScreen('❯  Angular'));
    expect(onScreen(current.tty.output())).not.toContain(onScreen('❯  Nx'));
  });

  it('walks template, name and preset into one set of answers', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-wiz-'));
    const run = (current = await start(cwd));

    await run.reach([KEY.down], 'Nx'); // cursor to Nx
    await run.reach([KEY.enter], 'What is your project called?');
    run.type('shop');
    await run.reach([KEY.enter], 'Which design do you want to start from?');
    await run.reach([KEY.enter], ''); // the first choice: Default

    const answers = await run.answers;

    expect(answers.template.value).toBe('nx');
    expect(answers.name).toBe('shop');
    expect(answers.preset.code).toBe('Z0');
  });

  it('refuses a name that is taken and says so, staying on the question', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-wiz-'));
    await mkdir(path.join(cwd, 'taken'));
    const run = (current = await start(cwd, {
      template: { value: 'angular', label: 'Angular', detail: '', color: '', kind: 'angular' },
    }));

    await run.reach([], 'What is your project called?');
    run.type('taken');
    await run.reach([KEY.enter], 'already exists');
  });

  it('skips the questions the flags already answered', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-wiz-'));
    const run = (current = await start(cwd, {
      template: { value: 'analog', label: 'Analog', detail: '', color: '', kind: 'analog' },
      name: 'blog',
    }));

    await run.reach([], 'Which design do you want to start from?');
    expect(onScreen(run.tty.output())).not.toContain(onScreen('Which template'));
  });

  it('Custom prints the /create URL and accepts a pasted command, rejecting a foreign code by name', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-wiz-'));
    const run = (current = await start(cwd, {
      template: { value: 'angular', label: 'Angular', detail: '', color: '', kind: 'angular' },
      name: 'blog',
    }));

    await run.reach([], 'Which design do you want to start from?');
    run.tty.press(KEY.up); // wraps from Default to the last item: Custom
    await run.reach([KEY.enter], 'Paste your preset code');
    expect(onScreen(run.tty.output())).toContain(onScreen('https://zardui.com/create'));

    run.type('b2D0wqNxT');
    await run.reach([KEY.enter], 'b2D0wqNxT');
    expect(onScreen(run.tty.output())).toContain(onScreen('looks like a shadcn/ui preset'));

    for (let index = 0; index < 'b2D0wqNxT'.length; index++) run.tty.press(KEY.backspace);
    run.type('--preset Z6KtfCaQt');
    await run.reach([KEY.enter], '');

    expect((await run.answers).preset.code).toBe('Z6KtfCaQt');
  });
});

describe('windowOf', () => {
  const items = Array.from({ length: 27 }, (_, index) => index);

  it('shows everything when it fits', () => {
    expect(windowOf([1, 2, 3], 1)).toEqual({ start: 0, items: [1, 2, 3] });
  });

  it('keeps the active item inside the window, at the edges too', () => {
    for (const active of [0, 5, 13, 26]) {
      const { start, items: shown } = windowOf(items, active);
      expect(shown).toHaveLength(8);
      expect(active).toBeGreaterThanOrEqual(start);
      expect(active).toBeLessThan(start + shown.length);
    }
  });
});
