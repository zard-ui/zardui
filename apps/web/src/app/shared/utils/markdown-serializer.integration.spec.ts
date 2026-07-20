import { COMPONENTS_REGISTRY } from '@doc/shared/constants/components.constant';

import { serializeComponentToMarkdown } from './markdown-serializer';

/**
 * Proves the production `<path>.md` data path: loading a real component's
 * structured data (the same `loadData()` the Express handler calls) and
 * serializing it end-to-end — no rendering, just data → Markdown.
 */
describe('markdown serializer (integration with real component data)', () => {
  it('serializes the button component from its registry entry', async () => {
    const entry = COMPONENTS_REGISTRY.find(component => component.componentName === 'button');
    expect(entry).toBeDefined();

    const data = await entry!.loadData();
    const md = serializeComponentToMarkdown(data);

    expect(md).toMatch(/^---\ntitle: Button\ndescription: .+\n---/);
    expect(md).toContain('# Button');
    expect(md).toContain('## Installation');
    expect(md).toContain('npx zard-cli@latest add button');
    expect(md).toContain('## API Reference');
    expect(md).toContain('| Prop | Description | Type | Default |');
    // No leaked Shiki HTML — code must come from the `.code` field, fenced.
    expect(md).not.toContain('<pre class="shiki');
    expect(md).toContain('[Open in browser](https://zardui.com/docs/components/button)');
  });
});
