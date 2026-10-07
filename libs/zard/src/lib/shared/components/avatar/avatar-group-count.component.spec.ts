import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { type ZardAvatarSizeVariants } from '@/shared/components/avatar/avatar.variants';

import { ZardAvatarGroupCountComponent } from './avatar-group-count.component';

@Component({
  imports: [ZardAvatarGroupCountComponent],
  template: `
    <z-avatar-group-count [zCount]="zCount" [zSize]="zSize" [class]="customClass" />
  `,
})
class TestHostComponent {
  zCount = 3;
  zSize: ZardAvatarSizeVariants = 'default';
  customClass = '';
}

describe('ZardAvatarGroupCountComponent', () => {
  let hostComponent: TestHostComponent;
  let countComponent: ZardAvatarGroupCountComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    const countDebugElement = fixture.debugElement.query(By.directive(ZardAvatarGroupCountComponent));
    countComponent = countDebugElement.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(countComponent).toBeTruthy();
  });

  it('renders the count prefixed with a plus sign', () => {
    const element = fixture.debugElement.query(By.directive(ZardAvatarGroupCountComponent)).nativeElement;
    expect(element.textContent.trim()).toBe('+3');
  });

  it('updates the rendered count when zCount changes', () => {
    hostComponent.zCount = 12;
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.directive(ZardAvatarGroupCountComponent)).nativeElement;
    expect(element.textContent.trim()).toBe('+12');
  });

  it('marks itself with data-slot="avatar" so the group ring/spacing rules apply', () => {
    const element = fixture.debugElement.query(By.directive(ZardAvatarGroupCountComponent)).nativeElement;
    expect(element.getAttribute('data-slot')).toBe('avatar');
  });

  describe('Size variants', () => {
    it('defaults to the default size', () => {
      expect(countComponent.zSize()).toBe('default');

      const element = fixture.debugElement.query(By.directive(ZardAvatarGroupCountComponent)).nativeElement;
      expect(element).toHaveClass('size-8');
      expect(element.getAttribute('data-size')).toBe('default');
    });

    it('applies small size classes', () => {
      hostComponent.zSize = 'sm';
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.directive(ZardAvatarGroupCountComponent)).nativeElement;
      expect(element).toHaveClass('size-6');
      expect(element.getAttribute('data-size')).toBe('sm');
    });

    it('applies large size classes', () => {
      hostComponent.zSize = 'lg';
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.directive(ZardAvatarGroupCountComponent)).nativeElement;
      expect(element).toHaveClass('size-10');
      expect(element.getAttribute('data-size')).toBe('lg');
    });
  });

  describe('Custom classes', () => {
    it('appends custom classes', () => {
      const customClass = 'test-custom-class';
      hostComponent.customClass = customClass;
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.directive(ZardAvatarGroupCountComponent)).nativeElement;
      expect(element).toHaveClass(customClass);
    });
  });

  describe('Export as', () => {
    it('is exported as zAvatarGroupCount', () => {
      const countDebugElement = fixture.debugElement.query(By.directive(ZardAvatarGroupCountComponent));
      expect(countDebugElement.componentInstance).toBeInstanceOf(ZardAvatarGroupCountComponent);
    });
  });
});
