import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

import { createServer } from './server';

const REGISTRY = {
  $schema: '',
  schemaVersion: 1,
  name: '@zard',
  homepage: '',
  version: '1.0.0',
  items: [
    { name: 'core', type: 'registry:component', files: ['index.ts'] },
    {
      name: 'utils',
      type: 'registry:component',
      files: ['merge-classes.ts'],
      dependencies: ['clsx', 'tailwind-merge'],
    },
    { name: 'button', type: 'registry:component', files: ['button.component.ts'], registryDependencies: ['utils'] },
    { name: 'dialog', type: 'registry:component', files: ['dialog.ts'], registryDependencies: ['button', 'core'] },
    { name: 'dropdown', type: 'registry:component', files: ['dropdown.ts'], registryDependencies: ['core'] },
    { name: 'sonner', type: 'registry:component', files: ['sonner.ts'], dependencies: ['ngx-sonner'] },
    { name: 'combobox', type: 'registry:component', files: ['combobox.ts'], registryDependencies: ['command'] },
    { name: 'date-picker', type: 'registry:component', files: ['date-picker.ts'] },
  ],
};

const LLMS = `# Zard UI

## Components

### Form & Input

- [Button](https://zardui.com/docs/components/button): Displays a button or a component that looks like a button.
- [Combobox](https://zardui.com/docs/components/combobox): Autocomplete input and command palette with a list of suggestions.
- [Date Picker](https://zardui.com/docs/components/date-picker): A button that opens a calendar in a popover to pick a date.

### Overlay

- [Dialog](https://zardui.com/docs/components/dialog): A window overlaid on either the primary window or another dialog window.
- [Sonner](https://zardui.com/docs/components/sonner): An opinionated toast component.

## Utilities

- [Shimmer](https://zardui.com/docs/utils/shimmer): Not a component.
`;

const BUTTON_MD = `---
title: Button
---

# Button

## Installation

npx zard-cli add button

## Examples

### Default

<button z-button>Button</button>

## API

zType
`;

function respond(body: string, status = 200, type = 'application/json') {
  return Promise.resolve(new Response(body, { status, headers: { 'content-type': type } }));
}

const fetchMock = jest.fn((url: string) => {
  if (url.endsWith('/r/registry.json')) return respond(JSON.stringify(REGISTRY));
  if (url.endsWith('/r/button.json'))
    return respond(
      JSON.stringify({ name: 'button', type: 'registry:component', files: [{ name: 'b.ts', content: 'x' }] }),
    );
  if (url.endsWith('/r/blocks-registry.json'))
    return respond(
      JSON.stringify({
        blocks: [
          { id: 'login-01', title: 'Login', description: 'A login form.', category: 'Login' },
          { id: 'dashboard-01', title: 'Dashboard', description: 'A dashboard.', category: 'Dashboard' },
        ],
      }),
    );
  if (url.endsWith('/llms.txt')) return respond(LLMS, 200, 'text/plain');
  if (url.endsWith('/docs/components/button.md')) return respond(BUTTON_MD, 200, 'text/markdown');
  // The site answers unknown paths with its HTML shell, not 404.
  if (url.includes('/docs/components/')) return respond('<!doctype html><html></html>', 200, 'text/html');
  return respond('Not Found', 404, 'text/plain');
});

let client: Client;

beforeAll(async () => {
  global.fetch = fetchMock as unknown as typeof fetch;
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await createServer('9.9.9').connect(serverTransport);
  client = new Client({ name: 'test', version: '0' });
  await client.connect(clientTransport);
});

afterAll(() => client.close());

async function call(name: string, args: Record<string, unknown> = {}) {
  const result = await client.callTool({ name, arguments: args });
  const text = (result.content as { type: string; text: string }[])[0].text;
  return { text, isError: result.isError === true, data: () => JSON.parse(text) };
}

describe('zard-mcp over the protocol', () => {
  it('introduces itself with its version and usage instructions', () => {
    expect(client.getServerVersion()).toMatchObject({ name: 'zard-mcp', version: '9.9.9' });
    expect(client.getInstructions()).toContain('search-components');
  });

  it('marks every tool but install-component as read-only, and gives each a title', async () => {
    const { tools } = await client.listTools();
    expect(tools).toHaveLength(9);
    for (const tool of tools) {
      expect(tool.title).toBeTruthy();
      expect(tool.annotations?.readOnlyHint).toBe(tool.name !== 'install-component');
    }
  });

  it('lists components with their descriptions and categories', async () => {
    const { components } = (await call('list-components')).data();
    expect(components.find((c: { name: string }) => c.name === 'sonner')).toMatchObject({
      description: 'An opinionated toast component.',
      category: 'Overlay',
    });
  });

  it.each([
    ['modal', 'dialog'],
    ['toast', 'sonner'],
    ['autocomplete', 'combobox'],
    ['datepicker', 'date-picker'],
    ['buton', 'button'],
    ['Date Picker', 'date-picker'],
  ])('search "%s" puts %s first', async (query, expected) => {
    const { matches } = (await call('search-components', { query })).data();
    expect(matches[0].name).toBe(expected);
  });

  it('suggests the right name for a misspelled component', async () => {
    const res = await call('get-component', { name: 'dialg' });
    expect(res.isError).toBe(true);
    expect(res.text).toContain('Did you mean "dialog"');
  });

  it('suggests the library name for a shadcn name', async () => {
    const res = await call('get-component-docs', { name: 'dropdown-menu' });
    expect(res.isError).toBe(true);
    expect(res.text).toContain('"dropdown"');
  });

  it('maps a name from another library to the Zard UI one', async () => {
    const res = await call('get-component-docs', { name: 'toast' });
    expect(res.isError).toBe(true);
    expect(res.text).toContain('Did you mean "sonner"');
  });

  it('treats the site HTML shell as not found, with a suggestion', async () => {
    fetchMock.mockImplementationOnce(() => respond('<!doctype html>', 200, 'text/html'));
    const res = await call('get-component', { name: 'buttom' });
    expect(res.isError).toBe(true);
    expect(res.text).toContain('Did you mean "button"');
  });

  it('flags a traversal attempt as an invalid name, not as a network error', async () => {
    const res = await call('get-component', { name: '../../admin' });
    expect(res.isError).toBe(true);
    expect(res.text).toContain('Invalid component name');
  });

  it('returns the docs page as raw markdown', async () => {
    const res = await call('get-component-docs', { name: 'button' });
    expect(res.isError).toBe(false);
    expect(res.text).toMatch(/^---\ntitle: Button/);
  });

  it('returns only the examples section', async () => {
    const res = await call('get-component-examples', { name: 'button' });
    expect(res.text.startsWith('## Examples')).toBe(true);
    expect(res.text).not.toContain('## API');
  });

  it('resolves dependencies into an install order and the npm packages', async () => {
    const data = (await call('get-dependencies', { name: 'dialog' })).data();
    expect(data.installOrder).toEqual(['utils', 'button', 'core', 'dialog']);
    expect(data.npmPackages).toEqual(['clsx', 'tailwind-merge']);
  });

  it('errors on dependencies of an unknown component', async () => {
    const res = await call('get-dependencies', { name: 'buttn' });
    expect(res.isError).toBe(true);
    expect(res.text).toContain('"button"');
  });

  it('filters blocks by category, case-insensitive', async () => {
    const data = (await call('list-blocks', { category: 'login' })).data();
    expect(data.blocks.map((b: { id: string }) => b.id)).toEqual(['login-01']);
    expect(data.categories).toEqual(['Login', 'Dashboard']);
  });

  it('suggests a block for a misspelled id', async () => {
    const res = await call('get-block', { id: 'login-1' });
    expect(res.isError).toBe(true);
    expect(res.text).toContain('"login-01"');
  });
});
