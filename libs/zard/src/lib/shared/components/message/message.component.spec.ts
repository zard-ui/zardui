import '@testing-library/jest-dom';
import { Component } from '@angular/core';

import { render, screen } from '@testing-library/angular';

import { ZardMessageImports } from './message.imports';

@Component({
  selector: 'z-test-message',
  imports: [...ZardMessageImports],
  template: `
    <z-message-group>
      <z-message>
        <z-message-avatar>AV</z-message-avatar>
        <z-message-content>
          <z-message-header>Olivia</z-message-header>
          <div>First turn</div>
        </z-message-content>
      </z-message>
      <z-message zAlign="end">
        <z-message-avatar>ME</z-message-avatar>
        <z-message-content>
          <div>Second turn</div>
          <z-message-footer>Delivered</z-message-footer>
        </z-message-content>
      </z-message>
    </z-message-group>
  `,
})
class TestMessageHost {}

describe('ZardMessageComponent', () => {
  it('renders the full slot composition with data-slot attributes', async () => {
    await render(TestMessageHost);

    expect(document.querySelector('[data-slot="message-group"]')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="message"]').length).toBe(2);
    expect(document.querySelectorAll('[data-slot="message-avatar"]').length).toBe(2);
    expect(document.querySelectorAll('[data-slot="message-content"]').length).toBe(2);
    expect(document.querySelector('[data-slot="message-header"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="message-footer"]')).toBeInTheDocument();
    expect(screen.getByText('First turn')).toBeInTheDocument();
  });

  it('reflects the alignment on the data attribute', async () => {
    await render(TestMessageHost);

    const messages = document.querySelectorAll('[data-slot="message"]');
    expect(messages[0].getAttribute('data-align')).toBe('start');
    expect(messages[1].getAttribute('data-align')).toBe('end');
    expect(messages[1].className).toContain('data-[align=end]:flex-row-reverse');
  });

  it('keeps the reading order avatar, header, surface, footer', async () => {
    await render(TestMessageHost);

    const slots = Array.from(document.querySelectorAll('[data-slot^="message"]'))
      .map(element => element.getAttribute('data-slot'))
      .filter(slot => slot !== 'message-group' && slot !== 'message');

    expect(slots).toEqual([
      'message-avatar',
      'message-content',
      'message-header',
      'message-avatar',
      'message-content',
      'message-footer',
    ]);
  });

  it('renders the footer last even when it is written before the surface', async () => {
    await render(
      `<z-message>
         <z-message-content>
           <z-message-footer>Delivered</z-message-footer>
           <div>Turn</div>
         </z-message-content>
       </z-message>`,
      { imports: [...ZardMessageImports] },
    );

    const content = document.querySelector('[data-slot="message-content"]');
    expect(content?.lastElementChild?.getAttribute('data-slot')).toBe('message-footer');
  });

  it('projects the avatar before the content whatever the template order', async () => {
    await render(
      `<z-message>
         <z-message-content>Turn</z-message-content>
         <z-message-avatar>AV</z-message-avatar>
       </z-message>`,
      { imports: [...ZardMessageImports] },
    );

    const message = document.querySelector('[data-slot="message"]');
    expect(message?.firstElementChild?.getAttribute('data-slot')).toBe('message-avatar');
  });

  it('lifts the avatar off the footer line', async () => {
    await render(TestMessageHost);

    const avatars = document.querySelectorAll('[data-slot="message-avatar"]');
    expect(avatars[1].className).toContain('group-has-data-[slot=message-footer]/message:-translate-y-8');
    expect(avatars[1].className).toContain('self-end');
  });

  it('follows the message side on the footer', async () => {
    await render(TestMessageHost);

    const footer = document.querySelector('[data-slot="message-footer"]');
    expect(footer?.className).toContain('group-data-[align=end]/message:justify-end');
  });

  it('merges the class input last', async () => {
    await render('<z-message class="gap-6">Turn</z-message>', { imports: [...ZardMessageImports] });

    const message = document.querySelector('[data-slot="message"]');
    expect(message?.className).toContain('gap-6');
    expect(message?.className).not.toContain('gap-2');
  });
});
