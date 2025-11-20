import { Component } from '@angular/core';
import { TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';

import { ZardButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  it('should create', () => {
    @Component({
      imports: [ZardButtonComponent],
      standalone: true,
      template: `<button z-button>Test</button>`,
    })
    class TestComponent {}

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const buttonEl = fixture.nativeElement.querySelector('button');
    expect(buttonEl).toBeTruthy();
  });

  describe('iconOnly detection', () => {
    it('should set data-icon-only attribute when button has only an icon', async () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button><i z-icon></i></button>`,
      })
      class TestComponent {}

      TestBed.configureTestingModule({
        imports: [TestComponent],
        providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
      });

      const fixture = TestBed.createComponent(TestComponent);
      await fixture.whenStable();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.hasAttribute('data-icon-only')).toBe(true);
    });

    it('should not set data-icon-only when button has text and icon', async () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button>Button <i z-icon></i></button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.hasAttribute('data-icon-only')).toBe(false);
    });

    it('should not set data-icon-only when button has only text', async () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button>Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.hasAttribute('data-icon-only')).toBe(false);
    });

    it('should not set data-icon-only when button has icon before text', async () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button><i z-icon></i> Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.hasAttribute('data-icon-only')).toBe(false);
    });
  });

  describe('size variants', () => {
    it('should apply default size classes', () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button>Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.classList.contains('h-9')).toBe(true);
      expect(buttonEl.classList.contains('px-4')).toBe(true);
      expect(buttonEl.classList.contains('py-2')).toBe(true);
    });

    it('should apply sm size classes', () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button zSize="sm">Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.classList.contains('h-8')).toBe(true);
      expect(buttonEl.classList.contains('px-3')).toBe(true);
    });

    it('should apply lg size classes', () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button zSize="lg">Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.classList.contains('h-10')).toBe(true);
      expect(buttonEl.classList.contains('px-6')).toBe(true);
    });
  });

  describe('type variants', () => {
    it('should apply default type classes', () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button>Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.classList.contains('bg-primary')).toBe(true);
      expect(buttonEl.classList.contains('text-primary-foreground')).toBe(true);
    });

    it('should apply destructive type classes', () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button zType="destructive">Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.classList.contains('bg-destructive')).toBe(true);
      expect(buttonEl.classList.contains('text-white')).toBe(true);
    });

    it('should apply outline type classes', () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button zType="outline">Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.classList.contains('border')).toBe(true);
      expect(buttonEl.classList.contains('bg-background')).toBe(true);
    });
  });

  describe('loading state', () => {
    it('should render loading icon when zLoading is true', () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button [zLoading]="true">Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const loadingIcon = fixture.nativeElement.querySelector('[z-icon]');
      expect(loadingIcon).toBeTruthy();
      expect(loadingIcon.classList.contains('animate-spin')).toBe(true);
    });

    it('should not render loading icon when zLoading is false', () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button [zLoading]="false">Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const loadingIcon = fixture.nativeElement.querySelector('[z-icon]');
      expect(loadingIcon).toBeFalsy();
    });
  });

  describe('full width', () => {
    it('should apply w-full class when zFull is true', () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button [zFull]="true">Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.classList.contains('w-full')).toBe(true);
    });

    it('should not apply w-full class when zFull is false', () => {
      @Component({
        imports: [ZardButtonComponent],
        standalone: true,
        template: `<button z-button [zFull]="false">Button</button>`,
      })
      class TestComponent {}

      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      const buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.classList.contains('w-full')).toBe(false);
    });
  });
});
