import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, TemplateRef, ViewChild } from '@angular/core';

import { ZardInputGroupComponent } from './input-group.component';
import { ZardInputGroupInputDirective } from './input-group-input.directive';

@Component({
  standalone: true,
  imports: [ZardInputGroupComponent, ZardInputGroupInputDirective],
  template: `
    <ng-template #customTemplate>Custom Template</ng-template>
    <z-input-group
      [zSize]="size"
      [zCompact]="compact"
      [zDisabled]="disabled"
      [zError]="error"
      [zWarning]="warning"
      [zAddOnBefore]="addOnBefore"
      [zAddOnAfter]="addOnAfter"
      [zPrefix]="prefix"
      [zSuffix]="suffix"
      [zAriaLabel]="ariaLabel"
      [zAriaLabelledBy]="ariaLabelledBy"
      [zAriaDescribedBy]="ariaDescribedBy"
    >
      <input z-input-group type="text" placeholder="Test input" />
    </z-input-group>
  `,
})
class TestHostComponent {
  @ViewChild('customTemplate', { static: true }) customTemplate!: TemplateRef<any>;

  size: 'sm' | 'default' | 'lg' = 'default';
  compact = false;
  disabled = false;
  error = false;
  warning = false;
  addOnBefore: string | TemplateRef<any> | undefined;
  addOnAfter: string | TemplateRef<any> | undefined;
  prefix: string | TemplateRef<any> | undefined;
  suffix: string | TemplateRef<any> | undefined;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

describe('ZardInputGroupComponent', () => {
  let component: ZardInputGroupComponent;
  let fixture: ComponentFixture<ZardInputGroupComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardInputGroupComponent, ZardInputGroupInputDirective, TestHostComponent],
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
      expect(component.zCompact()).toBe(false);
      expect(component.zDisabled()).toBe(false);
      expect(component.zError()).toBe(false);
      expect(component.zWarning()).toBe(false);
    });
  });

  describe('Input Properties', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('should handle size variants', () => {
      const sizes: Array<'sm' | 'default' | 'lg'> = ['sm', 'default', 'lg'];

      sizes.forEach(size => {
        hostComponent.size = size;
        hostFixture.detectChanges();

        const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
        expect(wrapper.className).toContain(size === 'sm' ? 'h-9' : size === 'lg' ? 'h-11' : 'h-10');
      });
    });

    it('should apply compact styles', () => {
      hostComponent.compact = true;
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.className).toContain('shadow-none');
      expect(wrapper.className).toContain('border-0');
    });

    it('should apply disabled state', () => {
      hostComponent.disabled = true;
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.getAttribute('aria-disabled')).toBe('true');
      expect(wrapper.getAttribute('data-disabled')).toBe('true');
      expect(wrapper.className).toContain('opacity-50');
      expect(wrapper.className).toContain('cursor-not-allowed');
    });

    it('should apply error state', () => {
      hostComponent.error = true;
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.getAttribute('data-error')).toBe('true');
    });

    it('should apply warning state', () => {
      hostComponent.warning = true;
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.getAttribute('data-warning')).toBe('true');
    });
  });

  describe('Addon Elements', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should render addon before with string', () => {
      hostComponent.addOnBefore = 'https://';
      hostFixture.detectChanges();

      const addon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-before"]');
      expect(addon).toBeTruthy();
      expect(addon.textContent.trim()).toBe('https://');
      expect(addon.className).toContain('rounded-l-md');
      expect(addon.className).toContain('border-r-0');
    });

    it('should render addon after with string', () => {
      hostComponent.addOnAfter = '.com';
      hostFixture.detectChanges();

      const addon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-after"]');
      expect(addon).toBeTruthy();
      expect(addon.textContent.trim()).toBe('.com');
      expect(addon.className).toContain('rounded-r-md');
      expect(addon.className).toContain('border-l-0');
    });

    it('should render addon before with template', () => {
      hostComponent.addOnBefore = hostComponent.customTemplate;
      hostFixture.detectChanges();

      const addon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-before"]');
      expect(addon).toBeTruthy();
      expect(addon.textContent.trim()).toBe('Custom Template');
    });

    it('should handle both addons together', () => {
      hostComponent.addOnBefore = 'Before';
      hostComponent.addOnAfter = 'After';
      hostFixture.detectChanges();

      const beforeAddon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-before"]');
      const afterAddon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-after"]');
      const inputWrapper = hostFixture.debugElement.nativeElement.querySelector('.relative.flex-1');

      expect(beforeAddon).toBeTruthy();
      expect(afterAddon).toBeTruthy();

      // Check that addons have correct border and negative margins
      expect(beforeAddon.className).toContain('border-r-0');
      expect(beforeAddon.className).toContain('-mr-px');
      expect(afterAddon.className).toContain('border-l-0');
      expect(afterAddon.className).toContain('-ml-px');

      // Check that input wrapper is styled correctly when both addons are present
      expect(inputWrapper.className).toContain('rounded-none');
    });
  });

  describe('Affix Elements', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should render prefix with string', () => {
      hostComponent.prefix = '$';
      hostFixture.detectChanges();

      const prefix = hostFixture.debugElement.nativeElement.querySelector('[id*="prefix"]');
      expect(prefix).toBeTruthy();
      expect(prefix.textContent.trim()).toBe('$');
      expect(prefix.className).toContain('left-0');
      expect(prefix.className).toContain('pl-3');
      expect(prefix.getAttribute('aria-hidden')).toBe('true');
    });

    it('should render suffix with string', () => {
      hostComponent.suffix = 'USD';
      hostFixture.detectChanges();

      const suffix = hostFixture.debugElement.nativeElement.querySelector('[id*="suffix"]');
      expect(suffix).toBeTruthy();
      expect(suffix.textContent.trim()).toBe('USD');
      expect(suffix.className).toContain('right-0');
      expect(suffix.className).toContain('pr-3');
      expect(suffix.getAttribute('aria-hidden')).toBe('true');
    });

    it('should render prefix with template', () => {
      hostComponent.prefix = hostComponent.customTemplate;
      hostFixture.detectChanges();

      const prefix = hostFixture.debugElement.nativeElement.querySelector('[id*="prefix"]');
      expect(prefix).toBeTruthy();
      expect(prefix.textContent.trim()).toBe('Custom Template');
    });

    it('should adjust input padding for prefix', () => {
      hostComponent.prefix = '$';
      hostComponent.size = 'default';
      hostFixture.detectChanges();

      const inputWrapper = hostFixture.debugElement.nativeElement.querySelector('.relative');
      expect(inputWrapper.className).toContain('pl-10');
    });

    it('should adjust input padding for suffix', () => {
      hostComponent.suffix = 'USD';
      hostComponent.size = 'default';
      hostFixture.detectChanges();

      const inputWrapper = hostFixture.debugElement.nativeElement.querySelector('.relative');
      expect(inputWrapper.className).toContain('pr-10');
    });

    it('should handle both prefix and suffix together', () => {
      hostComponent.prefix = '$';
      hostComponent.suffix = 'USD';
      hostComponent.size = 'default';
      hostFixture.detectChanges();

      const inputWrapper = hostFixture.debugElement.nativeElement.querySelector('.relative');
      expect(inputWrapper.className).toContain('pl-10');
      expect(inputWrapper.className).toContain('pr-10');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should set proper role attribute', () => {
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper).toBeTruthy();
    });

    it('should handle aria-label', () => {
      hostComponent.ariaLabel = 'Test input group';
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.getAttribute('aria-label')).toBe('Test input group');
    });

    it('should handle aria-labelledby', () => {
      hostComponent.ariaLabelledBy = 'label-id';
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.getAttribute('aria-labelledby')).toBe('label-id');
    });

    it('should handle aria-describedby', () => {
      hostComponent.ariaDescribedBy = 'desc-id';
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.getAttribute('aria-describedby')).toBe('desc-id');
    });

    it('should set aria-disabled when disabled', () => {
      hostComponent.disabled = true;
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.getAttribute('aria-disabled')).toBe('true');
    });

    it('should set aria-hidden on affix elements', () => {
      hostComponent.prefix = '$';
      hostComponent.suffix = 'USD';
      hostFixture.detectChanges();

      const prefix = hostFixture.debugElement.nativeElement.querySelector('[id*="prefix"]');
      const suffix = hostFixture.debugElement.nativeElement.querySelector('[id*="suffix"]');

      expect(prefix.getAttribute('aria-hidden')).toBe('true');
      expect(suffix.getAttribute('aria-hidden')).toBe('true');
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
      expect(wrapper.className).toContain('h-9');
    });

    it('should apply correct height for large size', () => {
      hostComponent.size = 'lg';
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      expect(wrapper.className).toContain('h-11');
    });

    it('should adjust addon size based on group size', () => {
      hostComponent.addOnBefore = 'Test';
      hostComponent.size = 'sm';
      hostFixture.detectChanges();

      const addon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-before"]');
      expect(addon.className).toContain('h-9');
      expect(addon.className).toContain('px-2');
      expect(addon.className).toContain('text-xs');
    });

    it('should adjust affix size based on group size', () => {
      hostComponent.prefix = '$';
      hostComponent.size = 'lg';
      hostFixture.detectChanges();

      const prefix = hostFixture.debugElement.nativeElement.querySelector('[id*="prefix"]');
      expect(prefix.className).toContain('w-11');
      expect(prefix.className).toContain('text-base');
    });
  });

  describe('Complex Scenarios', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
    });

    it('should handle all props together', () => {
      hostComponent.size = 'lg';
      hostComponent.compact = true;
      hostComponent.disabled = true;
      hostComponent.error = true;
      hostComponent.addOnBefore = 'https://';
      hostComponent.addOnAfter = '.com';
      hostComponent.prefix = 'www.';
      hostComponent.suffix = '/path';
      hostComponent.ariaLabel = 'Complex input group';
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      const beforeAddon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-before"]');
      const afterAddon = hostFixture.debugElement.nativeElement.querySelector('[id*="addon-after"]');
      const prefix = hostFixture.debugElement.nativeElement.querySelector('[id*="prefix"]');
      const suffix = hostFixture.debugElement.nativeElement.querySelector('[id*="suffix"]');

      // Check wrapper
      expect(wrapper.className).toContain('h-11'); // lg size
      expect(wrapper.className).toContain('shadow-none'); // compact
      expect(wrapper.className).toContain('opacity-50'); // disabled
      expect(wrapper.getAttribute('aria-label')).toBe('Complex input group');
      expect(wrapper.getAttribute('data-error')).toBe('true');
      expect(wrapper.getAttribute('aria-disabled')).toBe('true');

      // Check addons
      expect(beforeAddon).toBeTruthy();
      expect(afterAddon).toBeTruthy();
      expect(beforeAddon.textContent.trim()).toBe('https://');
      expect(afterAddon.textContent.trim()).toBe('.com');

      // Check affixes
      expect(prefix).toBeTruthy();
      expect(suffix).toBeTruthy();
      expect(prefix.textContent.trim()).toBe('www.');
      expect(suffix.textContent.trim()).toBe('/path');
    });

    it('should handle input-only scenario', () => {
      hostFixture.detectChanges();

      const wrapper = hostFixture.debugElement.nativeElement.querySelector('[role="group"]');
      const inputWrapper = hostFixture.debugElement.nativeElement.querySelector('.relative');
      const input = hostFixture.debugElement.nativeElement.querySelector('input[z-input-group]');

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

      const id1 = component['addonBeforeId']();
      const id2 = component['addonAfterId']();
      const id3 = component['prefixId']();
      const id4 = component['suffixId']();

      expect(id1).toMatch(/input-group-addon-before-/);
      expect(id2).toMatch(/input-group-addon-after-/);
      expect(id3).toMatch(/input-group-prefix-/);
      expect(id4).toMatch(/input-group-suffix-/);

      // IDs should be unique
      expect(id1).not.toBe(id2);
      expect(id1).not.toBe(id3);
      expect(id1).not.toBe(id4);
    });

    it('should compute wrapper classes correctly', () => {
      fixture.componentRef.setInput('zSize', 'lg');
      fixture.componentRef.setInput('zCompact', true);
      fixture.componentRef.setInput('zDisabled', true);
      fixture.detectChanges();

      const classes = component['wrapperClasses']();
      expect(classes).toContain('h-11');
      expect(classes).toContain('shadow-none');
      expect(classes).toContain('opacity-50');
    });
  });
});

describe('ZardInputGroupInputDirective', () => {
  let directive: ZardInputGroupInputDirective;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardInputGroupComponent, ZardInputGroupInputDirective, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const inputElement = fixture.debugElement.nativeElement.querySelector('input[z-input-group]');
    expect(inputElement).toBeTruthy();
  });

  it('should apply correct classes to input element', () => {
    const inputElement = fixture.debugElement.nativeElement.querySelector('input[z-input-group]');
    expect(inputElement.className).toContain('flex-1');
    expect(inputElement.className).toContain('bg-transparent');
    expect(inputElement.className).toContain('border-0');
    expect(inputElement.className).toContain('outline-none');
    expect(inputElement.className).toContain('focus:outline-none');
    expect(inputElement.className).toContain('placeholder:text-muted-foreground');
    expect(inputElement.className).toContain('disabled:cursor-not-allowed');
    expect(inputElement.className).toContain('disabled:opacity-50');
  });
});
