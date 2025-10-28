import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardAvatarComponent, ZardAvatarStatus } from './avatar.component';
import { ZardAvatarVariants, ZardImageVariants } from './avatar.variants';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: ` <z-avatar [zSize]="zSize" [zShape]="zShape" [zStatus]="zStatus" [zSrc]="zSrc" [zAlt]="zAlt" [zFallback]="zFallback" [class]="customClass"> </z-avatar> `,
})
class TestHostComponent {
  zSize: ZardAvatarVariants['zSize'] = 'default';
  zShape: ZardImageVariants['zShape'] = 'circle';
  zStatus: ZardAvatarStatus | null = null;
  zSrc: string | undefined = undefined;
  zAlt = '';
  zFallback = 'ZA';
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
      hostComponent.zShape = 'circle';
      hostComponent.zStatus = null;
      hostComponent.zSrc = undefined;
      hostComponent.zAlt = '';
      hostComponent.zFallback = '';
      fixture.detectChanges();

      expect(avatarComponent.zSize()).toBe('default');
      expect(avatarComponent.zShape()).toBe('circle');
      expect(avatarComponent.zStatus()).toBeNull();
      expect(avatarComponent.zSrc()).toBeUndefined();
      expect(avatarComponent.zAlt()).toBe('');
      expect(avatarComponent.zFallback()).toBe('');
    });

    it('should apply correct classes based on variants', () => {
      hostComponent.zSize = 'lg';
      hostComponent.zShape = 'circle';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;

      expect(avatarElement.classList.contains('size-14')).toBeTruthy();
      expect(avatarElement.classList.contains('rounded-full')).toBeTruthy();
    });

    it('should append custom classes', () => {
      const customClass = 'test-custom-class';
      hostComponent.customClass = customClass;
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.classList.contains(customClass)).toBeTruthy();
    });

    it('should apply small size classes', () => {
      hostComponent.zSize = 'sm';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.classList.contains('size-8')).toBeTruthy();
    });

    it('should apply medium size classes', () => {
      hostComponent.zSize = 'md';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.classList.contains('size-12')).toBeTruthy();
    });

    it('should apply square shape class', () => {
      hostComponent.zShape = 'square';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.classList.contains('rounded-none')).toBeTruthy();
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

      const fallbackElement = fixture.debugElement.query(By.css('span.text-base'));
      expect(fallbackElement).toBeTruthy();
      expect(fallbackElement.nativeElement.textContent.trim()).toBe('AB');
    });
  });

  describe('Status indicators', () => {
    it('should set data-status attribute when status is provided', () => {
      hostComponent.zStatus = 'online';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.getAttribute('data-status')).toBe('online');
    });

    it('should not set data-status attribute when status is null', () => {
      hostComponent.zStatus = null;
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.getAttribute('data-status')).toBeNull();
    });

    it('should display online status indicator', () => {
      hostComponent.zStatus = 'online';
      fixture.detectChanges();

      const statusElement = fixture.debugElement.query(By.css('svg.text-green-500'));
      expect(statusElement).toBeTruthy();
    });

    it('should display offline status indicator', () => {
      hostComponent.zStatus = 'offline';
      fixture.detectChanges();

      const statusElement = fixture.debugElement.query(By.css('svg.text-red-500 circle'));
      expect(statusElement).toBeTruthy();
    });

    it('should display do not disturb status indicator', () => {
      hostComponent.zStatus = 'doNotDisturb';
      fixture.detectChanges();

      const statusElement = fixture.debugElement.query(By.css('svg.text-red-500 path'));
      expect(statusElement).toBeTruthy();
    });

    it('should display away status indicator', () => {
      hostComponent.zStatus = 'away';
      fixture.detectChanges();

      const statusElement = fixture.debugElement.query(By.css('svg.text-yellow-400'));
      expect(statusElement).toBeTruthy();
    });
  });
});
