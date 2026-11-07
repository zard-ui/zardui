import { render, screen } from '@testing-library/angular';

import { ApiReferenceComponent } from './api-reference.component';
import type { ApiSection } from './api-reference.types';

const SECTIONS: ApiSection[] = [
  {
    selector: 'z-thing',
    description: 'A thing. Use `z-other` instead when needed.',
    props: [
      { name: '[zSize]', description: 'Size of the `z-thing`', type: "'sm' | 'lg'", default: "'sm'" },
      { name: '[zLabel]', description: 'Label', type: 'string', default: 'undefined' },
    ],
    outputs: [{ name: '(zChange)', description: 'Emits on change', type: 'EventEmitter<string>', default: '-' }],
  },
];

describe('ApiReferenceComponent', () => {
  it('renders a Prop / Type / Default table with the description under the name', async () => {
    const { container } = await render(ApiReferenceComponent, { inputs: { sections: SECTIONS } });

    expect(screen.getByRole('heading', { level: 3, name: 'z-thing' })).toBeTruthy();

    const inputs = screen.getByRole('table', { name: 'z-thing inputs' });
    const headers = [...inputs.querySelectorAll('th')].map(th => th.textContent?.trim());
    expect(headers).toEqual(['Prop', 'Type', 'Default']);

    const firstCell = inputs.querySelector('tbody tr td') as HTMLElement;
    expect(firstCell.querySelector('code')?.textContent).toBe('[zSize]');
    expect(firstCell.querySelector('p')?.innerHTML).toBe('Size of the <code>z-thing</code>');

    expect(container.querySelector('p')?.innerHTML).toContain('<code>z-other</code>');
  });

  it('shows outputs in their own table and empty defaults as a dash', async () => {
    await render(ApiReferenceComponent, { inputs: { sections: SECTIONS } });

    const outputs = screen.getByRole('table', { name: 'z-thing outputs' });
    expect(outputs.querySelector('th')?.textContent?.trim()).toBe('Event');
    expect(outputs.querySelector('tbody tr td:last-child')?.textContent?.trim()).toBe('—');

    const inputs = screen.getByRole('table', { name: 'z-thing inputs' });
    expect(inputs.querySelector('tbody tr:last-child td:last-child')?.textContent?.trim()).toBe('—');
  });

  it('omits the outputs table when there are none', async () => {
    await render(ApiReferenceComponent, { inputs: { sections: [{ ...SECTIONS[0], outputs: undefined }] } });

    expect(screen.queryByRole('table', { name: 'z-thing outputs' })).toBeNull();
  });
});
