import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/angular';

import { ZardBadgeComponent } from './badge.component';

describe('ZardBadgeComponent', () => {
  describe('basic rendering', () => {
    it('creates successfully as z-badge element', async () => {
      await render('<z-badge>Badge</z-badge>', {
        imports: [ZardBadgeComponent],
      });

      expect(screen.getByText('Badge')).toBeVisible();
    });

    it('creates successfully as anchor element', async () => {
      await render('<a z-badge href="#">Badge</a>', {
        imports: [ZardBadgeComponent],
      });

      const link = screen.getByRole('link');
      expect(link).toBeVisible();
      expect(link.tagName).toBe('A');
    });
  });

  describe('base classes', () => {
    it('applies shared base classes to the host element', async () => {
      await render('<z-badge>Badge</z-badge>', {
        imports: [ZardBadgeComponent],
      });

      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveClass('text-xs');
      expect(badge).toHaveClass('font-medium');
      expect(badge).toHaveClass('whitespace-nowrap');
    });

    it('projects content via ng-content', async () => {
      await render('<z-badge>Projected Content</z-badge>', {
        imports: [ZardBadgeComponent],
      });

      expect(screen.getByText('Projected Content')).toBeInTheDocument();
    });
  });

  describe('type variants', () => {
    it('applies default type classes', async () => {
      await render('<z-badge>Badge</z-badge>', {
        imports: [ZardBadgeComponent],
      });

      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('bg-primary');
      expect(badge).toHaveClass('text-primary-foreground');
    });

    it('applies secondary type classes', async () => {
      await render('<z-badge zType="secondary">Badge</z-badge>', {
        imports: [ZardBadgeComponent],
      });

      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('bg-secondary');
      expect(badge).toHaveClass('text-secondary-foreground');
    });

    it('applies destructive type classes', async () => {
      await render('<z-badge zType="destructive">Badge</z-badge>', {
        imports: [ZardBadgeComponent],
      });

      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('bg-destructive/10');
      expect(badge).toHaveClass('text-destructive');
    });

    it('applies outline type classes', async () => {
      await render('<z-badge zType="outline">Badge</z-badge>', {
        imports: [ZardBadgeComponent],
      });

      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('border-border');
      expect(badge).toHaveClass('text-foreground');
    });

    it('applies ghost type classes', async () => {
      await render('<z-badge zType="ghost">Badge</z-badge>', {
        imports: [ZardBadgeComponent],
      });

      const badge = screen.getByText('Badge');
      expect(badge.className).toContain('[a&]:hover:bg-accent');
      expect(badge.className).toContain('[a&]:hover:text-accent-foreground');
    });

    it('applies link type classes', async () => {
      await render('<z-badge zType="link">Badge</z-badge>', {
        imports: [ZardBadgeComponent],
      });

      const badge = screen.getByText('Badge');
      expect(badge.className).toContain('text-primary');
      expect(badge.className).toContain('underline-offset-4');
      expect(badge.className).toContain('[a&]:hover:underline');
    });
  });

  describe('custom class input', () => {
    it('merges custom class with variant classes', async () => {
      await render('<z-badge class="mt-4">Badge</z-badge>', {
        imports: [ZardBadgeComponent],
      });

      const badge = screen.getByText('Badge');
      expect(badge).toHaveClass('mt-4');
      expect(badge).toHaveClass('bg-primary');
    });
  });
});
