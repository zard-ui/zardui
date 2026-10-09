import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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

    it('renders the fallback on the very first render with no intermediate frame', () => {
      // Fresh fixture so no prior detectChanges() has run.
      const freshFixture = TestBed.createComponent(TestHostComponent);
      freshFixture.componentInstance.zSrc = undefined;
      freshFixture.componentInstance.zFallback = 'ZA';
      freshFixture.detectChanges();

      const fallbackElement = freshFixture.debugElement.query(By.css('span.text-sm'));
      expect(fallbackElement).toBeTruthy();
      expect(fallbackElement.nativeElement.textContent.trim()).toBe('ZA');
    });

    it('keeps the fallback mounted underneath the image while it loads, both out of flex flow', () => {
      hostComponent.zFallback = 'ZA';
      hostComponent.zSrc = 'loading-image.jpg';
      fixture.detectChanges();

      const fallbackElement = fixture.debugElement.query(By.css('span.text-sm'));
      const imgElement = fixture.debugElement.query(By.css('img'));

      // Both nodes coexist during the load window ...
      expect(fallbackElement).toBeTruthy();
      expect(imgElement).toBeTruthy();
      // ... but neither is a flex sibling that can be squeezed: both are taken out of flow.
      expect(fallbackElement.nativeElement).toHaveClass('absolute');
      expect(fallbackElement.nativeElement).toHaveClass('inset-0');
      expect(imgElement.nativeElement).toHaveClass('absolute');
      expect(imgElement.nativeElement).toHaveClass('inset-0');
      // The image is not painted in until it loads.
      expect(imgElement.nativeElement).toHaveClass('opacity-0');
      expect(imgElement.nativeElement).not.toHaveClass('opacity-100');

      imgElement.nativeElement.dispatchEvent(new Event('load'));
      fixture.detectChanges();

      expect(imgElement.nativeElement).toHaveClass('opacity-100');
    });

    it('sizes the img element to match zSize (sm 24 / default 32 / lg 40)', () => {
      hostComponent.zSrc = 'test-url.jpg';

      hostComponent.zSize = 'sm';
      fixture.detectChanges();
      let imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(imgElement.getAttribute('width')).toBe('24');
      expect(imgElement.getAttribute('height')).toBe('24');

      hostComponent.zSize = 'default';
      fixture.detectChanges();
      imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(imgElement.getAttribute('width')).toBe('32');
      expect(imgElement.getAttribute('height')).toBe('32');

      hostComponent.zSize = 'lg';
      fixture.detectChanges();
      imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(imgElement.getAttribute('width')).toBe('40');
      expect(imgElement.getAttribute('height')).toBe('40');
    });

    it('loads the image eagerly instead of deferring the request', () => {
      hostComponent.zSrc = 'test-url.jpg';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(imgElement.getAttribute('loading')).toBe('eager');
    });

    it('hides the fallback from assistive tech once the image has loaded', () => {
      hostComponent.zFallback = 'ZA';
      hostComponent.zSrc = 'test-url.jpg';
      fixture.detectChanges();

      let fallbackElement = fixture.debugElement.query(By.css('span.text-sm')).nativeElement;
      expect(fallbackElement.getAttribute('aria-hidden')).toBeNull();

      const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      imgElement.dispatchEvent(new Event('load'));
      fixture.detectChanges();

      fallbackElement = fixture.debugElement.query(By.css('span.text-sm')).nativeElement;
      expect(fallbackElement.getAttribute('aria-hidden')).toBe('true');
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

  describe('State reset on zSrc change (linkedSignal)', () => {
    it('resets the loaded (opacity-100) state synchronously — no frame with the previous src still marked loaded', () => {
      hostComponent.zSrc = 'valid-image.jpg';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      imgElement.dispatchEvent(new Event('load'));
      fixture.detectChanges();

      expect(imgElement).toHaveClass('opacity-100');

      hostComponent.zSrc = 'another-image.jpg';
      fixture.detectChanges();

      // No extra tick/effect flush needed: the reset is synchronous with the src change,
      // so the very next render already reflects the new (unloaded) image.
      const newImgElement = fixture.debugElement.query(By.css('img')).nativeElement;
      expect(newImgElement).toHaveClass('opacity-0');
      expect(newImgElement).not.toHaveClass('opacity-100');
    });

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
