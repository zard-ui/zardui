import { Component } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardMarkerImports } from './marker.imports';

@Component({
  selector: 'z-test-marker',
  imports: [...ZardMarkerImports],
  template: `
    <z-marker>
      <z-marker-icon><span data-testid="icon-content">I</span></z-marker-icon>
      <z-marker-content>Explored 4 files</z-marker-content>
    </z-marker>

    <z-marker zVariant="border">
      <z-marker-content>Opened implementation notes</z-marker-content>
    </z-marker>

    <z-marker zVariant="separator">
      <z-marker-content>Today</z-marker-content>
    </z-marker>
  `,
})
class TestMarkerHost {}

@Component({
  selector: 'z-test-marker-interactive',
  imports: [...ZardMarkerImports],
  template: `
    <a z-marker href="#pull-request">
      <z-marker-content>View the pull request</z-marker-content>
    </a>

    <button z-marker type="button" (click)="clicks = clicks + 1">
      <z-marker-content>Revert this change</z-marker-content>
    </button>
  `,
})
class TestInteractiveMarkerHost {
  clicks = 0;
}

describe('ZardMarkerComponent', () => {
  it('renders the slot composition with data-slot attributes', async () => {
    await render(TestMarkerHost);

    expect(document.querySelectorAll('[data-slot="marker"]').length).toBe(3);
    expect(document.querySelector('[data-slot="marker-icon"]')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="marker-content"]').length).toBe(3);
    expect(screen.getByTestId('icon-content')).toBeInTheDocument();
  });

  it('defaults zVariant to default and reflects it on data-variant', async () => {
    await render(TestMarkerHost);

    const markers = document.querySelectorAll('[data-slot="marker"]');
    expect(markers[0].getAttribute('data-variant')).toBe('default');
    expect(markers[1].getAttribute('data-variant')).toBe('border');
    expect(markers[2].getAttribute('data-variant')).toBe('separator');
  });

  it('applies the border and separator variant classes', async () => {
    await render(TestMarkerHost);

    const markers = document.querySelectorAll('[data-slot="marker"]');
    expect(markers[0].className).not.toContain('border-b');
    expect(markers[1].className).toContain('border-b');
    expect(markers[2].className).toContain('before:flex-1');
    expect(markers[2].className).toContain('after:flex-1');
  });

  it('hides the icon slot from assistive tech', async () => {
    await render(TestMarkerHost);

    expect(document.querySelector('[data-slot="marker-icon"]')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('merges the class input last', async () => {
    const { container } = await render(
      `<z-marker zVariant="border" class="text-foreground">
         <z-marker-content class="font-medium">Done</z-marker-content>
       </z-marker>`,
      { imports: [...ZardMarkerImports] },
    );

    const marker = container.querySelector('[data-slot="marker"]');
    expect(marker?.className).toContain('text-foreground');
    expect(marker?.className).not.toContain('text-muted-foreground');
    expect(container.querySelector('[data-slot="marker-content"]')?.className).toContain('font-medium');
  });

  it('forwards role="status" for in-progress markers', async () => {
    await render(
      `<z-marker role="status">
         <z-marker-content class="shimmer">Thinking...</z-marker-content>
       </z-marker>`,
      { imports: [...ZardMarkerImports] },
    );

    expect(screen.getByRole('status')).toHaveTextContent('Thinking...');
  });

  it('renders as a link and as a button through the attribute selector', async () => {
    const { fixture } = await render(TestInteractiveMarkerHost);

    const link = screen.getByRole('link', { name: 'View the pull request' });
    expect(link.getAttribute('data-slot')).toBe('marker');
    expect(link.querySelectorAll('a').length).toBe(0);

    const button = screen.getByRole('button', { name: 'Revert this change' });
    await userEvent.click(button);
    expect(fixture.componentInstance.clicks).toBe(1);
  });

  it('activates the button marker with the keyboard', async () => {
    const { fixture } = await render(TestInteractiveMarkerHost);

    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Revert this change' })).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(fixture.componentInstance.clicks).toBe(2);
  });
});
