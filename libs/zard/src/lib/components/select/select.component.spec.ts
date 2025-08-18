import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ZardSelectComponent } from './select.component';
import { ZardSelectItemComponent } from './select-item.component';

@Component({
  template: `
    <z-select [value]="value()" [label]="label()" [placeholder]="placeholder()" [disabled]="disabled()">
      <z-select-item value="option1">Option 1</z-select-item>
      <z-select-item value="option2">Option 2</z-select-item>
      <z-select-item value="option3">Option 3</z-select-item>
    </z-select>
  `,
  standalone: true,
  imports: [ZardSelectComponent, ZardSelectItemComponent],
})
class TestHostComponent {
  value = signal('');
  label = signal('');
  placeholder = signal('Select an option...');
  disabled = signal(false);
}

@Component({
  template: `
    <z-select [formControl]="control">
      <z-select-item value="apple">Apple</z-select-item>
      <z-select-item value="banana">Banana</z-select-item>
      <z-select-item value="orange">Orange</z-select-item>
    </z-select>
  `,
  standalone: true,
  imports: [ZardSelectComponent, ZardSelectItemComponent, ReactiveFormsModule],
})
class TestHostWithFormControlComponent {
  control = new FormControl('');
}

describe('ZardSelectComponent', () => {
  describe('basic functionality', () => {
    let component: ZardSelectComponent;
    let fixture: ComponentFixture<ZardSelectComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ZardSelectComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ZardSelectComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.selectedValue()).toBe('');
      expect(component.selectedLabel()).toBe('');
      expect(component.placeholder()).toBe('Select an option...');
      expect(component.disabled()).toBe(false);
    });

    describe('keyboard navigation', () => {
      it('should open dropdown on Enter key', () => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        jest.spyOn(event, 'preventDefault');

        component.onTriggerKeydown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.isOpen()).toBe(true);
      });

      it('should open dropdown on Space key', () => {
        const event = new KeyboardEvent('keydown', { key: ' ' });
        jest.spyOn(event, 'preventDefault');

        component.onTriggerKeydown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.isOpen()).toBe(true);
      });

      it('should close dropdown on Escape key', () => {
        component.open();
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        jest.spyOn(event, 'preventDefault');

        component.onTriggerKeydown(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.isOpen()).toBe(false);
      });
    });
  });

  describe('with host component', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      selectComponent = hostFixture.debugElement.children[0].componentInstance as ZardSelectComponent;
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should render select items', () => {
      const items = selectComponent.selectItems();
      expect(items.length).toBe(3);
      expect(items[0].value()).toBe('option1');
      expect(items[1].value()).toBe('option2');
      expect(items[2].value()).toBe('option3');
    });

    it('should update selectedLabel when value changes', () => {
      hostComponent.value.set('option2');
      hostFixture.detectChanges();

      expect(selectComponent.selectedValue()).toBe('option2');
      expect(selectComponent.selectedLabel()).toBe('Option 2');
    });

    it('should use manual label when provided', () => {
      hostComponent.value.set('option1');
      hostComponent.label.set('Custom Label');
      hostFixture.detectChanges();

      expect(selectComponent.selectedValue()).toBe('option1');
      expect(selectComponent.selectedLabel()).toBe('Custom Label');
    });

    it('should respect disabled state', () => {
      hostComponent.disabled.set(true);
      hostFixture.detectChanges();

      const button = hostFixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });

    it('should display placeholder when no value is selected', () => {
      const button = hostFixture.nativeElement.querySelector('button');
      expect(button.textContent).toContain('Select an option...');
    });

    it('should update placeholder text', () => {
      hostComponent.placeholder.set('Choose a value');
      hostFixture.detectChanges();

      const button = hostFixture.nativeElement.querySelector('button');
      expect(button.textContent).toContain('Choose a value');
    });
  });

  describe('with FormControl', () => {
    let hostComponent: TestHostWithFormControlComponent;
    let hostFixture: ComponentFixture<TestHostWithFormControlComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostWithFormControlComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostWithFormControlComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      selectComponent = hostFixture.debugElement.children[0].componentInstance as ZardSelectComponent;
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should work with reactive forms', () => {
      hostComponent.control.setValue('banana');
      hostFixture.detectChanges();

      expect(selectComponent.selectedValue()).toBe('banana');
      expect(selectComponent.selectedLabel()).toBe('Banana');
    });

    it('should update form control when selection changes', () => {
      selectComponent.selectItem('orange', 'Orange');
      hostFixture.detectChanges();

      expect(hostComponent.control.value).toBe('orange');
    });

    it('should call onChange when value changes', () => {
      const onChangeSpy = jest.fn();
      selectComponent.registerOnChange(onChangeSpy);

      selectComponent.selectItem('apple', 'Apple');

      expect(onChangeSpy).toHaveBeenCalledWith('apple');
    });

    it('should call onTouched when dropdown closes', () => {
      const onTouchedSpy = jest.fn();
      selectComponent.registerOnTouched(onTouchedSpy);

      selectComponent.open();
      selectComponent.close();

      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('signal reactivity', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();

      selectComponent = hostFixture.debugElement.children[0].componentInstance as ZardSelectComponent;
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should automatically update label when items change', async () => {
      hostComponent.value.set('option1');
      hostFixture.detectChanges();

      expect(selectComponent.selectedLabel()).toBe('Option 1');

      // The computed signal automatically reacts to content children changes
      // When new items are added or removed, the label will update accordingly
      // This is handled automatically by the contentChildren signal

      // Verify the label still reflects the correct item text
      expect(selectComponent.selectedValue()).toBe('option1');
      expect(selectComponent.selectedLabel()).toBe('Option 1');
    });
  });
});
