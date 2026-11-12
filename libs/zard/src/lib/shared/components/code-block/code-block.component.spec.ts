import '@testing-library/jest-dom';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, signal } from '@angular/core';

import { fireEvent, render, screen, waitFor } from '@testing-library/angular';

import { ZardCodeBlockImports } from './code-block.imports';

const CODE = 'npx zard-cli@latest add button';

function mockNavigatorClipboard(writeText: jest.Mock) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

describe('ZardCodeBlock', () => {
  describe('root', () => {
    it('renders the block with the default type and size', async () => {
      const { container } = await render(
        `<z-code-block><z-code-block-content>${CODE}</z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );
      const root = container.querySelector('z-code-block') as HTMLElement;

      expect(root).toHaveAttribute('data-slot', 'code-block');
      expect(root).toHaveAttribute('data-variant', 'default');
      expect(root).toHaveAttribute('data-size', 'default');
      expect(root).toHaveClass('border-input', 'rounded-lg', 'w-full');
      expect(root).not.toHaveClass('text-xs');
    });

    it('applies the destructive type', async () => {
      const { container } = await render(
        `<z-code-block zType="destructive"><z-code-block-content>${CODE}</z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );
      const root = container.querySelector('z-code-block') as HTMLElement;

      expect(root).toHaveAttribute('data-variant', 'destructive');
      expect(root).toHaveClass('text-destructive', 'border-destructive/30');
      expect(root).not.toHaveClass('border-input');
    });

    it('applies the sm size', async () => {
      const { container } = await render(
        `<z-code-block zSize="sm"><z-code-block-content>${CODE}</z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );
      const root = container.querySelector('z-code-block') as HTMLElement;

      expect(root).toHaveAttribute('data-size', 'sm');
      expect(root).toHaveClass('text-xs');
    });

    it('merges the class input last so it wins over the variants', async () => {
      const { container } = await render(
        `<z-code-block class="rounded-none w-64"><z-code-block-content>${CODE}</z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );
      const root = container.querySelector('z-code-block') as HTMLElement;

      expect(root).toHaveClass('rounded-none', 'w-64');
      expect(root).not.toHaveClass('rounded-lg');
      expect(root).not.toHaveClass('w-full');
    });

    it('works as an attribute on any element', async () => {
      const { container } = await render(`<div z-code-block><div z-code-block-content>${CODE}</div></div>`, {
        imports: [...ZardCodeBlockImports],
      });

      expect(container.querySelector('[data-slot="code-block"]')).toBeInTheDocument();
      expect(container.querySelector('[data-slot="code-block-content"]')).toBeInTheDocument();
    });

    it('exposes the component through exportAs', async () => {
      const { container } = await render(
        `<z-code-block #block="zCodeBlock"><z-code-block-content>${CODE}</z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );

      expect(container.querySelector('z-code-block')).toBeInTheDocument();
    });
  });

  describe('header, title, actions and footer', () => {
    it('renders each part with its slot and merges custom classes', async () => {
      const { container } = await render(
        `<z-code-block>
          <z-code-block-header class="bg-red-500">
            <z-code-block-title class="font-bold">button.component.ts</z-code-block-title>
            <z-code-block-actions class="gap-4">actions</z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content>${CODE}</z-code-block-content>
          <z-code-block-footer class="justify-center">footer</z-code-block-footer>
        </z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );

      expect(container.querySelector('[data-slot="code-block-header"]')).toHaveClass('bg-red-500', 'flex');
      expect(container.querySelector('[data-slot="code-block-title"]')).toHaveClass('font-bold', 'truncate');
      expect(container.querySelector('[data-slot="code-block-actions"]')).toHaveClass('gap-4', 'ms-auto');
      expect(container.querySelector('[data-slot="code-block-footer"]')).toHaveClass('justify-center', 'flex');
      expect(screen.getByText('button.component.ts')).toBeInTheDocument();
    });

    it('truncates a long title', async () => {
      await render(
        `<z-code-block><z-code-block-header><z-code-block-title>a-very-long-file-name.ts</z-code-block-title></z-code-block-header></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );

      expect(screen.getByText('a-very-long-file-name.ts')).toHaveClass('truncate', 'min-w-0');
    });

    it('floats the actions when they are a direct child of the block', async () => {
      const { container } = await render(
        `<z-code-block>
          <z-code-block-actions>actions</z-code-block-actions>
          <z-code-block-content>${CODE}</z-code-block-content>
        </z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );
      const actions = container.querySelector('[data-slot="code-block-actions"]') as HTMLElement;

      expect(actions.parentElement).toHaveAttribute('data-slot', 'code-block');
      expect(actions.className).toContain('[[data-slot=code-block]>&]:absolute');
      expect(actions.className).toContain('[[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100');
    });
  });

  describe('content', () => {
    it('is a focusable, always left-to-right scroll container', async () => {
      const { container } = await render(
        `<div dir="rtl"><z-code-block><z-code-block-content>${CODE}</z-code-block-content></z-code-block></div>`,
        { imports: [...ZardCodeBlockImports] },
      );
      const content = container.querySelector('z-code-block-content') as HTMLElement;

      expect(content).toHaveAttribute('dir', 'ltr');
      expect(content).toHaveAttribute('tabindex', '0');
      expect(content).toHaveClass('overflow-auto', 'font-mono', 'whitespace-pre');
    });

    it('lets the consumer remove the tab stop', async () => {
      const { container } = await render(
        `<z-code-block><z-code-block-content tabindex="-1">${CODE}</z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );

      expect(container.querySelector('z-code-block-content')).toHaveAttribute('tabindex', '-1');
    });

    it('renders a plain string inside a code element', async () => {
      const { container } = await render(
        `<z-code-block><z-code-block-content>${CODE}</z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );

      expect(container.querySelector('z-code-block-content code')).toHaveTextContent(CODE);
      expect(container.querySelector('z-code-block-content')).not.toHaveAttribute('data-numbered');
      expect(container.querySelector('z-code-block-content')).not.toHaveAttribute('data-wrap');
    });

    it('caps its height through the class input', async () => {
      const { container } = await render(
        `<z-code-block><z-code-block-content class="max-h-24">${CODE}</z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );

      expect(container.querySelector('z-code-block-content')).toHaveClass('max-h-24', 'overflow-auto');
    });

    describe('zWrap', () => {
      it('scrolls long lines by default', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content>${CODE}</z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports] },
        );
        const content = container.querySelector('z-code-block-content') as HTMLElement;

        expect(content).toHaveClass('whitespace-pre');
        expect(content).not.toHaveClass('whitespace-pre-wrap');
        expect(content.querySelector('code')).toHaveClass('min-w-max');
      });

      it('wraps long lines', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content zWrap>${CODE}</z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports] },
        );
        const content = container.querySelector('z-code-block-content') as HTMLElement;

        expect(content).toHaveAttribute('data-wrap');
        expect(content).toHaveClass('whitespace-pre-wrap', 'wrap-anywhere');
        expect(content).not.toHaveClass('whitespace-pre');
        expect(content.querySelector('code')).toHaveClass('min-w-0');
      });
    });

    describe('zLineNumbers', () => {
      it('marks the content as numbered and starts counting at 1', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content zLineNumbers><z-code-block-line>a</z-code-block-line></z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports] },
        );
        const content = container.querySelector('z-code-block-content') as HTMLElement;

        expect(content).toHaveAttribute('data-numbered');
        expect(content.style.counterReset).toBe('line 0');
      });

      it('numbers from zStartLine', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content zLineNumbers [zStartLine]="42"><z-code-block-line>a</z-code-block-line></z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports] },
        );

        expect((container.querySelector('z-code-block-content') as HTMLElement).style.counterReset).toBe('line 41');
      });

      it('accepts zStartLine as a static attribute', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content zLineNumbers zStartLine="10"><z-code-block-line>a</z-code-block-line></z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports] },
        );

        expect((container.querySelector('z-code-block-content') as HTMLElement).style.counterReset).toBe('line 9');
      });

      it('splits a plain string into numbered lines and keeps the blank ones', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content zLineNumbers>{{ code }}</z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports], componentProperties: { code: 'one\n\nthree\n' } },
        );
        const lines = container.querySelectorAll('z-code-block-content [data-slot="code-block-line"]');

        expect(lines).toHaveLength(3);
        expect(lines[0].textContent).toBe('one');
        expect(lines[1].textContent).toBe('\n');
        expect(lines[2].textContent).toBe('three');
      });

      it('hides the source text that was split so it is rendered once', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content zLineNumbers>{{ code }}</z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports], componentProperties: { code: 'one\ntwo' } },
        );

        expect(container.querySelector('[data-slot="code-block-source"]')).toHaveClass('hidden');
      });

      it('does not split a plain string without line numbers', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content>{{ code }}</z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports], componentProperties: { code: 'one\ntwo' } },
        );

        expect(container.querySelectorAll('[data-slot="code-block-line"]')).toHaveLength(0);
        expect(container.querySelector('[data-slot="code-block-source"]')).toHaveClass('contents');
      });

      it('follows the text when it changes', async () => {
        const { container, rerender } = await render(
          `<z-code-block><z-code-block-content zLineNumbers>{{ code }}</z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports], componentProperties: { code: 'one' } },
        );
        expect(container.querySelectorAll('[data-slot="code-block-line"]')).toHaveLength(1);

        await rerender({ componentProperties: { code: 'one\ntwo\nthree' } });

        expect(container.querySelectorAll('[data-slot="code-block-line"]')).toHaveLength(3);
      });

      it('does not render a second set of lines when lines are projected', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content zLineNumbers>
            <z-code-block-line>a</z-code-block-line>
            <z-code-block-line>b</z-code-block-line>
          </z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports] },
        );

        expect(container.querySelectorAll('[data-slot="code-block-line"]')).toHaveLength(2);
      });

      it('leaves the numbers to CSS so they are not text', async () => {
        await render(
          `<z-code-block><z-code-block-content zLineNumbers><z-code-block-line>only code</z-code-block-line></z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports] },
        );
        const line = screen.getByText('only code').closest('[data-slot="code-block-line"]') as HTMLElement;

        expect(line.textContent).toBe('only code');
        expect(line.className).toContain('in-data-numbered:[counter-increment:line]');
        expect(line.className).toContain('in-data-numbered:before:select-none');
        // empty alternative text takes the number out of the accessibility tree
        expect(line.className).toContain('before:content-[counter(line)_/_""]');
      });
    });
  });

  describe('line', () => {
    async function renderLine(type?: string) {
      const attribute = type ? ` zType="${type}"` : '';
      const { container } = await render(
        `<z-code-block><z-code-block-content><z-code-block-line${attribute}>const a = 1;</z-code-block-line></z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );
      return container.querySelector('z-code-block-line') as HTMLElement;
    }

    it('renders the default line without a tint', async () => {
      const line = await renderLine();

      expect(line).toHaveAttribute('data-slot', 'code-block-line');
      expect(line).toHaveAttribute('data-variant', 'default');
      expect(line).not.toHaveClass('bg-muted');
      expect(line).not.toHaveClass('bg-destructive/10');
    });

    it('tints a highlighted line', async () => {
      const line = await renderLine('highlighted');

      expect(line).toHaveAttribute('data-variant', 'highlighted');
      expect(line).toHaveClass('bg-muted');
      expect(line.className).not.toContain('after:content');
    });

    it('marks an added line with a plus', async () => {
      const line = await renderLine('added');

      expect(line).toHaveAttribute('data-variant', 'added');
      expect(line).toHaveClass('bg-muted', 'after:content-["+"]');
    });

    it('marks a removed line with a minus', async () => {
      const line = await renderLine('removed');

      expect(line).toHaveAttribute('data-variant', 'removed');
      expect(line).toHaveClass('bg-destructive/10', 'after:content-["−"]');
    });

    it('draws the diff marker as generated content that cannot be selected', async () => {
      const line = await renderLine('added');

      expect(line).toHaveClass('after:select-none', 'after:absolute');
      // the marker is not part of the text, so it is not copied
      expect(line.textContent).toBe('const a = 1;');
    });

    it('keeps a blank line by holding a newline', async () => {
      const { container } = await render(
        `<z-code-block><z-code-block-content><z-code-block-line>a</z-code-block-line><z-code-block-line></z-code-block-line><z-code-block-line>c</z-code-block-line></z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );
      const lines = container.querySelectorAll('z-code-block-line');

      expect(lines[0].textContent).toBe('a');
      expect(lines[1].textContent).toBe('\n');
      expect(lines[2].textContent).toBe('c');
    });

    it('merges custom classes', async () => {
      const { container } = await render(
        `<z-code-block><z-code-block-content><z-code-block-line class="font-bold">x</z-code-block-line></z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );

      expect(container.querySelector('z-code-block-line')).toHaveClass('font-bold');
    });

    describe('zTokens', () => {
      const tokens = [
        { content: 'const', style: { '--shiki-light': '#d73a49', '--shiki-dark': '#f97583' } },
        { content: ' a' },
      ];

      it('renders the tokens as spans with their colors as custom properties', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content><z-code-block-line [zTokens]="tokens" /></z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports], componentProperties: { tokens } },
        );
        const spans = container.querySelectorAll('[data-slot="code-block-line-content"] > span:not([data-slot])');

        expect(spans).toHaveLength(2);
        expect(spans[0]).toHaveTextContent('const');
        expect((spans[0] as HTMLElement).style.getPropertyValue('--shiki-light')).toBe('#d73a49');
        expect((spans[0] as HTMLElement).style.getPropertyValue('--shiki-dark')).toBe('#f97583');
        expect(spans[0]).toHaveClass('text-(--shiki-light)', 'dark:text-(--shiki-dark)');
        expect(container.querySelector('z-code-block-line')?.textContent).toBe('const a');
      });

      it('never interprets the token text as markup', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content><z-code-block-line [zTokens]="tokens" /></z-code-block-content></z-code-block>`,
          {
            imports: [...ZardCodeBlockImports],
            componentProperties: { tokens: [{ content: '<img src=x onerror=alert(1)>' }] },
          },
        );

        expect(container.querySelector('img')).toBeNull();
        expect(container.querySelector('z-code-block-line')?.textContent).toBe('<img src=x onerror=alert(1)>');
      });

      it('hides the projected text while tokens are set, so the line is not rendered twice', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content><z-code-block-line [zTokens]="tokens">fallback</z-code-block-line></z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports], componentProperties: { tokens } },
        );

        expect(container.querySelector('[data-slot="code-block-line-source"]')).toHaveClass('hidden');
      });

      it('keeps a line with no tokens as a blank line', async () => {
        const { container } = await render(
          `<z-code-block><z-code-block-content><z-code-block-line [zTokens]="[]" /></z-code-block-content></z-code-block>`,
          { imports: [...ZardCodeBlockImports] },
        );

        expect(container.querySelector('z-code-block-line')?.textContent).toBe('\n');
      });
    });
  });

  describe('copy button', () => {
    let writeText: jest.Mock;

    beforeEach(() => {
      writeText = jest.fn().mockResolvedValue(undefined);
      mockNavigatorClipboard(writeText);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    // Throws instead of returning a rejected promise: Zone.js would flag an awaited rejection as unhandled.
    function rejectWriteText() {
      writeText.mockImplementation(() => {
        throw new Error('denied');
      });
    }

    async function renderCopy(extra = '') {
      return render(
        `<z-code-block>
          <z-code-block-header>
            <z-code-block-actions><z-code-block-copy-button [zValue]="value" ${extra} /></z-code-block-actions>
          </z-code-block-header>
          <z-code-block-content>${CODE}</z-code-block-content>
        </z-code-block>`,
        { imports: [...ZardCodeBlockImports], componentProperties: { value: CODE } },
      );
    }

    it('renders a ghost icon button labelled "Copy"', async () => {
      await renderCopy();
      const button = screen.getByRole('button', { name: 'Copy' });

      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('data-slot', 'code-block-copy-button');
      expect(button).toHaveClass('size-6');
      expect(button).not.toHaveAttribute('data-copied');
    });

    it('copies its value on click', async () => {
      await renderCopy();

      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

      await waitFor(() => expect(writeText).toHaveBeenCalledWith(CODE));
    });

    it('announces "Copied" in a polite live region and relabels the button', async () => {
      const { container } = await renderCopy();
      const region = container.querySelector('[aria-live="polite"]') as HTMLElement;
      expect(region).toBeInTheDocument();
      expect(region.textContent).toBe('');

      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

      await waitFor(() => expect(region).toHaveTextContent('Copied'));
      expect(screen.getByRole('button', { name: 'Copied' })).toHaveAttribute('data-copied');
    });

    it('goes back to "Copy" after two seconds', async () => {
      jest.useFakeTimers();
      const { container } = await renderCopy();
      const region = container.querySelector('[aria-live="polite"]') as HTMLElement;

      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
      await jest.advanceTimersByTimeAsync(0);
      await waitFor(() => expect(region).toHaveTextContent('Copied'));

      await jest.advanceTimersByTimeAsync(2000);

      await waitFor(() => expect(region.textContent).toBe(''));
      expect(screen.getByRole('button', { name: 'Copy' })).not.toHaveAttribute('data-copied');
    });

    it('can be activated with the keyboard', async () => {
      await renderCopy();
      const button = screen.getByRole('button', { name: 'Copy' });

      button.focus();
      expect(button).toHaveFocus();
      fireEvent.click(button);

      await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    });

    it('falls back to the CDK clipboard when the async API rejects', async () => {
      rejectWriteText();
      const copy = jest.fn().mockReturnValue(true);
      const { container } = await render(`<z-code-block-copy-button [zValue]="value" />`, {
        imports: [...ZardCodeBlockImports],
        componentProperties: { value: CODE },
        providers: [{ provide: Clipboard, useValue: { copy } }],
      });

      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

      await waitFor(() => expect(copy).toHaveBeenCalledWith(CODE));
      await waitFor(() => expect(container.querySelector('[aria-live]')).toHaveTextContent('Copied'));
    });

    it('does not announce "Copied" when nothing could be copied', async () => {
      rejectWriteText();
      const { container } = await render(`<z-code-block-copy-button [zValue]="value" />`, {
        imports: [...ZardCodeBlockImports],
        componentProperties: { value: CODE },
        providers: [{ provide: Clipboard, useValue: { copy: () => false } }],
      });

      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(container.querySelector('[aria-live]')?.textContent).toBe('');
    });

    it('copies the value, not the rendered text (no line numbers or markers)', async () => {
      const diff = '- old\n+ new';
      await render(
        `<z-code-block>
          <z-code-block-actions><z-code-block-copy-button [zValue]="value" /></z-code-block-actions>
          <z-code-block-content zLineNumbers>
            <z-code-block-line zType="removed">old</z-code-block-line>
            <z-code-block-line zType="added">new</z-code-block-line>
          </z-code-block-content>
        </z-code-block>`,
        { imports: [...ZardCodeBlockImports], componentProperties: { value: 'old\nnew' } },
      );

      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));

      await waitFor(() => expect(writeText).toHaveBeenCalledWith('old\nnew'));
      expect(writeText).not.toHaveBeenCalledWith(diff);
    });

    it('merges the class input into the button', async () => {
      await renderCopy('class="size-10"');

      expect(screen.getByRole('button', { name: 'Copy' })).toHaveClass('size-10');
    });

    it('stops its timer when it is destroyed', async () => {
      jest.useFakeTimers();
      const { fixture } = await renderCopy();

      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
      await jest.advanceTimersByTimeAsync(0);
      fixture.destroy();

      expect(jest.getTimerCount()).toBe(0);
    });
  });

  describe('accessibility', () => {
    it('keeps the block readable as text for assistive technology', async () => {
      await render(
        `<z-code-block>
          <z-code-block-header><z-code-block-title>greeting.ts</z-code-block-title></z-code-block-header>
          <z-code-block-content zLineNumbers>
            <z-code-block-line zType="removed">old</z-code-block-line>
            <z-code-block-line zType="added">new</z-code-block-line>
          </z-code-block-content>
        </z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );

      expect(screen.getByText('old')).toBeInTheDocument();
      expect(screen.getByText('new')).toBeInTheDocument();
      // numbers are generated content only
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('lets keyboard users reach the scrollable content', async () => {
      const { container } = await render(
        `<z-code-block><z-code-block-content>${CODE}</z-code-block-content></z-code-block>`,
        { imports: [...ZardCodeBlockImports] },
      );
      const content = container.querySelector('z-code-block-content') as HTMLElement;

      content.focus();

      expect(content).toHaveFocus();
    });
  });

  describe('host usage', () => {
    @Component({
      selector: 'z-test-host',
      imports: [...ZardCodeBlockImports],
      template: `
        <z-code-block [zType]="type()" [zSize]="size()">
          <z-code-block-content [zWrap]="wrap()">{{ code }}</z-code-block-content>
        </z-code-block>
      `,
    })
    class HostComponent {
      readonly type = signal<'default' | 'destructive'>('default');
      readonly size = signal<'default' | 'sm'>('default');
      readonly wrap = signal(false);
      readonly code = 'line';
    }

    it('reacts to input changes', async () => {
      const { fixture, detectChanges } = await render(HostComponent);
      const root = fixture.nativeElement.querySelector('z-code-block') as HTMLElement;

      fixture.componentInstance.type.set('destructive');
      fixture.componentInstance.size.set('sm');
      fixture.componentInstance.wrap.set(true);
      detectChanges();

      expect(root).toHaveAttribute('data-variant', 'destructive');
      expect(root).toHaveAttribute('data-size', 'sm');
      expect(fixture.nativeElement.querySelector('z-code-block-content')).toHaveAttribute('data-wrap');
    });
  });
});
