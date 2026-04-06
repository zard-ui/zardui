import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { type ZardAvatarGroupOrientationVariants } from '@/shared/components/avatar/avatar.variants';

import { ZardAvatarGroupComponent } from './avatar-group.component';
import { ZardAvatarComponent } from './avatar.component';

@Component({
  imports: [ZardAvatarGroupComponent, ZardAvatarComponent],
  template: `
    <z-avatar-group [zOrientation]="zOrientation" [class]="customClass">
      <z-avatar zFallback="A1" />
      <z-avatar zFallback="A2" />
    </z-avatar-group>
  `,
})
class TestHostComponent {
  zOrientation: ZardAvatarGroupOrientationVariants = 'horizontal';
  customClass = '';
}

describe('ZardAvatarGroupComponent', () => {
  let hostComponent: TestHostComponent;
  let groupComponent: ZardAvatarGroupComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    const groupDebugElement = fixture.debugElement.query(By.directive(ZardAvatarGroupComponent));
    groupComponent = groupDebugElement.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(groupComponent).toBeTruthy();
  });

  describe('Orientation inputs', () => {
    it('has default horizontal orientation', () => {
      expect(groupComponent.zOrientation()).toBe('horizontal');
    });

    it('applies horizontal orientation classes', () => {
      hostComponent.zOrientation = 'horizontal';
      fixture.detectChanges();

      const groupElement = fixture.debugElement.query(By.directive(ZardAvatarGroupComponent)).nativeElement;
      expect(groupElement).toHaveClass('flex-row');
      expect(groupElement).toHaveClass('-space-x-2');
    });

    it('applies vertical orientation classes', () => {
      hostComponent.zOrientation = 'vertical';
      fixture.detectChanges();

      const groupElement = fixture.debugElement.query(By.directive(ZardAvatarGroupComponent)).nativeElement;
      expect(groupElement).toHaveClass('flex-col');
      expect(groupElement).toHaveClass('-space-y-2');
    });

    it('updates orientation when input changes', () => {
      hostComponent.zOrientation = 'vertical';
      fixture.detectChanges();

      expect(groupComponent.zOrientation()).toBe('vertical');

      const groupElement = fixture.debugElement.query(By.directive(ZardAvatarGroupComponent)).nativeElement;
      expect(groupElement).toHaveClass('flex-col');
    });
  });

  describe('Custom classes', () => {
    it('appends custom classes', () => {
      const customClass = 'test-custom-class';
      hostComponent.customClass = customClass;
      fixture.detectChanges();

      const groupElement = fixture.debugElement.query(By.directive(ZardAvatarGroupComponent)).nativeElement;
      expect(groupElement).toHaveClass(customClass);
    });

    it('combines orientation and custom classes', () => {
      hostComponent.zOrientation = 'vertical';
      hostComponent.customClass = 'my-group';
      fixture.detectChanges();

      const groupElement = fixture.debugElement.query(By.directive(ZardAvatarGroupComponent)).nativeElement;
      expect(groupElement).toHaveClass('flex-col');
      expect(groupElement).toHaveClass('-space-y-2');
      expect(groupElement).toHaveClass('my-group');
    });
  });

  describe('Content projection', () => {
    it('projects z-avatar components into the group', () => {
      const avatarElements = fixture.debugElement.queryAll(By.directive(ZardAvatarComponent));
      expect(avatarElements.length).toBe(2);
    });

    it('has group/avatar-group class for styling child avatars', () => {
      const groupElement = fixture.debugElement.query(By.directive(ZardAvatarGroupComponent)).nativeElement;
      expect(groupElement).toHaveClass('group/avatar-group');
    });
  });

  describe('Export as', () => {
    it('is exported as zAvatarGroup', () => {
      const groupDebugElement = fixture.debugElement.query(By.directive(ZardAvatarGroupComponent));
      expect(groupDebugElement.componentInstance).toBeInstanceOf(ZardAvatarGroupComponent);
    });
  });
});
