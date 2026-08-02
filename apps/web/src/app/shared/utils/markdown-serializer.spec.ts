import type { CodeBlockData } from '@highlight/types';

import type { ComponentData } from '@doc/shared/constants/components.constant';

import { serializeComponentToMarkdown, serializeFallbackMarkdown } from './markdown-serializer';

function codeBlock(code: string, language: string): CodeBlockData {
  return { html: `<pre>${code}</pre>`, code, language, showLineNumbers: true, copyButton: true, expandable: false };
}

const DATA: ComponentData = {
  componentName: 'date-picker',
  description: 'A date picker component with range and presets.',
  installData: {
    cliAdd: {
      tabs: [
        { label: 'npm', html: '<pre>npx</pre>', code: 'npx zard-cli@latest add date-picker', language: 'bash' },
        { label: 'pnpm', html: '<pre>pnpm</pre>', code: 'pnpm dlx zard-cli@latest add date-picker', language: 'bash' },
      ],
    },
    manualCode: [codeBlock('export class Foo {}', 'angular-ts')],
  },
  usage: {
    importBlock: codeBlock("import { ZardDatePicker } from '@zard';", 'angular-ts'),
    codeBlock: codeBlock('<z-date-picker />', 'angular-html'),
  },
  examples: [
    {
      name: 'with-range',
      description: 'Use the `zRange` prop to select a range.',
      codeData: codeBlock('<z-date-picker zRange />', 'angular-html'),
    },
  ],
  api: [
    {
      selector: 'z-date-picker',
      description: 'Date picker root.',
      props: [{ name: 'zRange', description: 'Enables range | selection', type: "'a' | 'b'", default: 'false' }],
    },
  ],
};

describe('serializeComponentToMarkdown', () => {
  it('emits frontmatter with a title-cased name and the description', () => {
    const md = serializeComponentToMarkdown(DATA);

    expect(md).toContain('---\ntitle: Date Picker\ndescription: A date picker component with range and presets.\n---');
    expect(md).toContain('# Date Picker');
  });

  it('renders installation using only the first CLI tab plus manual code', () => {
    const md = serializeComponentToMarkdown(DATA);

    expect(md).toContain('## Installation');
    expect(md).toContain('### CLI\n\n```bash\nnpx zard-cli@latest add date-picker\n```');
    expect(md).not.toContain('pnpm dlx'); // only the first tab is emitted
    expect(md).toContain('### Manual\n\n```angular-ts\nexport class Foo {}\n```');
  });

  it('renders usage, examples and an API table', () => {
    const md = serializeComponentToMarkdown(DATA);

    expect(md).toContain('## Usage');
    expect(md).toContain("```angular-ts\nimport { ZardDatePicker } from '@zard';\n```");
    expect(md).toContain('## Examples');
    expect(md).toContain('### With Range');
    expect(md).toContain('Use the `zRange` prop to select a range.');
    expect(md).toContain('## API Reference');
    expect(md).toContain('| Prop | Description | Type | Default |');
    // Pipes inside prop metadata must be escaped so they don't break the table.
    expect(md).toContain("| `zRange` | Enables range \\| selection | `'a' \\| 'b'` | `false` |");
  });

  it('omits sections that have no data', () => {
    const md = serializeComponentToMarkdown({ componentName: 'empty', description: 'Nothing here.', examples: [] });

    expect(md).not.toContain('## Installation');
    expect(md).not.toContain('## Usage');
    expect(md).not.toContain('## Examples');
    expect(md).not.toContain('## API Reference');
  });
});

describe('serializeFallbackMarkdown', () => {
  it('builds a minimal document with frontmatter and a browser link', () => {
    const md = serializeFallbackMarkdown('Theming', 'Customize colors and tokens.', '/docs/theming');

    expect(md).toContain('---\ntitle: Theming\ndescription: Customize colors and tokens.\n---');
    expect(md).toContain('# Theming');
    expect(md).toContain('[Open in browser](https://zardui.com/docs/theming)');
  });
});
