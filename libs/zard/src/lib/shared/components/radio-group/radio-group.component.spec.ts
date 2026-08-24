import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ZardRadioComponent, ZardRadioGroupComponent } from './radio-group.component';

@Component({
  imports: [ZardRadioGroupComponent, ZardRadioComponent],
  template: `
    <z-radio-group [zDisabled]="groupDisabled()">
      <button z-radio value="light">Light</button>
      <button z-radio value="dark">Dark</button>
      <button z-radio value="system" [zDisabled]="true">System</button>
    </z-radio-group>
  `,
})
class TestHostComponent {
  readonly groupDisabled = signal(false);
}

@Component({
  imports: [ZardRadioGroupComponent, ZardRadioComponent, FormsModule],
  template: `
    <z-radio-group [(ngModel)]="theme">
      <button z-radio value="light">Light</button>
      <button z-radio value="dark">Dark</button>
    </z-radio-group>
  `,
})
class TestHostWithNgModelComponent {
  theme = 'light';
}

@Component({
  imports: [ZardRadioGroupComponent, ZardRadioComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <z-radio-group formControlName="theme">
        <button z-radio value="light">Light</button>
        <button z-radio value="dark">Dark</button>
      </z-radio-group>
    </form>
  `,
})
class TestHostWithReactiveFormComponent {
  readonly form = new FormGroup({ theme: new FormControl('dark') });
}

describe('ZardRadioGroupComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let radios: HTMLButtonElement[];

  const stateOf = (index: number) => radios[index].getAttribute('data-state');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    radios = fixture.debugElement.queryAll(By.css('[role="radio"]')).map(item => item.nativeElement);
  });

  it('exposes the group as a radiogroup', () => {
    const group: HTMLElement = fixture.debugElement.query(By.directive(ZardRadioGroupComponent)).nativeElement;

    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(group.getAttribute('data-slot')).toBe('radio-group');
  });

  it('starts with nothing selected', () => {
    expect(radios.map((_, index) => stateOf(index))).toEqual(['unchecked', 'unchecked', 'unchecked']);
  });

  it('selects the clicked radio and deselects the others', () => {
    radios[1].click();
    fixture.detectChanges();

    expect(stateOf(0)).toBe('unchecked');
    expect(stateOf(1)).toBe('checked');
    expect(radios[1].getAttribute('aria-checked')).toBe('true');
  });

  it('moves the selection on a second click elsewhere', () => {
    radios[1].click();
    fixture.detectChanges();
    radios[0].click();
    fixture.detectChanges();

    expect(stateOf(0)).toBe('checked');
    expect(stateOf(1)).toBe('unchecked');
  });

  it('ignores a click on a radio disabled on its own', () => {
    radios[2].click();
    fixture.detectChanges();

    expect(stateOf(2)).toBe('unchecked');
    expect(radios[2].disabled).toBe(true);
  });

  it('disables every radio when the group is disabled', () => {
    fixture.componentInstance.groupDisabled.set(true);
    fixture.detectChanges();

    expect(radios.every(radio => radio.disabled)).toBe(true);

    radios[0].click();
    fixture.detectChanges();
    expect(stateOf(0)).toBe('unchecked');

    const group: HTMLElement = fixture.debugElement.query(By.directive(ZardRadioGroupComponent)).nativeElement;
    expect(group.getAttribute('aria-disabled')).toBe('true');
  });

  // The radio reads the selection off its parent, so it cannot stand alone.
  it('refuses to be used outside a group', () => {
    @Component({
      imports: [ZardRadioComponent],
      template: `
        <button z-radio value="a">Orphan</button>
      `,
    })
    class OrphanHostComponent {}

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [OrphanHostComponent] });

    expect(() => TestBed.createComponent(OrphanHostComponent).detectChanges()).toThrow(
      /<z-radio> must be used inside a <z-radio-group>/,
    );
  });

  describe('as a ControlValueAccessor', () => {
    it('renders the initial ngModel value as the selection', async () => {
      const host = TestBed.createComponent(TestHostWithNgModelComponent);
      host.detectChanges();
      await host.whenStable();
      host.detectChanges();

      const items: HTMLButtonElement[] = host.debugElement
        .queryAll(By.css('[role="radio"]'))
        .map(item => item.nativeElement);
      expect(items[0].getAttribute('data-state')).toBe('checked');
    });

    it('pushes a click back to the ngModel', async () => {
      const host = TestBed.createComponent(TestHostWithNgModelComponent);
      host.detectChanges();
      await host.whenStable();

      const items: HTMLButtonElement[] = host.debugElement
        .queryAll(By.css('[role="radio"]'))
        .map(item => item.nativeElement);
      items[1].click();
      await host.whenStable();

      expect(host.componentInstance.theme).toBe('dark');
    });

    it('follows a reactive control, disabled state included', async () => {
      const host = TestBed.createComponent(TestHostWithReactiveFormComponent);
      host.detectChanges();
      await host.whenStable();
      host.detectChanges();

      const items: HTMLButtonElement[] = host.debugElement
        .queryAll(By.css('[role="radio"]'))
        .map(item => item.nativeElement);
      expect(items[1].getAttribute('data-state')).toBe('checked');

      host.componentInstance.form.controls.theme.disable();
      host.detectChanges();
      expect(items.every(item => item.disabled)).toBe(true);
    });
  });
});
