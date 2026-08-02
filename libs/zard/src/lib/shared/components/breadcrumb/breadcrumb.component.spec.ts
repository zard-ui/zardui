import { Component, type TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { fireEvent, render, screen, within } from '@testing-library/angular';

import {
  ZardBreadcrumbComponent,
  ZardBreadcrumbEllipsisComponent,
  ZardBreadcrumbItemComponent,
  ZardBreadcrumbLinkComponent,
  ZardBreadcrumbPageComponent,
  ZardBreadcrumbSeparatorComponent,
} from './breadcrumb.component';

const breadcrumbImports = [
  ZardBreadcrumbComponent,
  ZardBreadcrumbItemComponent,
  ZardBreadcrumbLinkComponent,
  ZardBreadcrumbPageComponent,
  ZardBreadcrumbSeparatorComponent,
  ZardBreadcrumbEllipsisComponent,
];

const renderBreadcrumb = (template: string) =>
  render(template, {
    imports: breadcrumbImports,
    providers: [provideRouter([])],
  });

const getSeparators = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[data-slot="breadcrumb-separator"]'));

@Component({
  selector: 'z-test-template-separator',
  imports: breadcrumbImports,
  template: `
    <z-breadcrumb [zSeparator]="separator">
      <z-breadcrumb-item [routerLink]="['/']">Home</z-breadcrumb-item>
      <z-breadcrumb-item [routerLink]="['/docs']">Docs</z-breadcrumb-item>
      <z-breadcrumb-item>Current</z-breadcrumb-item>
    </z-breadcrumb>

    <ng-template #customSeparator>
      <span data-testid="template-separator">::</span>
    </ng-template>
  `,
})
class TemplateSeparatorHost {
  readonly customSeparator = viewChild.required<TemplateRef<void>>('customSeparator');
  separator: string | TemplateRef<void> = '';
}

@Component({
  selector: 'z-test-variants',
  imports: [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent],
  template: `
    <z-breadcrumb [zAlign]="align" [zWrap]="wrap" [zSize]="size">
      <z-breadcrumb-item>Home</z-breadcrumb-item>
      <z-breadcrumb-item>Current</z-breadcrumb-item>
    </z-breadcrumb>
  `,
})
class VariantsHost {
  align: 'start' | 'center' | 'end' = 'start';
  wrap: 'wrap' | 'nowrap' = 'wrap';
  size: 'sm' | 'md' | 'lg' = 'md';
}

@Component({
  selector: 'z-test-ellipsis-color',
  imports: [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbEllipsisComponent],
  template: `
    <z-breadcrumb>
      <z-breadcrumb-item>Home</z-breadcrumb-item>
      <z-breadcrumb-item>
        <z-breadcrumb-ellipsis [zColor]="color" />
      </z-breadcrumb-item>
      <z-breadcrumb-item>Current</z-breadcrumb-item>
    </z-breadcrumb>
  `,
})
class EllipsisColorHost {
  color: 'muted' | 'strong' = 'muted';
}

describe('ZardBreadcrumbComponent', () => {
  it('renders navigation with the default breadcrumb label', async () => {
    await renderBreadcrumb(`
      <z-breadcrumb>
        <z-breadcrumb-item>Current</z-breadcrumb-item>
      </z-breadcrumb>
    `);

    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();
  });

  it('uses zLabel for the navigation accessible name', async () => {
    await renderBreadcrumb(`
      <z-breadcrumb zLabel="Page hierarchy">
        <z-breadcrumb-item>Current</z-breadcrumb-item>
      </z-breadcrumb>
    `);

    expect(screen.getByRole('navigation', { name: 'Page hierarchy' })).toBeVisible();
  });

  it('renders an ordered list with breadcrumb list items', async () => {
    await renderBreadcrumb(`
      <z-breadcrumb>
        <z-breadcrumb-item [routerLink]="['/']">Home</z-breadcrumb-item>
        <z-breadcrumb-item [routerLink]="['/docs']">Docs</z-breadcrumb-item>
        <z-breadcrumb-item>Current</z-breadcrumb-item>
      </z-breadcrumb>
    `);

    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');

    expect(list.tagName).toBe('OL');
    expect(items).toHaveLength(3);
    expect(items.every(item => item.parentElement === list)).toBe(true);
    expect(items.map(item => item.textContent?.trim())).toEqual(['Home', 'Docs', 'Current']);
  });

  it('renders composed links and pages through their dedicated components', async () => {
    await renderBreadcrumb(`
      <z-breadcrumb>
        <z-breadcrumb-item>
          <a z-breadcrumb-link href="/">Home</a>
        </z-breadcrumb-item>
        <z-breadcrumb-item>
          <span z-breadcrumb-page>Current</span>
        </z-breadcrumb-item>
      </z-breadcrumb>
    `);

    const link = screen.getByText('Home');
    const page = screen.getByText('Current');

    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('data-slot', 'breadcrumb-link');
    expect(page).toHaveAttribute('data-slot', 'breadcrumb-page');
    expect(page).toHaveAttribute('aria-current', 'page');
  });

  it('renders the final plain item as the current page', async () => {
    await renderBreadcrumb(`
      <z-breadcrumb>
        <z-breadcrumb-item [routerLink]="['/docs']">Docs</z-breadcrumb-item>
        <z-breadcrumb-item>Current</z-breadcrumb-item>
      </z-breadcrumb>
    `);

    const currentPage = screen.getByText('Current');

    expect(currentPage.tagName).toBe('SPAN');
    expect(currentPage).toHaveAttribute('data-slot', 'breadcrumb-page');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  it('keeps item-level routerLink compatibility for plain non-final items', async () => {
    await renderBreadcrumb(`
      <z-breadcrumb>
        <z-breadcrumb-item
          [routerLink]="['/docs/components']"
          [queryParams]="{ tab: 'api' }"
          fragment="props"
        >
          Components
        </z-breadcrumb-item>
        <z-breadcrumb-item>Breadcrumb</z-breadcrumb-item>
      </z-breadcrumb>
    `);

    const link = screen.getByRole('link', { name: 'Components' });

    expect(link).toHaveAttribute('data-slot', 'breadcrumb-link');
    expect(link.getAttribute('href')).toBe('/docs/components?tab=api#props');
  });

  it('makes custom element links keyboard focusable when they have a navigation target', async () => {
    await renderBreadcrumb(`
      <z-breadcrumb>
        <z-breadcrumb-item>
          <z-breadcrumb-link [routerLink]="['/docs']">Docs</z-breadcrumb-link>
        </z-breadcrumb-item>
        <z-breadcrumb-item>Current</z-breadcrumb-item>
      </z-breadcrumb>
    `);

    const link = screen.getByRole('link', { name: 'Docs' });
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    expect(link.tagName).toBe('Z-BREADCRUMB-LINK');
    expect(link).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(link, { key: 'Enter' });

    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('allows native buttons to reuse breadcrumb link styling for composed controls', async () => {
    await renderBreadcrumb(`
      <z-breadcrumb>
        <z-breadcrumb-item>
          <button z-breadcrumb-link type="button">Components</button>
        </z-breadcrumb-item>
        <z-breadcrumb-item>Current</z-breadcrumb-item>
      </z-breadcrumb>
    `);

    const button = screen.getByRole('button', { name: 'Components' });

    expect(button).toHaveAttribute('data-slot', 'breadcrumb-link');
    expect(button).toHaveClass('transition-colors');
    expect(button).not.toHaveAttribute('role');
    expect(button).not.toHaveAttribute('tabindex');
  });

  it('renders default presentation separators between items', async () => {
    const { container } = await renderBreadcrumb(`
      <z-breadcrumb>
        <z-breadcrumb-item [routerLink]="['/']">Home</z-breadcrumb-item>
        <z-breadcrumb-item [routerLink]="['/docs']">Docs</z-breadcrumb-item>
        <z-breadcrumb-item>Current</z-breadcrumb-item>
      </z-breadcrumb>
    `);

    const separators = getSeparators(container);

    expect(separators).toHaveLength(2);
    expect(separators[0]).toHaveAttribute('aria-hidden', 'true');
    expect(separators[0]).toHaveAttribute('role', 'presentation');
    expect(separators[0].querySelector('ng-icon')).toHaveAttribute('name', 'lucideChevronRight');
  });

  it('uses string separators from zSeparator', async () => {
    const { container } = await renderBreadcrumb(`
      <z-breadcrumb zSeparator="/">
        <z-breadcrumb-item [routerLink]="['/']">Home</z-breadcrumb-item>
        <z-breadcrumb-item [routerLink]="['/docs']">Docs</z-breadcrumb-item>
        <z-breadcrumb-item>Current</z-breadcrumb-item>
      </z-breadcrumb>
    `);

    const separators = getSeparators(container);

    expect(separators).toHaveLength(2);
    expect(separators.map(separator => separator.textContent?.trim())).toEqual(['/', '/']);
  });

  it('uses template separators from zSeparator', async () => {
    const { fixture } = await render(TemplateSeparatorHost, {
      providers: [provideRouter([])],
    });
    fixture.componentInstance.separator = fixture.componentInstance.customSeparator();
    fixture.detectChanges();

    const templateSeparators = screen.getAllByTestId('template-separator');

    expect(templateSeparators).toHaveLength(2);
    expect(templateSeparators.map(separator => separator.textContent?.trim())).toEqual(['::', '::']);
  });

  it('suppresses automatic separators when explicit separators are projected', async () => {
    const { container } = await renderBreadcrumb(`
      <z-breadcrumb>
        <z-breadcrumb-item>
          <a z-breadcrumb-link href="/">Home</a>
        </z-breadcrumb-item>
        <li z-breadcrumb-separator>/</li>
        <z-breadcrumb-item>
          <a z-breadcrumb-link href="/docs">Docs</a>
        </z-breadcrumb-item>
        <li z-breadcrumb-separator>/</li>
        <z-breadcrumb-item>
          <span z-breadcrumb-page>Current</span>
        </z-breadcrumb-item>
      </z-breadcrumb>
    `);

    const separators = getSeparators(container);

    expect(separators).toHaveLength(2);
    expect(separators.map(separator => separator.textContent?.trim())).toEqual(['/', '/']);
  });

  it('renders ellipsis with its icon and screen-reader label', async () => {
    const { container } = await renderBreadcrumb(`
      <z-breadcrumb>
        <z-breadcrumb-item [routerLink]="['/']">Home</z-breadcrumb-item>
        <z-breadcrumb-item>
          <z-breadcrumb-ellipsis />
        </z-breadcrumb-item>
        <z-breadcrumb-item>Current</z-breadcrumb-item>
      </z-breadcrumb>
    `);

    const ellipsis = container.querySelector<HTMLElement>('[data-slot="breadcrumb-ellipsis"]');
    const label = screen.getByText('More breadcrumbs');

    expect(ellipsis).toBeInTheDocument();
    expect(ellipsis?.querySelector('ng-icon')).toHaveAttribute('name', 'lucideEllipsis');
    expect(label).toHaveClass('sr-only');
  });

  it('merges custom classes with breadcrumb part classes', async () => {
    const { container } = await renderBreadcrumb(`
      <z-breadcrumb zLabel="Classes" class="nav-extra">
        <z-breadcrumb-item class="item-extra">
          <a z-breadcrumb-link href="/" class="link-extra">Home</a>
        </z-breadcrumb-item>
        <li z-breadcrumb-separator class="separator-extra">/</li>
        <z-breadcrumb-item>
          <z-breadcrumb-ellipsis class="ellipsis-extra" />
        </z-breadcrumb-item>
        <li z-breadcrumb-separator class="separator-extra">/</li>
        <z-breadcrumb-item>
          <span z-breadcrumb-page class="page-extra">Current</span>
        </z-breadcrumb-item>
      </z-breadcrumb>
    `);

    const nav = screen.getByRole('navigation', { name: 'Classes' });
    const link = screen.getByText('Home');
    const item = link.closest('[data-slot="breadcrumb-item"]');
    const separator = getSeparators(container)[0];
    const ellipsis = container.querySelector<HTMLElement>('[data-slot="breadcrumb-ellipsis"]');
    const page = screen.getByText('Current');

    expect(nav).toHaveClass('w-full', 'text-sm', 'nav-extra');
    expect(item).toHaveClass('inline-flex', 'items-center', 'item-extra');
    expect(link).toHaveClass('transition-colors', 'link-extra');
    expect(separator).toHaveClass('text-muted-foreground', 'separator-extra');
    expect(ellipsis).toHaveClass('flex', 'ellipsis-extra');
    expect(page).toHaveClass('font-normal', 'page-extra');
  });

  it('applies alignment and wrapping variants to the list', async () => {
    const { fixture } = await render(VariantsHost, {
      providers: [provideRouter([])],
    });
    fixture.componentInstance.align = 'center';
    fixture.componentInstance.wrap = 'nowrap';
    fixture.detectChanges();

    const list = screen.getByRole('list');

    expect(list).toHaveClass('justify-center', 'flex-nowrap');
  });

  it('applies size variants to the navigation', async () => {
    const { fixture } = await render(VariantsHost, {
      providers: [provideRouter([])],
    });
    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();

    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toHaveClass('text-base');
  });

  it('applies ellipsis color variants', async () => {
    const { fixture, container } = await render(EllipsisColorHost, {
      providers: [provideRouter([])],
    });
    fixture.componentInstance.color = 'strong';
    fixture.detectChanges();

    const ellipsis = container.querySelector<HTMLElement>('[data-slot="breadcrumb-ellipsis"]');

    expect(ellipsis).toHaveClass('text-foreground');
  });
});
