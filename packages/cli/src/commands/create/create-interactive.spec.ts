/**
 * `create` with no flags, in a terminal: the questions run, then the same sequence as the headless
 * path. The generators and the registry are recorders; the keyboard and the screen are real.
 */

jest.mock('@antfu/ni', () => ({ detect: jest.fn() }));

const calls: string[] = [];

jest.mock('@cli/commands/create/scaffold.js', () => ({
  runScaffold: jest.fn(async (plan: { cwd: string; name: string }) => {
    calls.push(`scaffold:${plan.name}`);
    return `${plan.cwd}/${plan.name}`;
  }),
}));
jest.mock('@cli/commands/init/index.js', () => ({
  initWithPreset: jest.fn(async (options: { preset: string; type: string }) => {
    calls.push(`init:${options.type}:${options.preset}`);
  }),
}));
jest.mock('@cli/commands/add/index.js', () => ({
  runAdd: jest.fn(async () => {
    calls.push('add');
  }),
}));
jest.mock('@cli/utils/http-client.js', () => ({ fetchJson: jest.fn(async () => ({})) }));
jest.mock('@cli/utils/icon-catalog.js', () => ({
  loadIconCatalog: jest.fn(async () => undefined),
  assertIconFamily: jest.fn(),
}));
jest.mock('@cli/utils/design-catalog.js', () => ({ loadDesignData: jest.fn(async () => undefined) }));

import { runCreate } from '@cli/commands/create/index.js';
import { fakeTty, KEY, type FakeTty } from '@cli/ui/testing/fake-tty.js';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

jest.setTimeout(30_000);

const tick = (ms = 5) => new Promise(resolve => setTimeout(resolve, ms));
// eslint-disable-next-line no-control-regex
const onScreen = (value: string): string => value.replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '').replace(/\s+/g, '');

let tty: FakeTty | undefined;
afterEach(() => {
  tty?.restore();
  tty = undefined;
  calls.length = 0;
});

async function waitFor(expected: string): Promise<void> {
  const target = onScreen(expected);
  const deadline = Date.now() + 5_000;
  while (!onScreen(tty?.output() ?? '').includes(target) && Date.now() < deadline) await tick();
  if (!onScreen(tty?.output() ?? '').includes(target)) throw new Error(`Never saw "${expected}"`);
}

describe('runCreate in a terminal', () => {
  it('asks template, name and preset, then scaffolds and configures with the answers', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-create-tty-'));
    tty = fakeTty();

    const done = runCreate({ cwd, packageManager: 'npm' });

    await waitFor('Which template do you want to start from?');
    tty.press(KEY.down);
    tty.press(KEY.down); // Analog
    tty.press(KEY.enter);

    await waitFor('What is your project called?');
    for (const char of 'journal') tty.press(char);
    tty.press(KEY.enter);

    await waitFor('Which design do you want to start from?');
    tty.press(KEY.enter); // Default

    await done;

    expect(calls).toEqual(['scaffold:journal', 'init:analog:Z0', 'add']);
  });

  it('with --yes still asks for the template and the name, but not the design', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-create-tty-'));
    tty = fakeTty();

    const done = runCreate({ cwd, yes: true });

    await waitFor('Which template do you want to start from?');
    tty.press(KEY.enter);
    await waitFor('What is your project called?');
    for (const char of 'shop') tty.press(char);
    tty.press(KEY.enter);

    await done;

    expect(onScreen(tty.output())).not.toContain(onScreen('Which design'));
    expect(calls).toEqual(['scaffold:shop', 'init:angular:Z0', 'add']);
  });
});
