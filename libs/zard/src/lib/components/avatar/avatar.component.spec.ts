import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ZardAvatarComponent } from './avatar.component';
import { ZardAvatarImage, ZardAvatarVariants } from './avatar.variants';

@Component({
  standalone: true,
  imports: [ZardAvatarComponent],
  template: `
    <z-avatar [zType]="zType" [zSize]="zSize" [zShape]="zShape" [zStatus]="zStatus" [zBorder]="zBorder" [zImage]="zImage" [zLoading]="zLoading" [class]="customClass"> </z-avatar>
  `,
})
class TestHostComponent {
  zType: ZardAvatarVariants['zType'] = 'default';
  zSize: ZardAvatarVariants['zSize'] = 'default';
  zShape: ZardAvatarVariants['zShape'] = 'default';
  zStatus: ZardAvatarVariants['zStatus'] = null;
  zBorder = false;
  zImage: ZardAvatarImage['zImage'] | null = { fallback: 'ZA' };
  zLoading = false;
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
      expect(avatarComponent.zType()).toBe('default');
      expect(avatarComponent.zSize()).toBe('default');
      expect(avatarComponent.zShape()).toBe('default');
      expect(avatarComponent.zStatus()).toBeNull();
      expect(avatarComponent.zBorder()).toBe(false);
      expect(avatarComponent.zImage()).toEqual({ fallback: 'ZA' });
      expect(avatarComponent.zLoading()).toBe(false);
    });

    it('should apply correct classes based on variants', () => {
      hostComponent.zType = 'destructive';
      hostComponent.zSize = 'lg';
      hostComponent.zShape = 'circle';
      hostComponent.zBorder = true;
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;

      expect(avatarElement.classList.contains('bg-destructive')).toBeTruthy();
      expect(avatarElement.classList.contains('text-destructive-foreground')).toBeTruthy();
      expect(avatarElement.classList.contains('w-37')).toBeTruthy();
      expect(avatarElement.classList.contains('h-37')).toBeTruthy();
      expect(avatarElement.classList.contains('rounded-full')).toBeTruthy();
      // Check that border-related classes are applied
      const classListArray = avatarElement.className.split(' ');
      const hasBorderClasses = classListArray.some((cls: string) => cls.includes('border'));
      expect(hasBorderClasses).toBeTruthy();
    });

    it('should append custom classes', () => {
      const customClass = 'test-custom-class';
      hostComponent.customClass = customClass;
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.classList.contains(customClass)).toBeTruthy();
    });

    it('should apply secondary variant classes', () => {
      hostComponent.zType = 'secondary';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.classList.contains('bg-secondary')).toBeTruthy();
      expect(avatarElement.classList.contains('text-secondary-foreground')).toBeTruthy();
    });

    it('should apply outline variant classes', () => {
      hostComponent.zType = 'outline';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.classList.contains('border')).toBeTruthy();
      expect(avatarElement.classList.contains('border-input')).toBeTruthy();
    });

    it('should apply ghost variant classes', () => {
      hostComponent.zType = 'ghost';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.classList.contains('shadow-sm')).toBeTruthy();
      expect(avatarElement.classList.contains('shadow-black')).toBeTruthy();
    });

    it('should apply small size classes', () => {
      hostComponent.zSize = 'sm';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.classList.contains('w-10')).toBeTruthy();
      expect(avatarElement.classList.contains('h-10')).toBeTruthy();
    });

    it('should apply medium size classes', () => {
      hostComponent.zSize = 'md';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.classList.contains('w-18')).toBeTruthy();
      expect(avatarElement.classList.contains('h-18')).toBeTruthy();
    });

    it('should apply full size classes', () => {
      hostComponent.zSize = 'full';
      fixture.detectChanges();

      const avatarElement = fixture.debugElement.query(By.directive(ZardAvatarComponent)).nativeElement;
      expect(avatarElement.classList.contains('w-full')).toBeTruthy();
      expect(avatarElement.classList.contains('h-full')).toBeTruthy();
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
      hostComponent.zImage = { url: 'test-url.jpg', alt: 'Test Alt', fallback: 'ZA' };
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement).toBeTruthy();
      expect(imgElement.nativeElement.src).toContain('test-url.jpg');
      expect(imgElement.nativeElement.alt).toBe('Test Alt');
    });

    it('should use default alt text when not provided', () => {
      hostComponent.zImage = { url: 'test-url.jpg', fallback: 'ZA' };
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img'));
      expect(imgElement.nativeElement.alt).toBe('Avatar');
    });

    it('should display fallback text when no image URL is provided', () => {
      hostComponent.zImage = { fallback: 'AB' };
      fixture.detectChanges();

      const fallbackElement = fixture.debugElement.query(By.css('span.text-base'));
      expect(fallbackElement).toBeTruthy();
      expect(fallbackElement.nativeElement.textContent.trim()).toBe('AB');
    });
  });

  describe('Loading state', () => {
    it('should display loading spinner when loading is active', () => {
      hostComponent.zLoading = true;
      fixture.detectChanges();

      const loaderElement = fixture.debugElement.query(By.css('.icon-loader-circle'));
      expect(loaderElement).toBeTruthy();
    });

    it('should hide loading spinner when loading is false', () => {
      hostComponent.zLoading = true;
      fixture.detectChanges();

      let loaderElement = fixture.debugElement.query(By.css('.icon-loader-circle'));
      expect(loaderElement).toBeTruthy();

      hostComponent.zLoading = false;
      fixture.detectChanges();

      loaderElement = fixture.debugElement.query(By.css('.icon-loader-circle'));
      expect(loaderElement).toBeNull();
    });
  });

  describe('Status indicators', () => {
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

    it('should display invisible status indicator', () => {
      hostComponent.zStatus = 'invisible';
      fixture.detectChanges();

      const statusElement = fixture.debugElement.query(By.css('svg.text-stone-400\\/90'));
      expect(statusElement).toBeTruthy();
    });
  });
});
