import { Component, input, inputBinding, signal } from '@angular/core';

import { render, screen } from '@testing-library/angular';

import {
  ZardButtonGroupComponent,
  ZardButtonGroupDividerComponent,
  ZardButtonGroupTextDirective,
} from './button-group.component';
import { buttonGroupDividerVariants, buttonGroupTextVariants, buttonGroupVariants } from './button-group.variants';

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

  describe('ButtonGroupDividerComponent', () => {
    it('should render a divider and have a class of contents', async () => {
      const r = await render(ZardButtonGroupDividerComponent);
      expect(r.fixture.nativeElement.querySelector('z-divider')).toBeTruthy();
      expect(r.fixture.nativeElement.classList).toContain('contents');
    });

    it('should apply custom classes to the child divider', async () => {
      const r = await render(ZardButtonGroupDividerComponent, {
        bindings: [inputBinding('class', () => 'custom-class')],
      });
      expect(Array.from(r.fixture.nativeElement.querySelector('z-divider').classList)).toContain('custom-class');
    });

    it('should set the correct orientation on the child divider', async () => {
      const orientation = signal<'horizontal' | 'vertical'>('vertical');
      const r = await render(ZardButtonGroupDividerComponent, {
        bindings: [inputBinding('zOrientation', orientation)],
      });

      let divider = r.fixture.nativeElement.querySelector('z-divider');

      expect(divider.getAttribute('aria-orientation')).toBe('vertical');

      orientation.set('horizontal');
      r.fixture.detectChanges();
      divider = r.fixture.nativeElement.querySelector('z-divider');
      expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should inherit orientation from the parent component if set', async () => {
      @Component({
        imports: [ZardButtonGroupComponent, ZardButtonGroupDividerComponent],
        template: `
          <z-button-group [zOrientation]="orientation()"><z-button-group-divider /></z-button-group>
        `,
      })
      class TestComponent {
        readonly orientation = input<'horizontal' | 'vertical'>('vertical');
      }
      const orientation = signal<'horizontal' | 'vertical'>('vertical');
      const r = await render(TestComponent, {
        bindings: [inputBinding('orientation', orientation)],
      });

      let divider = r.fixture.nativeElement.querySelector('z-divider');
      // divider is inverse of parent presentationaly
      expect(divider.getAttribute('aria-orientation')).toBe('horizontal');

      orientation.set('horizontal');
      r.fixture.detectChanges();

      divider = r.fixture.nativeElement.querySelector('z-divider');
      expect(divider.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should apply the appropriate classes for both orientations', async () => {
      const orientation = signal<'horizontal' | 'vertical'>('vertical');
      const r = await render(ZardButtonGroupDividerComponent, {
        bindings: [inputBinding('zOrientation', orientation)],
      });

      let expected = buttonGroupDividerVariants({ zOrientation: 'vertical' }).split(' ');
      let actual = Array.from(r.fixture.nativeElement.querySelector('z-divider').classList);

      for (const cls of expected) {
        expect(actual).toContain(cls);
      }

      orientation.set('horizontal');
      r.fixture.detectChanges();

      expected = buttonGroupDividerVariants({ zOrientation: 'horizontal' }).split(' ');
      actual = Array.from(r.fixture.nativeElement.querySelector('z-divider').classList);
      for (const cls of expected) {
        expect(actual).toContain(cls);
      }
    });

    it('should have an aria-hidden attribute set to true on the divider', async () => {
      const r = await render(ZardButtonGroupDividerComponent);
      expect(r.fixture.nativeElement.querySelector('z-divider').getAttribute('aria-hidden')).toBe('true');
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
