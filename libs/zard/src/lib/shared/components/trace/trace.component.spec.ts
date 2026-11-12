import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardTraceImports } from './trace.imports';

@Component({
  selector: 'z-test-trace',
  imports: [...ZardTraceImports],
  template: `
    <z-trace data-testid="root">
      <z-trace-line data-testid="line">
        <z-trace-icon data-testid="icon"><svg></svg></z-trace-icon>
        <z-trace-title data-testid="title">Ran pnpm install</z-trace-title>
        <z-trace-description data-testid="description">12s</z-trace-description>
      </z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TestTraceHost {}

@Component({
  selector: 'z-test-trace-status',
  imports: [...ZardTraceImports],
  template: `
    <z-trace>
      <z-trace-line data-testid="none"><z-trace-title>Ran build</z-trace-title></z-trace-line>
      <z-trace-line zStatus="running" data-testid="running"><z-trace-title>Running build</z-trace-title></z-trace-line>
      <z-trace-line zStatus="error" data-testid="error">
        <z-trace-title>Failed to run build</z-trace-title>
      </z-trace-line>
      <z-trace-line zStatus="pending" data-testid="pending"><z-trace-title>Run build</z-trace-title></z-trace-line>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TestTraceStatusHost {}

@Component({
  selector: 'z-test-trace-attributes',
  imports: [...ZardTraceImports],
  template: `
    <div z-trace data-testid="root">
      <span z-trace-line data-testid="line">
        <span z-trace-icon></span>
        <span z-trace-title>Attribute title</span>
        <span z-trace-description>3 files</span>
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TestTraceAttributeHost {}

@Component({
  selector: 'z-test-trace-collapsible',
  imports: [...ZardTraceImports],
  template: `
    <z-trace>
      <z-trace-collapsible [(zOpen)]="open" data-testid="collapsible">
        <z-trace-collapsible-trigger>
          <z-trace-line><z-trace-title>Ran pnpm build</z-trace-title></z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content [zKeepMounted]="keepMounted()">
          <span data-testid="detail">build output</span>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TestTraceCollapsibleHost {
  open = false;
  readonly keepMounted = signal(false);
}

@Component({
  selector: 'z-test-trace-nested',
  imports: [...ZardTraceImports],
  template: `
    <z-trace>
      <z-trace-collapsible [(zOpen)]="outerOpen">
        <z-trace-collapsible-trigger>
          <z-trace-line><z-trace-title>Outer</z-trace-title></z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace-collapsible [(zOpen)]="innerOpen">
            <z-trace-collapsible-trigger>
              <z-trace-line><z-trace-title>Inner</z-trace-title></z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content zKeepMounted>
              <span>inner detail</span>
            </z-trace-collapsible-content>
          </z-trace-collapsible>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TestTraceNestedHost {
  outerOpen = false;
  innerOpen = false;
}

@Component({
  selector: 'z-test-trace-wrapped',
  imports: [...ZardTraceImports],
  template: `
    <z-trace>
      <a href="#docs" data-testid="link">
        <z-trace-line>
          <z-trace-title>
            Install Astro
            <span class="sr-only">(opens in a new tab)</span>
          </z-trace-title>
          <z-trace-icon><svg></svg></z-trace-icon>
        </z-trace-line>
      </a>
      <button type="button" data-testid="action" (click)="clicks = clicks + 1">
        <z-trace-line><z-trace-title>Open the diff</z-trace-title></z-trace-line>
      </button>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TestTraceWrappedHost {
  clicks = 0;
}

describe('ZardTrace', () => {
  describe('basic rendering', () => {
    it('renders the slot composition with data-slot attributes', async () => {
      await render(TestTraceHost);

      expect(screen.getByTestId('root')).toHaveAttribute('data-slot', 'trace');
      expect(screen.getByTestId('line')).toHaveAttribute('data-slot', 'trace-line');
      expect(screen.getByTestId('icon')).toHaveAttribute('data-slot', 'trace-icon');
      expect(screen.getByTestId('title')).toHaveAttribute('data-slot', 'trace-title');
      expect(screen.getByTestId('description')).toHaveAttribute('data-slot', 'trace-description');
    });

    it('supports the attribute selectors on any element', async () => {
      await render(TestTraceAttributeHost);

      expect(screen.getByTestId('root')).toHaveAttribute('data-slot', 'trace');
      expect(screen.getByTestId('line')).toHaveAttribute('data-slot', 'trace-line');
      expect(screen.getByText('Attribute title')).toHaveAttribute('data-slot', 'trace-title');
      expect(screen.getByText('3 files')).toHaveAttribute('data-slot', 'trace-description');
    });

    it('stacks rows in a column and truncates only the title', async () => {
      await render(TestTraceHost);

      expect(screen.getByTestId('root')).toHaveClass('flex', 'flex-col');
      expect(screen.getByTestId('title')).toHaveClass('truncate', 'min-w-0');
      expect(screen.getByTestId('description')).not.toHaveClass('truncate');
      expect(screen.getByTestId('description')).toHaveClass('shrink-0', 'tabular-nums');
    });

    it('merges the class input last so it wins over the defaults', async () => {
      await render(
        `<z-trace class="gap-6"><z-trace-line class="text-lg" data-testid="line"><z-trace-title class="font-bold" data-testid="title">T</z-trace-title></z-trace-line></z-trace>`,
        { imports: [...ZardTraceImports] },
      );

      expect(document.querySelector('[data-slot="trace"]')).toHaveClass('gap-6');
      expect(document.querySelector('[data-slot="trace"]')).not.toHaveClass('gap-2');
      expect(screen.getByTestId('line')).toHaveClass('text-lg');
      expect(screen.getByTestId('line')).not.toHaveClass('text-sm');
      expect(screen.getByTestId('title')).toHaveClass('font-bold', 'truncate');
    });
  });

  describe('status', () => {
    it('has no status by default', async () => {
      await render(TestTraceStatusHost);

      expect(screen.getByTestId('none')).not.toHaveAttribute('data-status');
    });

    it('reflects zStatus on data-status', async () => {
      await render(TestTraceStatusHost);

      expect(screen.getByTestId('running')).toHaveAttribute('data-status', 'running');
      expect(screen.getByTestId('error')).toHaveAttribute('data-status', 'error');
      expect(screen.getByTestId('pending')).toHaveAttribute('data-status', 'pending');
    });

    it('shimmers the title only while running', async () => {
      await render(TestTraceStatusHost);

      expect(screen.getByTestId('running').className).toContain('*:data-[slot=trace-title]:shimmer');
      expect(screen.getByTestId('none').className).not.toContain('shimmer');
      expect(screen.getByTestId('error').className).not.toContain('shimmer');
      expect(screen.getByTestId('pending').className).not.toContain('shimmer');
    });

    it('opts the title out of the shimmer for reduced motion', async () => {
      await render(TestTraceHost);

      expect(screen.getByTestId('title')).toHaveClass('motion-reduce:shimmer-none');
    });

    it('colours an error destructive and dims a pending row', async () => {
      await render(TestTraceStatusHost);

      expect(screen.getByTestId('error')).toHaveClass('text-destructive');
      expect(screen.getByTestId('error')).not.toHaveClass('text-muted-foreground');
      expect(screen.getByTestId('pending')).toHaveClass('opacity-60');
      expect(screen.getByTestId('none')).toHaveClass('text-muted-foreground');
    });
  });

  describe('accessibility', () => {
    it('hides the icon from assistive tech and keeps the title as the name', async () => {
      await render(TestTraceHost);

      expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByTestId('title')).not.toHaveAttribute('aria-hidden');
      expect(screen.getByText('Ran pnpm install')).toBeVisible();
    });

    it('is plain text: no role and not a tab stop', async () => {
      await render(TestTraceHost);

      const line = screen.getByTestId('line');
      expect(line).not.toHaveAttribute('role');
      expect(line).not.toHaveAttribute('tabindex');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('names a link by its title, including the sr-only hint', async () => {
      await render(TestTraceWrappedHost);

      expect(screen.getByRole('link', { name: 'Install Astro (opens in a new tab)' })).toBeInTheDocument();
    });

    it('does not nest interactive elements when wrapped in a link or button', async () => {
      await render(TestTraceWrappedHost);

      for (const wrapper of [screen.getByTestId('link'), screen.getByTestId('action')]) {
        expect(wrapper.querySelector('a, button, input, select, textarea, [tabindex]')).toBeNull();
      }
    });

    it('lets the wrapper provide the behaviour', async () => {
      const user = userEvent.setup();
      const { fixture } = await render(TestTraceWrappedHost);

      await user.click(screen.getByRole('button', { name: 'Open the diff' }));
      expect(fixture.componentInstance.clicks).toBe(1);
    });
  });

  describe('collapsible', () => {
    it('renders a real button with aria-expanded, closed by default', async () => {
      await render(TestTraceCollapsibleHost);

      const trigger = screen.getByRole('button', { name: 'Ran pnpm build' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('type', 'button');
      expect(trigger).toHaveAttribute('aria-controls');
    });

    it('does not nest a button in a button', async () => {
      await render(TestTraceCollapsibleHost);

      expect(screen.getAllByRole('button')).toHaveLength(1);
      expect(screen.getByRole('button').querySelector('button')).toBeNull();
    });

    it('hides the chevron from assistive tech and keeps the line text as the name', async () => {
      await render(TestTraceCollapsibleHost);

      const trigger = screen.getByRole('button');
      const icons = trigger.querySelectorAll('[data-slot="trace-icon"]');
      expect(icons).toHaveLength(1);
      expect(icons[0]).toHaveAttribute('aria-hidden', 'true');
      expect(trigger).toHaveAccessibleName('Ran pnpm build');
    });

    it('toggles on click and two-way binds zOpen', async () => {
      const user = userEvent.setup();
      const { fixture } = await render(TestTraceCollapsibleHost);
      const trigger = screen.getByRole('button');

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(fixture.componentInstance.open).toBe(true);
      expect(screen.getByTestId('detail')).toBeInTheDocument();

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(fixture.componentInstance.open).toBe(false);
    });

    it('toggles from the keyboard with Enter and Space', async () => {
      const user = userEvent.setup();
      await render(TestTraceCollapsibleHost);
      const trigger = screen.getByRole('button');

      await user.tab();
      expect(trigger).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard(' ');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens from the zOpen input', async () => {
      await render(
        `<z-trace-collapsible zOpen><z-trace-collapsible-trigger><z-trace-line><z-trace-title>T</z-trace-title></z-trace-line></z-trace-collapsible-trigger><z-trace-collapsible-content><span data-testid="detail">d</span></z-trace-collapsible-content></z-trace-collapsible>`,
        { imports: [...ZardTraceImports] },
      );

      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByTestId('detail')).toBeInTheDocument();
    });

    it('points aria-controls at the content panel', async () => {
      await render(TestTraceCollapsibleHost);

      const controls = screen.getByRole('button').getAttribute('aria-controls');
      expect(controls).toBeTruthy();
      expect(document.getElementById(controls ?? '')).toHaveAttribute('data-slot', 'collapsible-content');
    });

    it('exposes the open state on the trigger and the content', async () => {
      const user = userEvent.setup();
      await render(TestTraceCollapsibleHost);
      const trigger = screen.getByRole('button');
      const panel = document.querySelector('[data-slot="collapsible-content"]');

      expect(trigger).toHaveAttribute('data-state', 'closed');
      expect(panel).toHaveAttribute('data-state', 'closed');
      await user.click(trigger);
      expect(trigger).toHaveAttribute('data-state', 'open');
      expect(panel).toHaveAttribute('data-state', 'open');
    });

    it('rotates the chevron when expanded and mirrors it in RTL', async () => {
      await render(TestTraceCollapsibleHost);

      const chevron = screen.getByRole('button').querySelector('ng-icon');
      expect(chevron?.className).toContain('group-aria-expanded/trace-collapsible-trigger:rotate-90');
      expect(chevron?.className).toContain('rtl:-scale-x-100');
    });

    it('mutes the detail text', async () => {
      await render(TestTraceCollapsibleHost);

      expect(document.querySelector('[data-slot="trace-collapsible-content-inner"]')).toHaveClass(
        'text-muted-foreground',
      );
    });

    it('applies the class input to the trigger button', async () => {
      await render(
        `<z-trace-collapsible><z-trace-collapsible-trigger class="text-foreground"><z-trace-line><z-trace-title>T</z-trace-title></z-trace-line></z-trace-collapsible-trigger></z-trace-collapsible>`,
        { imports: [...ZardTraceImports] },
      );

      expect(screen.getByRole('button')).toHaveClass('text-foreground');
      expect(screen.getByRole('button')).not.toHaveClass('text-muted-foreground');
    });

    it('turns the trigger destructive when its line failed', async () => {
      await render(
        `<z-trace-collapsible><z-trace-collapsible-trigger><z-trace-line zStatus="error"><z-trace-title>Failed</z-trace-title></z-trace-line></z-trace-collapsible-trigger></z-trace-collapsible>`,
        { imports: [...ZardTraceImports] },
      );

      expect(screen.getByRole('button').className).toContain('has-[[data-status=error]]:text-destructive');
    });
  });

  describe('zKeepMounted', () => {
    const closeTransition = (): void => {
      const panel = document.querySelector('[data-slot="collapsible-content"]');
      const event = new Event('transitionend');
      Object.defineProperty(event, 'propertyName', { value: 'grid-template-rows' });
      panel?.dispatchEvent(event);
    };

    it('keeps closed content out of the DOM by default', async () => {
      await render(TestTraceCollapsibleHost);

      expect(screen.queryByTestId('detail')).not.toBeInTheDocument();
    });

    it('keeps closed content in the DOM with zKeepMounted', async () => {
      const { fixture } = await render(TestTraceCollapsibleHost);
      fixture.componentInstance.keepMounted.set(true);
      fixture.detectChanges();

      expect(screen.getByTestId('detail')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('removes the content only after the close transition ends', async () => {
      const user = userEvent.setup();
      const { fixture } = await render(TestTraceCollapsibleHost);
      await user.click(screen.getByRole('button'));
      expect(screen.getByTestId('detail')).toBeInTheDocument();

      await user.click(screen.getByRole('button'));
      expect(screen.getByTestId('detail')).toBeInTheDocument();

      closeTransition();
      fixture.detectChanges();
      expect(screen.queryByTestId('detail')).not.toBeInTheDocument();
    });

    it('ignores a transition that ends while the row is open', async () => {
      const user = userEvent.setup();
      const { fixture } = await render(TestTraceCollapsibleHost);
      await user.click(screen.getByRole('button'));

      closeTransition();
      fixture.detectChanges();
      expect(screen.getByTestId('detail')).toBeInTheDocument();
    });

    it('keeps nested rows open while an outer row is closed', async () => {
      const user = userEvent.setup();
      const { fixture } = await render(TestTraceNestedHost);
      const [outer, inner] = screen.getAllByRole('button');

      await user.click(outer);
      await user.click(inner);
      expect(fixture.componentInstance.innerOpen).toBe(true);

      await user.click(outer);
      expect(outer).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByText('inner detail')).toBeInTheDocument();
      expect(inner).toHaveAttribute('aria-expanded', 'true');

      await user.click(outer);
      expect(inner).toHaveAttribute('aria-expanded', 'true');
      expect(fixture.componentInstance.innerOpen).toBe(true);
    });
  });
});
