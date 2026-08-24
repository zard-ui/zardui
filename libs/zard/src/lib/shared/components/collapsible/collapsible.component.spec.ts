import '@testing-library/jest-dom';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';

@Component({
  selector: 'z-test-collapsible',
  imports: [ZardCollapsibleImports],
  template: `
    <z-collapsible [zOpen]="open()" [zDisabled]="disabled()" (zOpenChange)="onOpenChange($event)">
      <button z-collapsible-trigger>Toggle</button>

      <z-collapsible-content>
        <span>Panel content</span>
      </z-collapsible-content>
    </z-collapsible>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent {
  readonly open = signal(false);
  readonly disabled = signal(false);
  readonly changes: boolean[] = [];

  onOpenChange(open: boolean): void {
    this.changes.push(open);
  }
}

const setup = async () => {
  const view = await render(TestHostComponent);
  const trigger = screen.getByRole('button', { name: 'Toggle' });
  const content = view.container.querySelector<HTMLElement>('[data-slot="collapsible-content"]');
  const root = view.container.querySelector<HTMLElement>('[data-slot="collapsible"]');

  return { ...view, trigger, content: content as HTMLElement, root: root as HTMLElement };
};

describe('ZardCollapsibleDirective', () => {
  it('creates successfully and starts closed', async () => {
    const { root, content, trigger } = await setup();

    expect(root).toHaveAttribute('data-state', 'closed');
    expect(content).toHaveAttribute('data-state', 'closed');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens on click', async () => {
    const { root, content, trigger } = await setup();

    await userEvent.click(trigger);

    expect(root).toHaveAttribute('data-state', 'open');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes on the second click', async () => {
    const { root, trigger } = await setup();

    await userEvent.click(trigger);
    await userEvent.click(trigger);

    expect(root).toHaveAttribute('data-state', 'closed');
  });

  it('emits zOpenChange on every toggle', async () => {
    const { fixture, trigger } = await setup();

    await userEvent.click(trigger);
    await userEvent.click(trigger);

    expect(fixture.componentInstance.changes).toEqual([true, false]);
  });

  it('does not toggle when zDisabled', async () => {
    const { fixture, root, trigger } = await setup();

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(trigger).toBeDisabled();
    expect(root).toHaveAttribute('data-disabled', '');

    trigger.click();
    fixture.detectChanges();

    expect(root).toHaveAttribute('data-state', 'closed');
    expect(fixture.componentInstance.changes).toEqual([]);
  });

  it('follows the zOpen input', async () => {
    const { fixture, root } = await setup();

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    expect(root).toHaveAttribute('data-state', 'open');
  });

  it('wires aria-controls to the content id', async () => {
    const { content, trigger } = await setup();

    expect(trigger.getAttribute('aria-controls')).toBe(content.id);
    expect(content.id).toBeTruthy();
  });
});
