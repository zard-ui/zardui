import { registerListComponents } from './list-components';
import { registryService } from '../services/registry.service';

jest.mock('../services/registry.service', () => ({
  registryService: { getItems: jest.fn() },
}));

const getItems = registryService.getItems as jest.Mock;

interface ListedItem {
  name: string;
  kind: string;
  docsPath?: string;
}

async function listed(): Promise<ListedItem[]> {
  let handler: (() => Promise<{ content: { text: string }[] }>) | undefined;
  const server = {
    tool(_name: string, _desc: string, _schema: unknown, given: () => Promise<{ content: { text: string }[] }>) {
      handler = given;
    },
  } as never;

  registerListComponents(server);
  if (!handler) throw new Error('tool not registered');

  const result = await handler();
  return JSON.parse(result.content[0].text).components;
}

describe('list-components', () => {
  beforeEach(() => {
    getItems.mockReset();
    getItems.mockResolvedValue([
      { name: 'button', type: 'registry:component', basePath: 'button', files: ['button.component.ts'] },
      { name: 'typeset', type: 'registry:component', basePath: 'styles', files: ['typeset.css'] },
      // The registry publishes core with no basePath — see registry-data.ts.
      { name: 'core', type: 'registry:component', files: ['index.ts'] },
      { name: 'dark-mode', type: 'registry:component', basePath: 'services', files: ['dark-mode.ts'] },
      { name: 'utils', type: 'registry:component', basePath: 'utils', files: ['index.ts'] },
    ]);
  });

  it('lists every item the registry publishes', async () => {
    expect((await listed()).map(item => item.name)).toEqual(['button', 'typeset', 'core', 'dark-mode', 'utils']);
  });

  // The registry calls every item `registry:component`. Without the label, an
  // agent asks for `get-component typeset` expecting an Angular component and
  // gets CSS back.
  it('calls a UI component a component', async () => {
    const button = (await listed()).find(item => item.name === 'button');

    expect(button?.kind).toBe('component');
    expect(button?.docsPath).toBe('/docs/components/button');
  });

  it('calls typeset a stylesheet, and points at its own page', async () => {
    const typeset = (await listed()).find(item => item.name === 'typeset');

    expect(typeset?.kind).toBe('stylesheet');
    expect(typeset?.docsPath).toBe('/docs/typeset');
  });

  it.each(['core', 'dark-mode', 'utils'])('calls %s a utility, with no component page', async name => {
    const item = (await listed()).find(entry => entry.name === name);

    expect(item?.kind).toBe('utility');
    expect(item?.docsPath).toBeUndefined();
  });
});
