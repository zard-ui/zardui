import { Component } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardCardComponent } from './card.component';

describe('ZardCardComponent', () => {
  it('renders card with default styling', async () => {
    const { debugElement } = await render(ZardCardComponent);

    const card = debugElement.nativeElement;
    expect(card).toHaveClass('rounded-xl', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm');
    expect(card).toHaveClass('flex', 'flex-col', 'gap-6', 'py-6');
  });

  it('applies custom classes when provided', async () => {
    const { debugElement } = await render(ZardCardComponent, {
      inputs: { class: 'custom-class' },
    });

    const card = debugElement.nativeElement;
    expect(card).toHaveClass('custom-class');
  });

  it('renders title when zTitle input is provided', async () => {
    await render(ZardCardComponent, {
      inputs: { zTitle: 'Test Title' },
    });

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveClass('leading-none', 'font-semibold');
  });

  it('does not render header when title is not provided', async () => {
    const { container } = await render(ZardCardComponent);

    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toBeNull();
  });

  it('renders description when both title and description inputs are provided', async () => {
    await render(ZardCardComponent, {
      inputs: {
        zTitle: 'Test Title',
        zDescription: 'Test Description',
      },
    });

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('does not render description when only description is provided without title', async () => {
    await render(ZardCardComponent, {
      inputs: { zDescription: 'Test Description' },
    });

    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('renders body section with correct styling', async () => {
    const { container } = await render(ZardCardComponent);

    const body = container.querySelector('[data-slot="card-content"]');
    expect(body).toHaveClass('px-6');
  });

  it('renders ng-content in body section', async () => {
    @Component({
      selector: 'test-host',
      imports: [ZardCardComponent],
      template: '<z-card>Test Content</z-card>',
    })
    class TestHostComponent {}

    await render(TestHostComponent);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('supports template reference for title input', async () => {
    @Component({
      selector: 'test-host',
      imports: [ZardCardComponent],
      template: `
        <z-card [zTitle]="titleTemplate">
          <ng-template #titleTemplate>
            <span class="custom-title">Custom Title Template</span>
          </ng-template>
        </z-card>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);
    expect(screen.getByText('Custom Title Template')).toBeInTheDocument();
  });

  it('supports template reference for description input', async () => {
    @Component({
      selector: 'test-host',
      imports: [ZardCardComponent],
      template: `
        <z-card zTitle="Title" [zDescription]="descriptionTemplate">
          <ng-template #descriptionTemplate>
            <span class="custom-description">Custom Description Template</span>
          </ng-template>
        </z-card>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);
    expect(screen.getByText('Custom Description Template')).toBeInTheDocument();
  });

  it('renders action button when zAction input is provided', async () => {
    await render(ZardCardComponent, {
      inputs: {
        zTitle: 'Test Title',
        zAction: 'Edit',
      },
    });

    const actionButton = screen.getByRole('button', { name: 'Edit' });
    expect(actionButton).toBeInTheDocument();
  });

  it('emits zActionClick event when action button is clicked', async () => {
    const user = userEvent.setup();
    const mockClick = jest.fn();

    @Component({
      selector: 'test-host',
      imports: [ZardCardComponent],
      template: '<z-card zTitle="Test Title" zAction="Edit" (zActionClick)="onActionClick()" />',
    })
    class TestHostComponent {
      onActionClick = mockClick;
    }

    await render(TestHostComponent);

    const actionButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(actionButton);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when zAction is not provided', async () => {
    await render(ZardCardComponent, {
      inputs: { zTitle: 'Test Title' },
    });

    const actionButton = screen.queryByRole('button');
    expect(actionButton).not.toBeInTheDocument();
  });

  it('applies header border when zHeaderBorder is true', async () => {
    const { container } = await render(ZardCardComponent, {
      inputs: {
        zTitle: 'Test Title',
        zHeaderBorder: true,
      },
    });

    const header = container.querySelector('[data-slot="card-header"]');
    expect(header).toHaveClass('border-b');
  });

  it('applies footer border when zFooterBorder is true', async () => {
    const { container } = await render(ZardCardComponent, {
      inputs: { zFooterBorder: true },
    });

    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer).toHaveClass('border-t');
  });

  it('renders footer content when projected', async () => {
    @Component({
      selector: 'test-host',
      imports: [ZardCardComponent],
      template: `
        <z-card>
          Card Content
          <div card-footer>Footer Content</div>
        </z-card>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('renders footer with default styling', async () => {
    @Component({
      selector: 'test-host',
      imports: [ZardCardComponent],
      template: `
        <z-card>
          <div card-footer>Footer Content</div>
        </z-card>
      `,
    })
    class TestHostComponent {}

    await render(TestHostComponent);

    const footer = screen.getByText('Footer Content').closest('[data-slot="card-footer"]');
    expect(footer).toHaveClass('flex', 'flex-col', 'gap-2', 'items-center', 'px-6');
  });

  describe('accessibility', () => {
    it('has proper semantic role', async () => {
      const { debugElement } = await render(ZardCardComponent);

      const card = debugElement.nativeElement;
      expect(card).toHaveAttribute('role', 'region');
    });

    it('does not set aria-labelledby when no title is provided', async () => {
      const { debugElement } = await render(ZardCardComponent);

      const card = debugElement.nativeElement;
      expect(card).not.toHaveAttribute('aria-labelledby');
    });

    it('sets aria-labelledby when title is provided', async () => {
      const { debugElement } = await render(ZardCardComponent, {
        inputs: { zTitle: 'Test Title' },
      });

      const card = debugElement.nativeElement;
      expect(card).toHaveAttribute('aria-labelledby');
      const labelledById = card.getAttribute('aria-labelledby');
      expect(labelledById).toBeTruthy();

      const titleElement = card.querySelector('[data-slot="card-title"]');
      expect(titleElement).toHaveAttribute('id', labelledById);
    });

    it('does not set aria-describedby when no description is provided', async () => {
      const { debugElement } = await render(ZardCardComponent, {
        inputs: { zTitle: 'Test Title' },
      });

      const card = debugElement.nativeElement;
      expect(card).not.toHaveAttribute('aria-describedby');
    });

    it('sets aria-describedby when description is provided', async () => {
      const { debugElement } = await render(ZardCardComponent, {
        inputs: {
          zTitle: 'Test Title',
          zDescription: 'Test Description',
        },
      });

      const card = debugElement.nativeElement;
      expect(card).toHaveAttribute('aria-describedby');
      const describedById = card.getAttribute('aria-describedby');
      expect(describedById).toBeTruthy();

      const descriptionElement = card.querySelector('[data-slot="card-description"]');
      expect(descriptionElement).toHaveAttribute('id', describedById);
    });

    it('action button is keyboard accessible', async () => {
      await render(ZardCardComponent, {
        inputs: {
          zTitle: 'Test Title',
          zAction: 'Edit',
        },
      });

      const actionButton = screen.getByRole('button', { name: 'Edit' });
      expect(actionButton).toBeInTheDocument();
      expect(actionButton.tagName).toBe('BUTTON');
    });
  });
});
