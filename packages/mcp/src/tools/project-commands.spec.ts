import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import { createServer } from '../server';

let client: Client;

beforeAll(async () => {
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

describe('get-create-command', () => {
  it('uses the default design with --yes, and never prompts', async () => {
    const { command, preset } = (await call('get-create-command', { name: 'my-app', template: 'angular' })).data();

    expect(command).toBe('npx zard-cli@latest create my-app --template angular --yes --no-interactive');
    expect(preset).toBeUndefined();
  });

  it('builds the preset from design choices, the way /create does', async () => {
    const result = (
      await call('get-create-command', {
        name: 'shop',
        template: 'nx',
        design: { style: 'vega', baseColor: 'zinc', theme: 'violet', font: 'geist', radius: 'small' },
        packageManager: 'pnpm',
        rtl: true,
      })
    ).data();

    expect(result.command).toBe(
      `pnpm dlx zard-cli@latest create shop --template nx --preset ${result.preset} --rtl --no-interactive`,
    );
    expect(result.design).toMatchObject({ style: 'vega', baseColor: 'zinc', theme: 'violet', radius: 'small' });
    // The code decodes back to the same design.
    const again = (await call('get-apply-command', { preset: result.preset })).data();
    expect(again.design).toEqual(result.design);
  });

  it('says which choices the design rules changed', async () => {
    const { design, adjusted } = (
      await call('get-create-command', { name: 'app', template: 'angular', design: { style: 'lyra', radius: 'large' } })
    ).data();

    expect(design.radius).toBe('none');
    expect(adjusted).toEqual(['radius: "large" became "none"']);
  });

  it('accepts the command the /create page gives as the preset', async () => {
    const { command } = (
      await call('get-create-command', {
        name: 'app',
        template: 'analog',
        preset: 'npx zard-cli@latest create my-app --preset Z2qIUL --template angular',
        packageManager: 'yarn',
      })
    ).data();

    expect(command).toBe(
      'npx zard-cli@latest create app --template analog --preset Z2qIUL --package-manager yarn --no-interactive',
    );
  });

  it.each([
    [{ name: 'app', template: 'angular', preset: 'nope!' }, 'Invalid preset'],
    [{ name: 'app', template: 'angular', preset: 'Z0', design: { style: 'nova' } }, 'either preset or design'],
    [{ name: 'My App', template: 'angular' }, 'lowercase'],
    [{ name: 'app', template: 'react' }, 'template'],
    [{ name: 'app', template: 'angular', design: { theme: 'pink-ish' } }, 'theme'],
  ])('refuses %j', async (args, message) => {
    const result = await call('get-create-command', args);
    expect(result.isError).toBe(true);
    expect(result.text).toContain(message);
  });
});

describe('get-init-command', () => {
  it('names the project type and confirms the stylesheet overwrite', async () => {
    const { command } = (await call('get-init-command', { type: 'nx', project: 'shop', baseColor: 'stone' })).data();
    expect(command).toBe('npx zard-cli@latest init --type nx --project shop --base-color stone --yes --no-interactive');
  });

  it('refuses the pointer without a design', async () => {
    const result = await call('get-init-command', { type: 'angular', pointer: true });
    expect(result.isError).toBe(true);
  });
});

describe('get-apply-command', () => {
  it('needs something to apply', async () => {
    expect((await call('get-apply-command')).isError).toBe(true);
  });

  it('applies only a part, and can remove the pointer rule', async () => {
    const { command } = (await call('get-apply-command', { preset: 'Z0', only: 'theme', pointer: false })).data();
    expect(command).toBe('npx zard-cli@latest apply --preset Z0 --only theme --no-pointer --no-interactive');
  });
});

describe('get-add-command', () => {
  it('adds several items without prompting', async () => {
    const { command } = (
      await call('get-add-command', { items: ['button', 'date-picker'], packageManager: 'bun' })
    ).data();
    expect(command).toBe('bunx zard-cli@latest add button date-picker --yes --no-interactive');
  });

  it('refuses a name that is not a registry id', async () => {
    expect((await call('get-add-command', { items: ['button; rm -rf /'] })).isError).toBe(true);
  });
});

describe('get-design-options', () => {
  it('lists the choices and the default design', async () => {
    const options = (await call('get-design-options')).data();
    expect(options.default.style).toBe('nova');
    expect(options.styles.map((style: { value: string }) => style.value)).toContain('lyra');
    expect(options.themesByBaseColor.neutral[0]).toBe('neutral');
  });
});

/**
 * `src/design` is a copy of the CLI's design module: the MCP compiles on its own and cannot import outside `src`.
 * A copy that drifts would build presets the CLI reads differently, so any change has to be copied over.
 */
describe('design module copy', () => {
  it.each(['options.ts', 'config.ts', 'codec.ts'])('%s matches packages/cli/src/core/design', file => {
    const read = (dir: string) => readFileSync(path.join(dir, file), 'utf8').replace(/\r\n/g, '\n');
    expect(read(path.join(__dirname, '../design'))).toBe(read(path.join(__dirname, '../../../cli/src/core/design')));
  });
});
