import { Component, input, inputBinding, signal, ChangeDetectionStrategy } from '@angular/core';

import { render, screen } from '@testing-library/angular';

import {
  ZardButtonGroupComponent,
  ZardButtonGroupSeparatorComponent,
  ZardButtonGroupTextDirective,
} from './button-group.component';
import { buttonGroupSeparatorVariants, buttonGroupTextVariants, buttonGroupVariants } from './button-group.variants';

describe('ButtonGroup', () => {
  describe('ButtonGroupComponent', () => {
    it('should have a role of "group"', async () => {
      const r = await render(ZardButtonGroupComponent);
      expect(screen.getByRole('group')).toBeTruthy();
      expect(r.fixture.nativeElement.getAttribute('role')).toBe('group');
    });

    it('should apply the appropriate aria-orientation attribute', async () => {
      const orientation = signal<'horizontal' | 'vertical'>('vertical');

      const r = await render(ZardButtonGroupComponent, {
        bindings: [inputBinding('zOrientation', orientation)],
      });

      expect(r.fixture.nativeElement.getAttribute('aria-orientation')).toBe('vertical');
      orientation.set('horizontal');
      r.fixture.detectChanges();
      expect(r.fixture.nativeElement.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should apply custom classes', async () => {
      const r = await render(ZardButtonGroupComponent, {
        bindings: [inputBinding('class', () => 'custom-class')],
      });
      expect(r.fixture.nativeElement.classList).toContain('custom-class');
    });

    it('should have the appropriate classes for both orientations', async () => {
      const orientation = signal<'horizontal' | 'vertical'>('vertical');

      const r = await render(ZardButtonGroupComponent, {
        bindings: [inputBinding('zOrientation', orientation)],
      });

      let expected = buttonGroupVariants({ zOrientation: 'vertical' }).split(' ');
      let actual = Array.from(r.fixture.nativeElement.classList);

      for (const cls of expected) {
        expect(actual).toContain(cls);
      }

      orientation.set('horizontal');

      r.fixture.detectChanges();

      expected = buttonGroupVariants({ zOrientation: 'horizontal' }).split(' ');
      actual = Array.from(r.fixture.nativeElement.classList);

      for (const cls of expected) {
        expect(actual).toContain(cls);
      }
    });
  });

  describe('ButtonGroupSeparatorComponent', () => {
    it('should render a separator and have a class of contents', async () => {
      const r = await render(ZardButtonGroupSeparatorComponent);
      expect(r.fixture.nativeElement.querySelector('z-separator')).toBeTruthy();
      expect(r.fixture.nativeElement.classList).toContain('contents');
    });

    it('should apply custom classes to the child separator', async () => {
      const r = await render(ZardButtonGroupSeparatorComponent, {
        bindings: [inputBinding('class', () => 'custom-class')],
      });
      expect(Array.from(r.fixture.nativeElement.querySelector('z-separator').classList)).toContain('custom-class');
    });

    it('should set the correct orientation on the child separator', async () => {
      const orientation = signal<'horizontal' | 'vertical'>('vertical');
      const r = await render(ZardButtonGroupSeparatorComponent, {
        bindings: [inputBinding('zOrientation', orientation)],
      });

      let separator = r.fixture.nativeElement.querySelector('z-separator');

      expect(separator.getAttribute('data-orientation')).toBe('vertical');

      orientation.set('horizontal');
      r.fixture.detectChanges();
      separator = r.fixture.nativeElement.querySelector('z-separator');
      expect(separator.getAttribute('data-orientation')).toBe('horizontal');
    });

    it('should inherit orientation from the parent component if set', async () => {
      @Component({
        imports: [ZardButtonGroupComponent, ZardButtonGroupSeparatorComponent],
        template: `
          <z-button-group [zOrientation]="orientation()"><z-button-group-separator /></z-button-group>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
      })
      class TestComponent {
        readonly orientation = input<'horizontal' | 'vertical'>('vertical');
      }
      const orientation = signal<'horizontal' | 'vertical'>('vertical');
      const r = await render(TestComponent, {
        bindings: [inputBinding('orientation', orientation)],
      });

      let separator = r.fixture.nativeElement.querySelector('z-separator');
      // separator is inverse of parent presentationaly
      expect(separator.getAttribute('data-orientation')).toBe('horizontal');

      orientation.set('horizontal');
      r.fixture.detectChanges();

      separator = r.fixture.nativeElement.querySelector('z-separator');
      expect(separator.getAttribute('data-orientation')).toBe('vertical');
    });

    it('should apply the appropriate classes for both orientations', async () => {
      const orientation = signal<'horizontal' | 'vertical'>('vertical');
      const r = await render(ZardButtonGroupSeparatorComponent, {
        bindings: [inputBinding('zOrientation', orientation)],
      });

      let expected = buttonGroupSeparatorVariants({ zOrientation: 'vertical' }).split(' ');
      let actual = Array.from(r.fixture.nativeElement.querySelector('z-separator').classList);

      for (const cls of expected) {
        expect(actual).toContain(cls);
      }

      orientation.set('horizontal');
      r.fixture.detectChanges();

      expected = buttonGroupSeparatorVariants({ zOrientation: 'horizontal' }).split(' ');
      actual = Array.from(r.fixture.nativeElement.querySelector('z-separator').classList);
      for (const cls of expected) {
        expect(actual).toContain(cls);
      }
    });

    it('should have an aria-hidden attribute set to true on the separator', async () => {
      const r = await render(ZardButtonGroupSeparatorComponent);
      expect(r.fixture.nativeElement.querySelector('z-separator').getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('ButtonGroupTextDirective', () => {
    it('should apply custom classes and allow overrides', async () => {
      @Component({
        imports: [ZardButtonGroupTextDirective],
        template: `
          <label for="test-input" z-button-group-text [class]="customClass()">Text</label>
          <input id="test-input" />
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
      })
      class TestComponent {
        readonly customClass = input<string>('');
      }

      const customCls = signal('');
      const r = await render(TestComponent, {
        bindings: [inputBinding('customClass', customCls)],
      });

      let labelEl = r.fixture.nativeElement.querySelector('label');
      const expected = buttonGroupTextVariants().split(' ');
      let actual = Array.from(labelEl.classList);
      for (const cls of expected) {
        expect(actual).toContain(cls);
      }

      customCls.set('custom-class another-class');
      r.fixture.detectChanges();
      labelEl = r.fixture.nativeElement.querySelector('label');
      actual = Array.from(labelEl.classList);
      expect(actual).toContain('custom-class');
      expect(actual).toContain('another-class');
    });
  });
});
