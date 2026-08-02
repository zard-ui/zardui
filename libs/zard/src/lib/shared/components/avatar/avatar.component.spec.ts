import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';

import { type ZardAvatarSizeVariants } from '@/shared/components/avatar/avatar.variants';

import { ZardAvatarComponent } from './avatar.component';

@Component({
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar
      [zSize]="zSize"
      [zSrc]="zSrc"
      [zAlt]="zAlt"
      [zFallback]="zFallback"
      [zShowBadge]="zShowBadge"
      [zBadgeIcon]="zBadgeIcon"
      [zBadgeClass]="zBadgeClass"
      [zPriority]="zPriority"
      [class]="customClass"
    />
  `,
  viewProviders: [provideIcons({ lucideCheck })],
})
class TestHostComponent {
  zSize: ZardAvatarSizeVariants = 'default';
  zSrc: string | undefined = undefined;
  zAlt = '';
  zFallback = 'ZA';
  zShowBadge = false;
  zBadgeIcon = '';
  zBadgeClass = '';
  zPriority = false;
  customClass = '';
}

describe('ZardAvatarComponent', () => {
  let hostComponent: TestHostComponent;
  let avatarComponent: ZardAvatarComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    const avatarDebugElement = fixture.debugElement.query(By.directive(ZardAvatarComponent));
    avatarComponent = avatarDebugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(avatarComponent).toBeTruthy();
  });

  describe('Variant inputs', () => {
    it('should have default values for inputs', () => {
      // Reset host values to test component defaults
      hostComponent.zSize = 'default';
      hostComponent.zSrc = undefined;
      hostComponent.zAlt = '';
      hostComponent.zFallback = '';
      fixture.detectChanges();

      expect(avatarComponent.zSize()).toBe('default');
      expect(avatarComponent.zSrc()).toBeUndefined();
      expect(avatarComponent.zAlt()).toBe('');
      expect(avatarComponent.zFallback()).toBe('');
    });

    it('should apply correct classes based on variants', () => {
      hostComponent.zSize = 'lg';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;

      expect(avatarElement).toHaveClass('size-10');
      expect(avatarElement).toHaveClass('rounded-full');
    });

    it('should append custom classes', () => {
      const customClass = 'test-custom-class';
      hostComponent.customClass = customClass;
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement).toHaveClass(customClass);
    });

    it('should apply small size classes', () => {
      hostComponent.zSize = 'sm';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement).toHaveClass('size-6');
    });

    it('should apply medium size classes', () => {
      hostComponent.zSize = 'lg';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement).toHaveClass('size-10');
    });
  });

  describe('Image display', () => {
    it('should display image when URL is provided', () => {
      hostComponent.zSrc = 'test-url.jpg';
      hostComponent.zAlt = 'Test Alt';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement).toBeTruthy();
      expect(imgElement.nativeElement.src).toContain('test-url.jpg');
      expect(imgElement.nativeElement.alt).toBe('Test Alt');
    });

    it('should use empty alt text when not provided', () => {
      hostComponent.zSrc = 'test-url.jpg';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement.nativeElement.alt).toBe('');
    });

    it('should display fallback text when no image URL is provided', () => {
      hostComponent.zFallback = 'AB';
      fixture.detectChanges();

      const fallbackElement = fixture.debugElement.query(By.css('span.text-sm'));
      expect(fallbackElement).toBeTruthy();
      expect(fallbackElement.nativeElement.textContent.trim()).toBe('AB');
    });

    it('should handle image load event correctly', () => {
      hostComponent.zSrc = 'valid-image.jpg';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(imgElement.src).toContain('valid-image.jpg');

      imgElement.dispatchEvent(new Event('load'));
      fixture.detectChanges();

      expect(imgElement).toBeVisible();
    });

    it('handles image error event and resets state when zSrc changes', () => {
      hostComponent.zSrc = 'invalid-image.jpg';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(imgElement.src).toContain('invalid-image.jpg');

      imgElement.dispatchEvent(new Event('error'));
      fixture.detectChanges();

      expect(imgElement).not.toBeVisible();

      hostComponent.zSrc = 'fallback-image.jpg';
      fixture.detectChanges();

      const imgElementAfterChange = fixture.debugElement.query(By.css('img')).nativeElement;

      expect(imgElementAfterChange.src).toContain('fallback-image.jpg');
      expect(imgElementAfterChange).toBeVisible();
    });
  });

  describe('Badge feature', () => {
    it('does not render badge by default when zShowBadge is false', () => {
      hostComponent.zShowBadge = false;
      fixture.detectChanges();

      const badgeElement = fixture.debugElement.query(By.css('[data-slot="avatar"] > div'));
      expect(badgeElement).toBeFalsy();
    });

    it('renders badge when zShowBadge is true', () => {
      hostComponent.zShowBadge = true;
      fixture.detectChanges();

      const badgeElement = fixture.debugElement.query(By.css('[data-slot="avatar"] > div'));
      expect(badgeElement).toBeTruthy();
    });

    it('applies correct badge classes', () => {
      hostComponent.zShowBadge = true;
      fixture.detectChanges();

      const badgeElement = fixture.debugElement.query(By.css('[data-slot="avatar"] > div')).nativeElement;
      expect(badgeElement).toHaveClass('absolute');
      expect(badgeElement).toHaveClass('right-0');
      expect(badgeElement).toHaveClass('bottom-0');
      expect(badgeElement).toHaveClass('z-10');
    });

    it('applies custom badge classes via zBadgeClass input', () => {
      const customBadgeClass = 'custom-badge-class';
      hostComponent.zShowBadge = true;
      hostComponent.zBadgeClass = customBadgeClass;
      fixture.detectChanges();

      const badgeElement = fixture.debugElement.query(By.css('[data-slot="avatar"] > div')).nativeElement;
      expect(badgeElement.classList.contains(customBadgeClass)).toBeTruthy();
    });

    it('renders badge icon when zBadgeIcon is provided', () => {
      hostComponent.zShowBadge = true;
      hostComponent.zBadgeIcon = 'lucideCheck';
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('ng-icon'));
      expect(iconElement).toBeTruthy();
    });

    it('does not render badge icon when zBadgeIcon is empty', () => {
      hostComponent.zShowBadge = true;
      hostComponent.zBadgeIcon = '';
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('ng-icon'));
      expect(iconElement).toBeFalsy();
    });

    it('applies size-specific badge classes for sm size', () => {
      hostComponent.zSize = 'sm';
      hostComponent.zShowBadge = true;
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.getAttribute('data-size')).toBe('sm');
    });

    it('applies size-specific badge classes for lg size', () => {
      hostComponent.zSize = 'lg';
      hostComponent.zShowBadge = true;
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.getAttribute('data-size')).toBe('lg');
    });
  });

  describe('Image priority', () => {
    it('renders img with priority attribute when zPriority is true', () => {
      hostComponent.zSrc = 'test-url.jpg';
      hostComponent.zPriority = true;
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(imgElement.getAttribute('fetchpriority')).toBe('high');
    });

    it('renders img without priority attribute when zPriority is false', () => {
      hostComponent.zSrc = 'test-url.jpg';
      hostComponent.zPriority = false;
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(imgElement.getAttribute('fetchpriority')).toBe('auto');
    });
  });

  describe('Effect behavior', () => {
    it('resets image error state when zSrc changes', () => {
      hostComponent.zSrc = 'invalid-image.jpg';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      imgElement.dispatchEvent(new Event('error'));
      fixture.detectChanges();

      expect(imgElement).not.toBeVisible();

      hostComponent.zSrc = 'new-valid-image.jpg';
      fixture.detectChanges();

      const newImgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(newImgElement.src).toContain('new-valid-image.jpg');
      expect(newImgElement).toBeVisible();
    });

    it('resets image loaded state when zSrc changes', () => {
      hostComponent.zSrc = 'valid-image.jpg';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      imgElement.dispatchEvent(new Event('load'));
      fixture.detectChanges();

      expect(imgElement).toBeVisible();

      hostComponent.zSrc = 'another-image.jpg';
      fixture.detectChanges();

      const newImgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(newImgElement.src).toContain('another-image.jpg');
    });
  });
});
