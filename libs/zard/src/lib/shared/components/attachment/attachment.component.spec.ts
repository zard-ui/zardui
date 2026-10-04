import { Component, reflectComponentType, signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/angular';

import type {
  ZardAttachmentMediaVariantVariants,
  ZardAttachmentOrientationVariants,
  ZardAttachmentSizeVariants,
  ZardAttachmentStateVariants,
} from './attachment.variants';
import { ATTACHMENT_API } from './doc/api';
import { ZardAttachmentImports } from './imports';
import { ZardAttachmentActionComponent, ZardAttachmentGroupComponent } from './index';

@Component({
  imports: [...ZardAttachmentImports],
  template: `
    <z-attachment [zState]="state()" [zSize]="size()" [zOrientation]="orientation()" class="p-8">
      <z-attachment-media [zVariant]="media()">Media</z-attachment-media>
      <z-attachment-content>
        <z-attachment-title>Report.pdf</z-attachment-title>
        <z-attachment-description>{{ state() }}</z-attachment-description>
        <z-attachment zState="done">
          <z-attachment-title>Nested.txt</z-attachment-title>
        </z-attachment>
      </z-attachment-content>
      <z-attachment-actions><button z-attachment-action aria-label="Remove">×</button></z-attachment-actions>
      <button z-attachment-trigger aria-label="Preview"></button>
    </z-attachment>
    <z-attachment>
      <z-attachment-media>Default media</z-attachment-media>
      <z-attachment-title>Sibling.txt</z-attachment-title>
    </z-attachment>
  `,
})
class Composition {
  readonly state = signal<ZardAttachmentStateVariants>('done');
  readonly size = signal<ZardAttachmentSizeVariants>('default');
  readonly orientation = signal<ZardAttachmentOrientationVariants>('horizontal');
  readonly media = signal<ZardAttachmentMediaVariantVariants>('icon');
}

describe('attachment composition', () => {
  it('exports nine parts and projects every slot with defaults', async () => {
    expect(ZardAttachmentImports).toHaveLength(9);
    const { container } = await render(Composition);
    const root = container.querySelector('z-attachment')!;
    expect(root).toHaveAttribute('data-state', 'done');
    expect(root).toHaveAttribute('data-size', 'default');
    expect(root).toHaveAttribute('data-orientation', 'horizontal');
    expect(root).not.toHaveAttribute('aria-busy');
    expect(container.querySelector('z-attachment-media')).toHaveAttribute('data-variant', 'icon');
    const unbound = container.querySelectorAll('z-attachment')[2];
    expect(unbound).toHaveAttribute('data-state', 'done');
    expect(unbound).toHaveAttribute('data-size', 'default');
    expect(unbound).toHaveAttribute('data-orientation', 'horizontal');
    expect(screen.getByText('Default media')).toHaveAttribute('data-variant', 'icon');
    for (const slot of ['attachment', 'media', 'content', 'title', 'description', 'actions', 'action', 'trigger']) {
      expect(
        container.querySelector(`[data-slot="${slot === 'attachment' ? slot : `attachment-${slot}`}"]`),
      ).not.toBeNull();
    }
    expect(screen.getByRole('button', { name: 'Remove' })).toHaveAttribute('data-size', 'icon-xs');
    expect(root).toHaveClass('p-8');
    expect(root).not.toHaveClass('p-3');
  });

  it('updates all 60 state/size/orientation/media combinations and clears stale busy styling', async () => {
    const { fixture, container } = await render(Composition);
    const root = container.querySelector('z-attachment')!;
    const title = container.querySelector('z-attachment-title')!;
    const stateClasses = {
      idle: 'border-border',
      uploading: 'bg-muted/50',
      processing: 'bg-muted/50',
      error: 'text-destructive',
      done: 'border-border',
    };
    const sizeClasses = { default: 'gap-3', sm: 'gap-2', xs: 'gap-1.5' };
    for (const state of ['uploading', 'processing', 'error', 'idle', 'done'] as const) {
      fixture.componentInstance.state.set(state);
      for (const size of ['default', 'sm', 'xs'] as const) {
        fixture.componentInstance.size.set(size);
        for (const orientation of ['horizontal', 'vertical'] as const) {
          fixture.componentInstance.orientation.set(orientation);
          for (const media of ['icon', 'image'] as const) {
            fixture.componentInstance.media.set(media);
            fixture.detectChanges();
            expect(root).toHaveAttribute('data-state', state);
            expect(root).toHaveAttribute('data-size', size);
            expect(root).toHaveAttribute('data-orientation', orientation);
            expect(root).toHaveClass(
              stateClasses[state],
              sizeClasses[size],
              orientation === 'vertical' ? 'flex-col' : 'flex-row',
            );
            expect(container.querySelector('z-attachment-media')).toHaveAttribute('data-variant', media);
            expect(container.querySelector('z-attachment-media')).toHaveClass(
              media === 'image' ? 'size-16' : 'size-10',
            );
            expect(title.classList.contains('shimmer')).toBe(state === 'uploading' || state === 'processing');
            expect(root.getAttribute('aria-busy')).toBe(
              state === 'uploading' || state === 'processing' ? 'true' : null,
            );
            expect(screen.getByText('Nested.txt')).not.toHaveClass('shimmer');
            expect(screen.getByText('Sibling.txt')).not.toHaveClass('shimmer');
          }
        }
      }
    }
  });

  it('documents every reflected input and the inherited action API without weakening the validator', () => {
    for (const part of ZardAttachmentImports) {
      if (part.name.endsWith('Directive')) continue;
      const metadata = reflectComponentType(part)!;
      const selector = metadata.selector.split(',')[0].trim();
      const section = ATTACHMENT_API.find(section => section.selector === selector)!;
      expect(section).toBeDefined();
      expect(section.props.map(prop => prop.name)).toEqual(
        expect.arrayContaining(metadata.inputs.map(input => `[${input.templateName}]`)),
      );
    }
    expect(reflectComponentType(ZardAttachmentActionComponent)!.inputs.map(input => input.templateName)).toEqual(
      expect.arrayContaining(['zType', 'zSize', 'zShape', 'zLoading', 'zDisabled', 'class']),
    );
    expect(ATTACHMENT_API).toHaveLength(9);
    expect(new Set(ATTACHMENT_API.map(section => section.selector)).size).toBe(9);
  });

  it('keeps inherited loading projection and disconnects its observer on destroy', async () => {
    const { fixture, container } = await render(
      '<button z-attachment-action zLoading aria-label="Loading">Wait</button>',
      { imports: [...ZardAttachmentImports] },
    );
    expect(container.querySelector('ng-icon')).not.toBeNull();
    expect(screen.getByRole('button')).toHaveClass('opacity-50');
    const action = fixture.debugElement.query(By.directive(ZardAttachmentActionComponent))
      .componentInstance as ZardAttachmentActionComponent;
    const disconnect = jest.fn();
    Object.assign(action, { _mutationObserver: { disconnect } });
    const onClick = jest.spyOn(action, 'onClick');
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    fixture.destroy();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('allows local classes on each part to override defaults', async () => {
    const { container } = await render(
      `
      <z-attachment-group aria-label="Files" class="gap-8">
        <z-attachment class="p-8">
          <z-attachment-media class="size-20">Media</z-attachment-media>
          <z-attachment-content class="gap-8"><z-attachment-title class="font-bold">Title</z-attachment-title><z-attachment-description class="text-primary">Description</z-attachment-description></z-attachment-content>
          <z-attachment-actions class="z-30"><button z-attachment-action class="z-40 size-12">Action</button></z-attachment-actions>
          <button z-attachment-trigger class="z-0" aria-label="Preview"></button>
        </z-attachment>
      </z-attachment-group>`,
      { imports: [...ZardAttachmentImports] },
    );
    for (const [slot, added, removed] of [
      ['group', 'gap-8', 'gap-3'],
      ['media', 'size-20', 'size-10'],
      ['content', 'gap-8', 'gap-1'],
      ['title', 'font-bold', 'font-medium'],
      ['description', 'text-primary', 'text-muted-foreground'],
      ['actions', 'z-30', 'z-20'],
      ['action', 'z-40', 'z-20'],
      ['trigger', 'z-0', 'z-10'],
    ]) {
      const element = container.querySelector(`[data-slot="attachment-${slot}"]`)!;
      expect(element).toHaveClass(added);
      expect(element).not.toHaveClass(removed);
    }
  });
});

@Component({
  imports: [...ZardAttachmentImports],
  template: `
    <button
      z-attachment-action
      [disabled]="nativeDisabled()"
      [zDisabled]="zDisabled()"
      [type]="type()"
      tabindex="3"
      (click)="actions = actions + 1"
    >
      Bound
    </button>
    <button z-attachment-action disabled>Static</button>
    <button z-attachment-action>Default</button>
    <button z-attachment-action type="reset">Reset</button>
    <a
      z-attachment-action
      href="#file"
      target="_blank"
      download="file.pdf"
      [zDisabled]="zDisabled()"
      tabindex="2"
      (click)="links = links + 1; $event.preventDefault()"
    >
      Download
    </a>
    <z-attachment>
      <z-attachment-content><z-attachment-title>Preview.pdf</z-attachment-title></z-attachment-content>
      <button z-attachment-trigger aria-label="Preview" (click)="previews = previews + 1"></button>
      <z-attachment-actions>
        <button z-attachment-action aria-label="Remove" (click)="actions = actions + 1">×</button>
      </z-attachment-actions>
    </z-attachment>
  `,
})
class NativeActions {
  readonly nativeDisabled = signal(false);
  readonly zDisabled = signal(false);
  readonly type = signal<'button' | 'submit' | 'reset'>('submit');
  actions = 0;
  links = 0;
  previews = 0;
}

describe('attachment native interactions', () => {
  it('preserves static and dynamic disabled, native types, and consumer tab order', async () => {
    const { fixture } = await render(NativeActions);
    const bound = screen.getByRole('button', { name: 'Bound' });
    expect(bound).toHaveAttribute('type', 'submit');
    expect(bound).toHaveAttribute('tabindex', '3');
    expect(bound).not.toHaveAttribute('role');
    expect(screen.getByRole('button', { name: 'Static' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Default' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Reset' })).toHaveAttribute('type', 'reset');
    fixture.componentInstance.nativeDisabled.set(true);
    fixture.detectChanges();
    expect(bound).toBeDisabled();
    fixture.componentInstance.nativeDisabled.set(false);
    fixture.componentInstance.zDisabled.set(true);
    fixture.componentInstance.type.set('reset');
    fixture.detectChanges();
    expect(bound).toBeDisabled();
    expect(bound).toHaveAttribute('type', 'reset');
    fixture.componentInstance.zDisabled.set(false);
    fixture.detectChanges();
    expect(bound).toBeEnabled();
    fireEvent.click(bound);
    expect(fixture.componentInstance.actions).toBe(1);
  });

  it('preserves links and blocks disabled link click/Enter/Space before consumer handlers', async () => {
    const { fixture } = await render(NativeActions);
    const link = screen.getByRole('link', { name: 'Download' });
    expect(link).toHaveAttribute('href', '#file');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('download', 'file.pdf');
    expect(link).toHaveAttribute('tabindex', '2');
    expect(link).not.toHaveAttribute('type');
    expect(link).not.toHaveAttribute('role');
    fixture.componentInstance.zDisabled.set(true);
    fixture.detectChanges();
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(fireEvent.click(link)).toBe(false);
    expect(fireEvent.keyDown(link, { key: 'Enter' })).toBe(false);
    expect(fireEvent.keyDown(link, { key: ' ' })).toBe(false);
    expect(fixture.componentInstance.links).toBe(0);
    fixture.componentInstance.zDisabled.set(false);
    fixture.detectChanges();
    expect(link).not.toHaveAttribute('aria-disabled');
    expect(link).toHaveAttribute('tabindex', '2');
    fireEvent.click(link);
    expect(fixture.componentInstance.links).toBe(1);
  });

  it('keeps overlay and action activation separate and does not synthesize a root click', async () => {
    const { fixture, container } = await render(NativeActions);
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(fixture.componentInstance.actions).toBe(1);
    expect(fixture.componentInstance.previews).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: 'Preview' }));
    expect(fixture.componentInstance.previews).toBe(1);
    fireEvent.click(container.querySelector('z-attachment-title')!);
    expect(fixture.componentInstance.previews).toBe(1);
    expect(screen.getByRole('button', { name: 'Preview' })).toHaveClass('z-10');
    expect(screen.getByRole('button', { name: 'Remove' })).toHaveClass('z-20');
    expect(container.querySelector('z-attachment-actions')).toHaveClass('z-20');
  });

  it('preserves trigger native type, link attributes and button disabled', async () => {
    await render(
      '<button z-attachment-trigger type="submit" disabled aria-label="Submit"></button><a z-attachment-trigger href="#preview" target="_blank" download="preview.pdf" aria-label="Preview"></a>',
      { imports: [...ZardAttachmentImports] },
    );
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    expect(screen.getByRole('button')).toBeDisabled();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#preview');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('download', 'preview.pdf');
    expect(link).not.toHaveAttribute('type');
  });
});

describe('attachment group', () => {
  it('is named/focusable and scrolls by the current viewport only for host arrows', async () => {
    const { fixture } = await render(
      '<z-attachment-group aria-label="Files"><z-attachment><button z-attachment-action>Nested</button><input aria-label="Caption" /><a href="#file">Link</a><div contenteditable="true">Edit</div><z-attachment-group aria-label="Nested group"></z-attachment-group></z-attachment></z-attachment-group>',
      { imports: [...ZardAttachmentImports] },
    );
    const group = screen.getByRole('group', { name: 'Files' });
    const scrollBy = jest.fn();
    Object.defineProperties(group, {
      clientWidth: { value: 300, configurable: true },
      scrollWidth: { value: 900, configurable: true },
      scrollBy: { value: scrollBy },
    });
    expect(group).toHaveAttribute('tabindex', '0');
    expect(group).toHaveClass('overflow-x-auto', 'snap-x', 'snap-mandatory');
    expect(group.querySelector('z-attachment')).toHaveClass('snap-start');
    expect(fireEvent.keyDown(group, { key: 'ArrowRight' })).toBe(false);
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 300, behavior: 'auto' });
    expect(fireEvent.keyDown(group, { key: 'ArrowLeft' })).toBe(false);
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -300, behavior: 'auto' });
    Object.defineProperty(group, 'clientWidth', { value: 180, configurable: true });
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 180, behavior: 'auto' });
    scrollBy.mockClear();
    for (const target of Array.from(
      group.querySelectorAll('button, input, a, [contenteditable], z-attachment-group'),
    )) {
      expect(fireEvent.keyDown(target, { key: 'ArrowRight' })).toBe(true);
    }
    for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']) {
      expect(fireEvent.keyDown(group, { key: 'ArrowRight', [modifier]: true })).toBe(true);
    }
    expect(fireEvent.keyDown(group, { key: 'Home' })).toBe(true);
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
    event.preventDefault();
    group.dispatchEvent(event);
    expect(scrollBy).not.toHaveBeenCalled();
    const component = fixture.debugElement.query(By.directive(ZardAttachmentGroupComponent))
      .componentInstance as ZardAttachmentGroupComponent;
    component.onKeyDown(event);
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it('leaves empty, nonoverflow and zero-width groups untouched after removal', async () => {
    await render('<z-attachment-group aria-label="Files"><z-attachment>File</z-attachment></z-attachment-group>', {
      imports: [...ZardAttachmentImports],
    });
    const group = screen.getByRole('group');
    const scrollBy = jest.fn();
    Object.defineProperties(group, {
      clientWidth: { value: 0, configurable: true },
      scrollWidth: { value: 900, configurable: true },
      scrollBy: { value: scrollBy },
    });
    expect(fireEvent.keyDown(group, { key: 'ArrowRight' })).toBe(true);
    Object.defineProperties(group, {
      clientWidth: { value: 900, configurable: true },
      scrollWidth: { value: 900, configurable: true },
    });
    expect(fireEvent.keyDown(group, { key: 'ArrowLeft' })).toBe(true);
    Object.defineProperty(group, 'clientWidth', { value: 300, configurable: true });
    group.replaceChildren();
    expect(fireEvent.keyDown(group, { key: 'ArrowRight' })).toBe(true);
    expect(scrollBy).not.toHaveBeenCalled();
  });
});
