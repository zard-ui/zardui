import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ZardCheckboxComponent } from './checkbox.component';

@Component({
  imports: [ZardCheckboxComponent, FormsModule],
  standalone: true,
  template: `
    <span z-checkbox>Default</span>
    <span z-checkbox zType="default">Default Type</span>
    <span z-checkbox zType="destructive">Destructive</span>

    <span z-checkbox zSize="default">Default Size</span>
    <span z-checkbox zSize="lg">Large Size</span>

    <span z-checkbox zShape="default">Default Shape</span>
    <span z-checkbox zShape="circle">Circle Shape</span>
    <span z-checkbox zShape="square">Square Shape</span>

    <span z-checkbox disabled>Disabled</span>
  `,
})
class TestHostComponent {}

@Component({
  imports: [ZardCheckboxComponent, FormsModule],
  standalone: true,
  template: ` <span z-checkbox [(ngModel)]="checked">Checked</span> `,
})
class TestHostWithNgModelComponent {
  checked = false;
}

@Component({
  imports: [ZardCheckboxComponent, ReactiveFormsModule],
  standalone: true,
  template: `
    <form [formGroup]="form">
      <span z-checkbox formControlName="termsCheckbox"> Agree to Terms </span>
      <span z-checkbox formControlName="newsletterCheckbox"> Subscribe to Newsletter </span>
      <span z-checkbox formControlName="privacyCheckbox" [disabled]="form.get('privacyCheckbox')?.disabled">
        Accept Privacy Policy
      </span>
    </form>
  `,
})
class TestHostWithReactiveFormsComponent {
  private fb = inject(FormBuilder);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      termsCheckbox: [false],
      newsletterCheckbox: [true],
      privacyCheckbox: [{ value: false, disabled: true }],
    });
  }
}

describe('ZardCheckboxComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let fixtureWithNgModel: ComponentFixture<TestHostWithNgModelComponent>;
  let testHostWithNgModelComponent: TestHostWithNgModelComponent;
  let checkboxElements: HTMLInputElement[];

  beforeEach(async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TestHostWithNgModelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    fixtureWithNgModel = TestBed.createComponent(TestHostWithNgModelComponent);
    testHostWithNgModelComponent = fixtureWithNgModel.componentInstance;
    fixtureWithNgModel.detectChanges();

    checkboxElements = fixture.debugElement.queryAll(By.css('input[type="checkbox"]')).map(el => el.nativeElement);
  });

  describe('Base Classes', () => {
    it('should have base classes for all checkboxes', () => {
      const baseClasses = [
        'cursor-[unset]',
        'peer',
        'appearance-none',
        'border',
        'transition',
        'shadow',
        'hover:shadow-md',
        'focus-visible:outline-none',
        'focus-visible:ring-1',
        'focus-visible:ring-ring',
      ];

      checkboxElements.forEach(checkbox => {
        baseClasses.forEach(cls => {
          expect(checkbox.classList).toContain(cls);
        });
      });
    });
  });

  describe('Type Variants', () => {
    it('should apply correct classes for zType', () => {
      const typeVariants = [
        {
          index: 0,
          type: 'default',
          expectedClasses: ['border-primary', 'checked:bg-primary'],
        },
        {
          index: 1,
          type: 'default',
          expectedClasses: ['border-primary', 'checked:bg-primary'],
        },
        {
          index: 2,
          type: 'destructive',
          expectedClasses: ['border-destructive', 'checked:bg-destructive'],
        },
      ];

      typeVariants.forEach(variant => {
        const checkbox = checkboxElements[variant.index];
        variant.expectedClasses.forEach(cls => {
          expect(checkbox.classList).toContain(cls);
        });
      });
    });
  });

  describe('Size Variants', () => {
    it('should apply correct classes for zSize', () => {
      const sizeVariants = [
        {
          index: 3,
          size: 'default',
          expectedClasses: ['h-4', 'w-4'],
        },
        {
          index: 4,
          size: 'lg',
          expectedClasses: ['h-6', 'w-6'],
        },
      ];

      sizeVariants.forEach(variant => {
        const checkbox = checkboxElements[variant.index];
        variant.expectedClasses.forEach(cls => {
          expect(checkbox.classList).toContain(cls);
        });
      });
    });
  });

  describe('Shape Variants', () => {
    it('should apply correct classes for zShape', () => {
      const shapeVariants = [
        {
          index: 5,
          shape: 'default',
          expectedClasses: ['rounded'],
        },
        {
          index: 6,
          shape: 'circle',
          expectedClasses: ['rounded-full'],
        },
        {
          index: 7,
          shape: 'square',
          expectedClasses: ['rounded-none'],
        },
      ];

      shapeVariants.forEach(variant => {
        const checkbox = checkboxElements[variant.index];
        variant.expectedClasses.forEach(cls => {
          expect(checkbox.classList).toContain(cls);
        });
      });
    });
  });

  describe('Disabled State', () => {
    it('should apply disabled classes', () => {
      const disabledCheckbox = checkboxElements[8];

      expect(disabledCheckbox.disabled).toBeTruthy();
      expect(disabledCheckbox.classList).toContain('disabled:cursor-not-allowed');
      expect(disabledCheckbox.classList).toContain('disabled:opacity-50');
    });
  });

  describe('Checked State', () => {
    it('should bind checked property from ngModel', async () => {
      const checkbox = fixtureWithNgModel.debugElement.query(By.directive(ZardCheckboxComponent));
      const componentInstance = checkbox.componentInstance as ZardCheckboxComponent;
      testHostWithNgModelComponent.checked = true;
      fixtureWithNgModel.detectChanges();
      await fixtureWithNgModel.whenStable();
      expect(componentInstance.checked).toBe(true);
    });

    it('should update ngModel when checkbox is clicked', async () => {
      const checkboxDe = fixtureWithNgModel.debugElement.query(By.directive(ZardCheckboxComponent));
      const inputElement: HTMLInputElement = checkboxDe.nativeElement.querySelector('input[type="checkbox"]');
      expect(testHostWithNgModelComponent.checked).toBe(false);
      inputElement.click();
      fixtureWithNgModel.detectChanges();
      await fixtureWithNgModel.whenStable();
      expect(testHostWithNgModelComponent.checked).toBe(true);
    });
  });
});
describe('ZardCheckboxComponent with Reactive Forms', () => {
  let fixture: ComponentFixture<TestHostWithReactiveFormsComponent>;
  let component: TestHostWithReactiveFormsComponent;
  let checkboxElements: HTMLInputElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostWithReactiveFormsComponent, ZardCheckboxComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostWithReactiveFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    checkboxElements = fixture.debugElement.queryAll(By.css('input[type="checkbox"]')).map(el => el.nativeElement);
  });

  it('should initialize form controls with correct initial values', () => {
    const [termsCheckbox, newsletterCheckbox, privacyCheckbox] = checkboxElements;

    expect(termsCheckbox.checked).toBeFalsy();
    expect(component.form.get('termsCheckbox')?.value).toBeFalsy();

    expect(newsletterCheckbox.checked).toBeTruthy();
    expect(component.form.get('newsletterCheckbox')?.value).toBeTruthy();

    expect(privacyCheckbox.disabled).toBeTruthy();
    expect(privacyCheckbox.checked).toBeFalsy();
  });

  it('should update form control value when checkbox is clicked', () => {
    const [termsCheckbox, newsletterCheckbox] = checkboxElements;

    termsCheckbox.click();
    fixture.detectChanges();

    expect(termsCheckbox.checked).toBeTruthy();
    expect(component.form.get('termsCheckbox')?.value).toBeTruthy();

    newsletterCheckbox.click();
    fixture.detectChanges();

    expect(newsletterCheckbox.checked).toBeFalsy();
    expect(component.form.get('newsletterCheckbox')?.value).toBeFalsy();
  });

  it('should update checkbox when form control value is changed programmatically', () => {
    const [termsCheckbox, newsletterCheckbox] = checkboxElements;

    component.form.get('termsCheckbox')?.setValue(true);
    component.form.get('newsletterCheckbox')?.setValue(false);
    fixture.detectChanges();

    expect(termsCheckbox.checked).toBeTruthy();
    expect(newsletterCheckbox.checked).toBeFalsy();
  });

  it('should prevent changes to disabled checkbox', () => {
    const privacyCheckbox = checkboxElements[2];

    privacyCheckbox.click();
    fixture.detectChanges();

    expect(privacyCheckbox.checked).toBeFalsy();
    expect(component.form.get('privacyCheckbox')?.disabled).toBeTruthy();
  });

  it('should be able to enable and disable form controls', () => {
    const privacyCheckbox = checkboxElements[2];
    const privacyControl = component.form.get('privacyCheckbox');

    privacyControl?.enable();
    fixture.detectChanges();

    expect(privacyCheckbox.disabled).toBeFalsy();

    privacyControl?.disable();
    fixture.detectChanges();

    expect(privacyCheckbox.disabled).toBeTruthy();
  });
});
