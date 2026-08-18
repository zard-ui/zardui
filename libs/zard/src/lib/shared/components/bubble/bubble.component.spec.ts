import '@testing-library/jest-dom';
import { Component } from '@angular/core';

import { render, screen } from '@testing-library/angular';

import { ZardBubbleImports } from './bubble.imports';

@Component({
  selector: 'z-test-bubble',
  imports: [...ZardBubbleImports],
  template: `
    <z-bubble-group>
      <z-bubble>
        <z-bubble-content>First turn</z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="tinted" zAlign="end">
        <z-bubble-content>Second turn</z-bubble-content>
        <z-bubble-reactions zSide="top" zAlign="start">
          <button type="button">
            <span class="sr-only">3 thumbs up reactions</span>
          </button>
        </z-bubble-reactions>
      </z-bubble>
    </z-bubble-group>
  `,
})
class TestBubbleHost {}

describe('ZardBubbleComponent', () => {
  it('renders the full slot composition with data-slot attributes', async () => {
    await render(TestBubbleHost);

    expect(document.querySelector('[data-slot="bubble-group"]')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="bubble"]').length).toBe(2);
    expect(document.querySelectorAll('[data-slot="bubble-content"]').length).toBe(2);
    expect(document.querySelector('[data-slot="bubble-reactions"]')).toBeInTheDocument();
    expect(screen.getByText('First turn')).toBeInTheDocument();
  });

  it('reflects variant and alignment on data attributes', async () => {
    await render(TestBubbleHost);

    const bubbles = document.querySelectorAll('[data-slot="bubble"]');
    expect(bubbles[0].getAttribute('data-variant')).toBe('default');
    expect(bubbles[0].getAttribute('data-align')).toBe('start');
    expect(bubbles[1].getAttribute('data-variant')).toBe('tinted');
    expect(bubbles[1].getAttribute('data-align')).toBe('end');
  });

  it('aligns the bubble to the end through the align data attribute', async () => {
    await render(TestBubbleHost);

    const bubbles = document.querySelectorAll('[data-slot="bubble"]');
    expect(bubbles[1].getAttribute('data-align')).toBe('end');
    expect(bubbles[1].className).toContain('data-[align=end]:self-end');
  });

  it('reflects side and alignment of the reactions row', async () => {
    await render(TestBubbleHost);

    const reactions = document.querySelector('[data-slot="bubble-reactions"]');
    expect(reactions?.getAttribute('data-side')).toBe('top');
    expect(reactions?.getAttribute('data-align')).toBe('start');
    expect(reactions?.className).toContain('top-0');
    expect(reactions?.className).toContain('left-3');
  });

  it('defaults the reactions row to the bottom end corner', async () => {
    await render('<z-bubble><z-bubble-reactions>x</z-bubble-reactions></z-bubble>', {
      imports: [...ZardBubbleImports],
    });

    const reactions = document.querySelector('[data-slot="bubble-reactions"]');
    expect(reactions?.getAttribute('data-side')).toBe('bottom');
    expect(reactions?.getAttribute('data-align')).toBe('end');
  });

  it('keeps an interactive content element reachable', async () => {
    await render('<z-bubble><button type="button" z-bubble-content>Retry</button></z-bubble>', {
      imports: [...ZardBubbleImports],
    });

    const button = screen.getByRole('button', { name: 'Retry' });
    expect(button).toHaveAttribute('data-slot', 'bubble-content');
    button.focus();
    expect(button).toHaveFocus();
  });

  it('wraps bare content in a bubble surface', async () => {
    await render('<z-bubble>Hey there!</z-bubble>', { imports: [...ZardBubbleImports] });

    const content = document.querySelectorAll('[data-slot="bubble-content"]');
    expect(content.length).toBe(1);
    expect(content[0].tagName).toBe('DIV');
    expect(content[0]).toHaveTextContent('Hey there!');
    expect(content[0].className).toContain('rounded-3xl');
  });

  it('does not add a surface when the content is projected', async () => {
    await render('<z-bubble><z-bubble-content>Turn</z-bubble-content></z-bubble>', {
      imports: [...ZardBubbleImports],
    });

    const content = document.querySelectorAll('[data-slot="bubble-content"]');
    expect(content.length).toBe(1);
    expect(content[0].tagName).toBe('Z-BUBBLE-CONTENT');
  });

  it('does not add a surface when the content is an interactive element', async () => {
    await render('<z-bubble><button type="button" z-bubble-content>Retry</button></z-bubble>', {
      imports: [...ZardBubbleImports],
    });

    const content = document.querySelectorAll('[data-slot="bubble-content"]');
    expect(content.length).toBe(1);
    expect(content[0].tagName).toBe('BUTTON');
  });

  it('merges the class input last', async () => {
    await render('<z-bubble class="max-w-full"><z-bubble-content>Turn</z-bubble-content></z-bubble>', {
      imports: [...ZardBubbleImports],
    });

    const bubble = document.querySelector('[data-slot="bubble"]');
    expect(bubble?.className).toContain('max-w-full');
    expect(bubble?.className).not.toContain('max-w-[80%]');
  });
});
