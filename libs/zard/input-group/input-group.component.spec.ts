import { Component, type TemplateRef, ViewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ZardInputDirective } from '@ngzard/ui/input';
import { inputVariants, type ZardInputSizeVariants } from '@ngzard/ui/input';

import { ZardInputGroupComponent } from './input-group.component';

@Component({
  imports: [ZardInputGroupComponent, ZardInputDirective],
  standalone: true,
  template: `
    <ng-template #customTemplate>Custom Template</ng-template>
    <z-input-group [zSize]="size" [zDisabled]="disabled" [zAddonBefore]="addonBefore" [zAddonAfter]="addonAfter">
      <input z-input type="text" placeholder="Test input" />
    </z-input-group>
  `,
})
class TestHostComponent {
  @ViewChild('customTemplate', { static: true }) customTemplate!: TemplateRef<void>;

  size: ZardInputSizeVariants = 'default';
  disabled = false;
  addonBefore: string | TemplateRef<void> = '';
  addonAfter: string | TemplateRef<void> = '';
}

describe('ZardInputGroupComponent', () => {
  let component: ZardInputGroupComponent;
  let fixture: ComponentFixture<ZardInputGroupComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardInputGroupComponent, ZardInputDirective, TestHostComponent],
    }).compileComponents();
  });

  describe('Component Initialization', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ZardInputGroupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default values', () => {
      expect(component.zSize()).toBe('default');
      expect(component.zDisabled()).toBe(false);
    });
  });

  describe('Input Properties', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('should handle size variants', () => {
      const sizes: Array<ZardInputSizeVariants> = ['sm', 'default', 'lg'];

      sizes.forEach(size => {
        hostComponent.size = size;
        hostFixture.detectChanges();

        const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
        expect(wrapper.className).toContain(size === 'sm' ? 'h-8' : size === 'lg' ? 'h-10' : 'h-9');
      });
    });

    it('should apply disabled state', () => {
      hostComponent.disabled = true;
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.getAttribute('aria-disabled')).toBe('true');
      expect(wrapper.getAttribute('data-disabled')).toBe('true');
    });
  });

  describe('Addon Elements', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should render addon before with string', () => {
      hostComponent.addonBefore = 'https://';
      hostFixture.detectChanges();

      const addon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-before"]');
      expect(addon).toBeTruthy();
      expect(addon.textContent.trim()).toBe('https://');
      expect(addon.className).toContain('rounded-l-md');
      expect(addon.className).toContain('border-r-0');
    });

    it('should render addon after with string', () => {
      hostComponent.addonAfter = '.com';
      hostFixture.detectChanges();

      const addon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-after"]');
      expect(addon).toBeTruthy();
      expect(addon.textContent.trim()).toBe('.com');
      expect(addon.className).toContain('rounded-r-md');
      expect(addon.className).toContain('border-l-0');
    });

    it('should render addon before with template', () => {
      hostComponent.addonBefore = hostComponent.customTemplate;
      hostFixture.detectChanges();

      const addon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-before"]');
      expect(addon).toBeTruthy();
      expect(addon.textContent.trim()).toBe('Custom Template');
    });

    it('should handle both addons together', () => {
      hostComponent.addonBefore = 'Before';
      hostComponent.addonAfter = 'After';
      hostFixture.detectChanges();

      const beforeAddon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-before"]');
      const afterAddon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-after"]');
      const inputWrapper = hostFixture.debugElement.nativeElement.querySelector('.relative');

      expect(beforeAddon).toBeTruthy();
      expect(afterAddon).toBeTruthy();

      // Check that addons have correct border styles
      expect(beforeAddon.className).toContain('border-r-0');
      expect(afterAddon.className).toContain('border-l-0');

      // Check that input wrapper is styled correctly when both addons are present
      expect(inputWrapper.className).toContain('rounded-l-none');
      expect(inputWrapper.className).toContain('rounded-r-none');
    });
  });

  describe('Size Variations', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should apply correct height for small size', () => {
      hostComponent.size = 'sm';
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.className).toContain('h-8');
    });

    it('should apply correct height for large size', () => {
      hostComponent.size = 'lg';
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.className).toContain('h-10');
    });

    it('should adjust addon size based on group size', () => {
      hostComponent.addonBefore = 'Test';
      hostComponent.size = 'sm';
      hostFixture.detectChanges();

      const addon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-before"]');
      expect(addon.className).toContain('h-7.5');
      expect(addon.className).toContain('text-xs');
    });
  });

  describe('Complex Scenarios', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should handle all props together', () => {
      hostComponent.size = 'lg';
      hostComponent.disabled = true;
      hostComponent.addonBefore = 'https://';
      hostComponent.addonAfter = '.com';
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      const beforeAddon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-before"]');
      const afterAddon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-after"]');

      // Check wrapper
      expect(wrapper.className).toContain('h-10'); // lg size

      // Check addons
      expect(beforeAddon).toBeTruthy();
      expect(afterAddon).toBeTruthy();
      expect(beforeAddon.textContent.trim()).toBe('https://');
      expect(afterAddon.textContent.trim()).toBe('.com');
    });

    it('should handle input-only scenario', () => {
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      const inputWrapper = hostFixture.debugElement.nativeElement.querySelector('.relative');
      const input = hostFixture.debugElement.nativeElement.querySelector('input[z-input]');

      expect(wrapper).toBeTruthy();
      expect(inputWrapper.className).toContain('rounded-md'); // isAlone = true
      expect(input).toBeTruthy();
    });
  });

  describe('Class Computations', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ZardInputGroupComponent);
      component = fixture.componentInstance;
    });

    it('should generate unique IDs', () => {
      fixture.detectChanges();

      const id1 = component['addonBeforeId'];
      const id2 = component['addonAfterId'];

      expect(id1).toMatch(/input-group-.*-addon-before/);
      expect(id2).toMatch(/input-group-.*-addon-after/);

      // IDs should be unique
      expect(id1).not.toBe(id2);
    });

    it('should compute wrapper classes correctly', () => {
      fixture.componentRef.setInput('zSize', 'lg');
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();

      const classes = component['inputWrapperClasses']();
      expect(classes).toContain('h-9.5');
    });
  });
});

describe('ZardInputDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardInputGroupComponent, ZardInputDirective, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const inputElement = fixture.debugElement.nativeElement.querySelector('input[z-input]');
    expect(inputElement).toBeTruthy();
  });

  it('should apply correct classes to input element', () => {
    const inputElement = fixture.debugElement.nativeElement.querySelector('input[z-input]');
    // The input element gets its classes from ZardInputDirective
    expect(inputElement).toHaveClass(inputVariants());
  });
});
