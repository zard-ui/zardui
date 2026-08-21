import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ZardInputGroupComponent } from '@/shared/components/input-group';

import { ZardTextareaComponent } from './textarea.component';

@Component({
  imports: [ZardTextareaComponent],
  template: `
    <textarea z-textarea [class]="extraClass()"></textarea>
  `,
})
class TestHostComponent {
  readonly extraClass = signal('');
}

@Component({
  imports: [ZardTextareaComponent, FormsModule],
  template: `
    <textarea z-textarea [(ngModel)]="comment"></textarea>
  `,
})
class TestHostWithNgModelComponent {
  comment = 'initial';
}

@Component({
  imports: [ZardTextareaComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <textarea z-textarea formControlName="bio"></textarea>
    </form>
  `,
})
class TestHostWithReactiveFormComponent {
  readonly form = new FormGroup({ bio: new FormControl('typed') });
}

@Component({
  imports: [ZardTextareaComponent, ZardInputGroupComponent],
  template: `
    <z-input-group>
      <textarea z-textarea></textarea>
    </z-input-group>
  `,
})
class TestHostInsideGroupComponent {}

describe('ZardTextareaComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let textarea: HTMLTextAreaElement;

  const type = (element: HTMLTextAreaElement, value: string) => {
    element.value = value;
    element.dispatchEvent(new Event('input'));
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    textarea = fixture.debugElement.query(By.directive(ZardTextareaComponent)).nativeElement;
  });

  it('applies the variant classes to the host textarea', () => {
    expect(textarea.className).not.toBe('');
  });

  it('merges the class input on top of the variants', () => {
    fixture.componentInstance.extraClass.set('h-40');
    fixture.detectChanges();

    expect(textarea.className).toContain('h-40');
  });

  it('marks itself with the textarea slot when it stands alone', () => {
    expect(textarea.getAttribute('data-slot')).toBe('textarea');
  });

  it('reflects what the user types back into the value model', () => {
    type(textarea, 'hello');

    const component = fixture.debugElement.query(By.directive(ZardTextareaComponent)).componentInstance;
    expect(component.value()).toBe('hello');
  });

  it('disables the underlying textarea', () => {
    const component = fixture.debugElement.query(By.directive(ZardTextareaComponent)).componentInstance;

    component.disable(true);
    expect(textarea.disabled).toBe(true);

    component.disable(false);
    expect(textarea.disabled).toBe(false);
  });

  describe('as a ControlValueAccessor', () => {
    it('writes the initial ngModel value into the element', async () => {
      const host = TestBed.createComponent(TestHostWithNgModelComponent);
      host.detectChanges();
      await host.whenStable();
      host.detectChanges();

      const element: HTMLTextAreaElement = host.debugElement.query(By.directive(ZardTextareaComponent)).nativeElement;
      expect(element.value).toBe('initial');
    });

    it('pushes typed text back to the ngModel', async () => {
      const host = TestBed.createComponent(TestHostWithNgModelComponent);
      host.detectChanges();
      await host.whenStable();

      const element: HTMLTextAreaElement = host.debugElement.query(By.directive(ZardTextareaComponent)).nativeElement;
      type(element, 'edited');
      await host.whenStable();

      expect(host.componentInstance.comment).toBe('edited');
    });

    it('follows a reactive control in both directions', async () => {
      const host = TestBed.createComponent(TestHostWithReactiveFormComponent);
      host.detectChanges();
      await host.whenStable();
      host.detectChanges();

      const element: HTMLTextAreaElement = host.debugElement.query(By.directive(ZardTextareaComponent)).nativeElement;
      expect(element.value).toBe('typed');

      type(element, 'from the user');
      expect(host.componentInstance.form.controls.bio.value).toBe('from the user');
    });

    it('disables the element when the control is disabled', async () => {
      const host = TestBed.createComponent(TestHostWithReactiveFormComponent);
      host.detectChanges();
      await host.whenStable();

      const element: HTMLTextAreaElement = host.debugElement.query(By.directive(ZardTextareaComponent)).nativeElement;
      host.componentInstance.form.controls.bio.disable();
      host.detectChanges();

      expect(element.disabled).toBe(true);
    });
  });

  // Inside an input group the textarea is the group's control, and the group styles
  // it through `*:data-[slot=input-group-control]`.
  it('switches to the input-group-control slot inside an input group', () => {
    const host = TestBed.createComponent(TestHostInsideGroupComponent);
    host.detectChanges();

    const element: HTMLTextAreaElement = host.debugElement.query(By.directive(ZardTextareaComponent)).nativeElement;
    expect(element.getAttribute('data-slot')).toBe('input-group-control');
  });
});
