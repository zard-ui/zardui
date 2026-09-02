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

@Component({
  selector: 'z-test-message-templates',
  imports: [...ZardMessageImports],
  template: `
    <ng-template #header><span data-testid="header-tpl">Olivia</span></ng-template>
    <ng-template #footer><span data-testid="footer-tpl">Read Yesterday</span></ng-template>

    <z-message [zHeader]="header" [zFooter]="footer">Shorthand turn</z-message>

    <z-message>
      <z-message-content>
        <z-message-header [zHeader]="header" />
        <div>Composed turn</div>
        <z-message-footer [zFooter]="footer" />
      </z-message-content>
    </z-message>
  `,
})
class TestMessageTemplatesHost {}

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

describe('ZardMessageComponent shorthand', () => {
  it('builds the whole turn from inputs', async () => {
    await render(
      `<z-message zSrc="/avatar.png" zAlt="@olivia" zVariant="muted" zHeader="Olivia" zFooter="Delivered">
         How can I help you today?
       </z-message>`,
      { imports: [...ZardMessageImports] },
    );

    expect(document.querySelector('[data-slot="message-avatar"] [data-slot="avatar"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="message-content"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="message-header"]')).toHaveTextContent('Olivia');
    expect(document.querySelector('[data-slot="message-footer"]')).toHaveTextContent('Delivered');
    expect(document.querySelector('[data-slot="bubble"]')?.getAttribute('data-variant')).toBe('muted');
    expect(document.querySelector('[data-slot="bubble-content"]')).toHaveTextContent('How can I help you today?');
  });

  it('renders the shorthand avatar from initials alone', async () => {
    await render('<z-message zFallback="OL">Turn</z-message>', { imports: [...ZardMessageImports] });

    expect(document.querySelector('[data-slot="message-avatar"]')).toHaveTextContent('OL');
  });

  it('renders no avatar slot without an image or initials', async () => {
    await render('<z-message>Turn</z-message>', { imports: [...ZardMessageImports] });

    expect(document.querySelector('[data-slot="message-avatar"]')).not.toBeInTheDocument();
  });

  it('lets a projected avatar win over the shorthand', async () => {
    await render('<z-message zFallback="OL"><z-message-avatar>AV</z-message-avatar>Turn</z-message>', {
      imports: [...ZardMessageImports],
    });

    const avatars = document.querySelectorAll('[data-slot="message-avatar"]');
    expect(avatars.length).toBe(1);
    expect(avatars[0]).toHaveTextContent('AV');
  });

  it('drops the surface shorthand once the content is projected', async () => {
    await render(
      `<z-message zHeader="Olivia" zFooter="Delivered" zVariant="muted">
         <z-message-content><div>Turn</div></z-message-content>
       </z-message>`,
      { imports: [...ZardMessageImports] },
    );

    expect(document.querySelectorAll('[data-slot="message-content"]').length).toBe(1);
    expect(document.querySelector('[data-slot="bubble"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="message-header"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="message-footer"]')).not.toBeInTheDocument();
  });

  it('lifts the shorthand avatar off the footer line', async () => {
    await render('<z-message zFallback="OL" zFooter="Delivered">Turn</z-message>', {
      imports: [...ZardMessageImports],
    });

    const message = document.querySelector('[data-slot="message"]');
    expect(message?.querySelector('[data-slot="message-footer"]')).toBeInTheDocument();
    expect(message?.querySelector('[data-slot="message-avatar"]')?.className).toContain(
      'group-has-data-[slot=message-footer]/message:-translate-y-8',
    );
  });

  it('accepts header and footer content on the sub-components too', async () => {
    await render(
      `<z-message>
         <z-message-content>
           <z-message-header zHeader="Olivia" />
           <div>Turn</div>
           <z-message-footer zFooter="Delivered" />
         </z-message-content>
       </z-message>`,
      { imports: [...ZardMessageImports] },
    );

    expect(document.querySelector('[data-slot="message-header"]')).toHaveTextContent('Olivia');
    expect(document.querySelector('[data-slot="message-footer"]')).toHaveTextContent('Delivered');
  });

  it('renders a TemplateRef header and footer on the root and on the slots', async () => {
    await render(TestMessageTemplatesHost);

    const headers = document.querySelectorAll('[data-slot="message-header"]');
    const footers = document.querySelectorAll('[data-slot="message-footer"]');

    expect(headers.length).toBe(2);
    expect(footers.length).toBe(2);
    expect(document.querySelectorAll('[data-testid="header-tpl"]').length).toBe(2);
    expect(document.querySelectorAll('[data-testid="footer-tpl"]').length).toBe(2);
    headers.forEach(header => expect(header).toHaveTextContent('Olivia'));
    footers.forEach(footer => expect(footer).toHaveTextContent('Read Yesterday'));
  });
});
