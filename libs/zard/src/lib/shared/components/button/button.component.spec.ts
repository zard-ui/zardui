import { render, screen, waitFor } from '@testing-library/angular';
import '@testing-library/jest-dom';

import { ZardButtonComponent } from './button.component';
import { ZardIconComponent } from '../icon/icon.component';

describe('ZardButtonComponent', () => {
  describe('basic rendering', () => {
    it('creates successfully', async () => {
      await render('<button z-button>Test</button>', {
        imports: [ZardButtonComponent],
      });

      expect(screen.getByRole('button')).toBeVisible();
    });
  });

  describe('disabled state', () => {
    it('applies disabled classes when zDisabled is true', async () => {
      await render('<button z-button [zDisabled]="true">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('pointer-events-none');
      expect(button).toHaveClass('opacity-50');
    });

    it('does not apply disabled classes when zDisabled is false', async () => {
      await render('<button z-button [zDisabled]="false">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('pointer-events-none');
      expect(button).not.toHaveClass('opacity-50');
    });
  });

  describe('loading state', () => {
    it('renders loading icon when zLoading is true', async () => {
      const { container } = await render('<button z-button [zLoading]="true">Button</button>', {
        imports: [ZardButtonComponent, ZardIconComponent],
      });

      const loadingIcon = container.querySelector('z-icon');
      expect(loadingIcon).toBeInTheDocument();
      expect(loadingIcon).toHaveClass('animate-spin');
    });

    it('does not render loading icon when zLoading is false', async () => {
      const { container } = await render('<button z-button [zLoading]="false">Button</button>', {
        imports: [ZardButtonComponent, ZardIconComponent],
      });

      const loadingIcon = container.querySelector('z-icon');
      expect(loadingIcon).not.toBeInTheDocument();
    });

    it('applies loading classes when zLoading is true', async () => {
      await render('<button z-button [zLoading]="true">Button</button>', {
        imports: [ZardButtonComponent, ZardIconComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('opacity-50');
      expect(button).toHaveClass('pointer-events-none');
    });
  });

  describe('full width', () => {
    it('applies w-full class when zFull is true', async () => {
      await render('<button z-button [zFull]="true">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('does not apply w-full class when zFull is false', async () => {
      await render('<button z-button [zFull]="false">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('size variants', () => {
    it('applies default size classes', async () => {
      await render('<button z-button>Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');
      expect(button).toHaveClass('gap-1.5');
      expect(button).toHaveClass('px-2.5');
    });

    it('applies xs size classes', async () => {
      await render('<button z-button zSize="xs">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-6');
      expect(button).toHaveClass('gap-1');
      expect(button).toHaveClass('px-2');
    });

    it('applies sm size classes', async () => {
      await render('<button z-button zSize="sm">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-7');
      expect(button).toHaveClass('gap-1');
      expect(button).toHaveClass('px-2.5');
    });

    it('applies lg size classes', async () => {
      await render('<button z-button zSize="lg">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9');
      expect(button).toHaveClass('gap-1.5');
      expect(button).toHaveClass('px-2.5');
    });

    it('applies icon size classes', async () => {
      await render('<button z-button zSize="icon">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('size-8');
    });

    it('applies icon-xs size classes', async () => {
      await render('<button z-button zSize="icon-xs">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('size-6');
    });

    it('applies icon-sm size classes', async () => {
      await render('<button z-button zSize="icon-sm">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('size-7');
    });

    it('applies icon-lg size classes', async () => {
      await render('<button z-button zSize="icon-lg">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('size-9');
    });
  });

  describe('type variants', () => {
    it('applies default type classes', async () => {
      await render('<button z-button>Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
      expect(button).toHaveClass('text-primary-foreground');
    });

    it('applies destructive type classes', async () => {
      await render('<button z-button zType="destructive">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive/10');
      expect(button).toHaveClass('text-destructive');
    });

    it('applies outline type classes', async () => {
      await render('<button z-button zType="outline">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-border');
      expect(button).toHaveClass('bg-background');
    });

    it('applies secondary type classes', async () => {
      await render('<button z-button zType="secondary">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary');
      expect(button).toHaveClass('text-secondary-foreground');
    });

    it('applies ghost type classes', async () => {
      await render('<button z-button zType="ghost">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:bg-muted');
      expect(button.className).toContain('hover:text-foreground');
    });

    it('applies link type classes', async () => {
      await render('<button z-button zType="link">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button.className).toContain('text-primary');
      expect(button.className).toContain('underline-offset-4');
      expect(button.className).toContain('hover:underline');
    });
  });

  describe('shape variants', () => {
    it('applies default shape classes', async () => {
      await render('<button z-button>Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-md');
    });

    it('applies circle shape classes', async () => {
      await render('<button z-button zShape="circle">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-full');
    });

    it('applies square shape classes', async () => {
      await render('<button z-button zShape="square">Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-none');
    });
  });

  describe('iconOnly detection', () => {
    it('sets data-icon-only attribute when button has only an icon', async () => {
      await render('<button z-button><z-icon zType="sun"></z-icon></button>', {
        imports: [ZardButtonComponent, ZardIconComponent],
      });

      const button = screen.getByRole('button');
      await waitFor(() => {
        expect(button).toHaveAttribute('data-icon-only');
      });
    });

    it('does not set data-icon-only when button has text and icon', async () => {
      await render(
        `<button z-button>
          Button
          <z-icon zType="sun"></z-icon>
        </button>`,
        {
          imports: [ZardButtonComponent, ZardIconComponent],
        },
      );

      const button = screen.getByRole('button');
      await waitFor(() => {
        expect(button).not.toHaveAttribute('data-icon-only');
      });
    });

    it('does not set data-icon-only when button has only text', async () => {
      await render('<button z-button>Button</button>', {
        imports: [ZardButtonComponent],
      });

      const button = screen.getByRole('button');
      await waitFor(() => {
        expect(button).not.toHaveAttribute('data-icon-only');
      });
    });

    it('does not set data-icon-only when button has icon before text', async () => {
      await render(
        `<button z-button>
          <z-icon zType="sun"></z-icon>
          Button
        </button>`,
        {
          imports: [ZardButtonComponent, ZardIconComponent],
        },
      );

      const button = screen.getByRole('button');
      await waitFor(() => {
        expect(button).not.toHaveAttribute('data-icon-only');
      });
    });
  });
});
