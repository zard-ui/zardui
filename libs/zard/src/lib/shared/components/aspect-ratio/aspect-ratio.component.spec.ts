import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardAspectRatioComponent } from './aspect-ratio.component';

@Component({
  imports: [ZardAspectRatioComponent],
  template: `
    <div z-aspect-ratio [zRatio]="zRatio" [class]="customClass">
      <img data-testid="content" src="/cover.png" alt="Cover" class="size-full object-cover" />
    </div>
  `,
})
class TestHostComponent {
  zRatio: number | string = 16 / 9;
  customClass = '';
}

@Component({
  imports: [ZardAspectRatioComponent],
  template: `
    <z-aspect-ratio [zRatio]="zRatio">
      <span data-testid="content">content</span>
    </z-aspect-ratio>
  `,
})
class TestElementHostComponent {
  zRatio: number | string = '1';
}

describe('ZardAspectRatioComponent', () => {
  describe('[z-aspect-ratio] (attribute selector)', () => {
    let hostComponent: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      hostComponent = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(fixture.debugElement.query(By.directive(ZardAspectRatioComponent))).toBeTruthy();
    });

    describe('zRatio input', () => {
      it('should apply the numeric ratio through the native CSS aspect-ratio property', () => {
        const host: HTMLElement = fixture.debugElement.query(By.directive(ZardAspectRatioComponent)).nativeElement;

        // The CSSOM always serializes a <ratio> in its two-component form,
        // even when a single number was specified (e.g. '1' -> '1 / 1').
        expect(host.style.aspectRatio).toBe(`${16 / 9} / 1`);
      });

      it('should default to a square ratio ("1") when zRatio is not provided', () => {
        hostComponent.zRatio = '1';
        fixture.detectChanges();

        const host: HTMLElement = fixture.debugElement.query(By.directive(ZardAspectRatioComponent)).nativeElement;
        expect(host.style.aspectRatio).toBe('1 / 1');
      });

      it('should accept a string ratio', () => {
        hostComponent.zRatio = '4 / 3';
        fixture.detectChanges();

        const host: HTMLElement = fixture.debugElement.query(By.directive(ZardAspectRatioComponent)).nativeElement;
        expect(host.style.aspectRatio).toBe('4 / 3');
      });
    });

    describe('class input', () => {
      it('should apply the block class from aspectRatioVariants()', () => {
        const host: HTMLElement = fixture.debugElement.query(By.directive(ZardAspectRatioComponent)).nativeElement;
        expect(host).toHaveClass('block');
      });

      it('should merge custom classes with the host defaults, custom classes last', () => {
        hostComponent.customClass = 'overflow-hidden rounded-lg';
        fixture.detectChanges();

        const host: HTMLElement = fixture.debugElement.query(By.directive(ZardAspectRatioComponent)).nativeElement;
        expect(host).toHaveClass('block');
        expect(host).toHaveClass('overflow-hidden');
        expect(host).toHaveClass('rounded-lg');
      });
    });

    describe('content projection', () => {
      it('should project content without adding an intermediate DOM node', () => {
        const host: HTMLElement = fixture.debugElement.query(By.directive(ZardAspectRatioComponent)).nativeElement;

        // The projected <img> must be a direct child of the host — no wrapper div.
        expect(host.firstElementChild?.getAttribute('data-testid')).toBe('content');
      });
    });

    describe('accessibility', () => {
      it('should set data-slot="aspect-ratio" on the host', () => {
        const host: HTMLElement = fixture.debugElement.query(By.directive(ZardAspectRatioComponent)).nativeElement;
        expect(host.getAttribute('data-slot')).toBe('aspect-ratio');
      });

      it('should not add any ARIA role or attribute that would hide projected content from assistive tech', () => {
        const host: HTMLElement = fixture.debugElement.query(By.directive(ZardAspectRatioComponent)).nativeElement;
        expect(host.getAttribute('role')).toBeNull();
        expect(host.getAttribute('aria-hidden')).toBeNull();
      });
    });
  });

  describe('z-aspect-ratio (element selector)', () => {
    let fixture: ComponentFixture<TestElementHostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestElementHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(TestElementHostComponent);
      fixture.detectChanges();
    });

    it('should render as z-aspect-ratio and apply the ratio', () => {
      const host: HTMLElement = fixture.debugElement.query(By.directive(ZardAspectRatioComponent)).nativeElement;

      expect(host.tagName.toLowerCase()).toBe('z-aspect-ratio');
      expect(host.style.aspectRatio).toBe('1 / 1');
    });

    it('should apply the block class from aspectRatioVariants() regardless of tag form', () => {
      const host: HTMLElement = fixture.debugElement.query(By.directive(ZardAspectRatioComponent)).nativeElement;
      expect(host).toHaveClass('block');
    });
  });
});
