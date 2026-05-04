import { Component } from '@angular/core';

import { render, screen } from '@testing-library/angular';

import { ZardItemImports } from './item.imports';

@Component({
  selector: 'z-test-item',
  imports: [...ZardItemImports],
  template: `
    <z-item-group>
      <z-item zVariant="outline">
        <z-item-media zVariant="icon">
          <span data-testid="media-content">M</span>
        </z-item-media>
        <z-item-content>
          <z-item-title>Title</z-item-title>
          <z-item-description>Description</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button>Action</button>
        </z-item-actions>
      </z-item>
      <z-item-separator />
      <z-item zSize="sm">
        <z-item-content>
          <z-item-title>Second</z-item-title>
        </z-item-content>
      </z-item>
    </z-item-group>
  `,
})
class TestItemHost {}

describe('ZardItemComponent', () => {
  it('renders the full slot composition with data-slot attributes', async () => {
    await render(TestItemHost);

    expect(document.querySelector('[data-slot="item-group"]')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="item"]').length).toBe(2);
    expect(document.querySelector('[data-slot="item-media"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="item-content"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="item-title"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="item-description"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="item-actions"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="item-separator"]')).toBeInTheDocument();
    expect(screen.getByTestId('media-content')).toBeInTheDocument();
  });

  it('reflects variant and size on data attributes', async () => {
    await render(TestItemHost);

    const items = document.querySelectorAll('[data-slot="item"]');
    expect(items[0].getAttribute('data-variant')).toBe('outline');
    expect(items[0].getAttribute('data-size')).toBe('default');
    expect(items[1].getAttribute('data-size')).toBe('sm');
  });
});
