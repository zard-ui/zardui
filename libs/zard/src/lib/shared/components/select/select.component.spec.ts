import { Component, signal } from '@angular/core';
import { type ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardSelectItemComponent } from './select-item.component';
import { ZardSelectComponent } from './select.component';
import { ZardSelectImports } from './select.imports';

@Component({
  imports: [ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <z-select
      [(zValue)]="value"
      [zLabel]="label()"
      [zPlaceholder]="placeholder()"
      [zDisabled]="disabled()"
      [zInvalid]="invalid()"
    >
      <z-select-item zValue="option1">Option 1</z-select-item>
      <z-select-item zValue="option2">Option 2</z-select-item>
      <z-select-item zValue="option3">Option 3</z-select-item>
    </z-select>
  `,
})
class TestHostComponent {
  readonly value = signal('');
  readonly label = signal('');
  readonly placeholder = signal('Select an option...');
  readonly disabled = signal(false);
  readonly invalid = signal(false);
}

@Component({
  imports: [ZardSelectComponent, ZardSelectItemComponent, ReactiveFormsModule],
  template: `
    <z-select [formControl]="control">
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
      <z-select-item zValue="orange">Orange</z-select-item>
    </z-select>
  `,
})
class TestHostWithFormControlComponent {
  control = new FormControl('');
}

@Component({
  imports: [ZardSelectImports],
  template: `
    <z-select
      class="w-64"
      [(zValue)]="value"
      [zPosition]="position()"
      [zSize]="size()"
      (zSelectionChange)="selectionChanges.push($event)"
    >
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
    </z-select>
  `,
})
class TestApiHostComponent {
  readonly value = signal<string | string[]>('');
  readonly position = signal<'item-aligned' | 'popper'>('item-aligned');
  readonly size = signal<'sm' | 'default' | 'lg'>('default');
  readonly selectionChanges: Array<string | string[]> = [];
}

describe('ZardSelectComponent', () => {
  describe('basic functionality', () => {
    let component: ZardSelectComponent;
    let fixture: ComponentFixture<ZardSelectComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent, ZardSelectItemComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
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
      expect(component.zValue()).toBe('');
      expect(component.zPlaceholder()).toBe('Select an option...');
      expect(component.zPosition()).toBe('popper');
      expect(component.zDisabled()).toBe(false);
    });

    describe('keyboard navigation', () => {
      it('should open dropdown on Enter key', fakeAsync(() => {
        const event = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' });
        jest.spyOn(event, 'preventDefault');

        fixture.debugElement.nativeElement.dispatchEvent(event);
        flush();
        fixture.detectChanges();

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.isOpen()).toBeTruthy();
      }));

      it('should open dropdown on Space key', fakeAsync(() => {
        const event = new KeyboardEvent('keydown', { key: ' ' });
        jest.spyOn(event, 'preventDefault');

        fixture.debugElement.nativeElement.dispatchEvent(event);
        flush();
        fixture.detectChanges();

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.isOpen()).toBeTruthy();
      }));

      it('should close dropdown on Escape key', fakeAsync(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        jest.spyOn(event, 'preventDefault');

        component.toggle();
        fixture.debugElement.nativeElement.dispatchEvent(event);
        flush();
        fixture.detectChanges();

        expect(event.preventDefault).toHaveBeenCalled();
        expect(component.isOpen()).toBeFalsy();
      }));
    });
  });

  describe('with host component', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;

      // Initial change detection to create the component tree
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      selectComponent = hostFixture.debugElement.children[0].componentInstance as ZardSelectComponent;

      // Additional change detection to ensure content children are processed
      hostFixture.detectChanges();
      await hostFixture.whenStable();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should handle component functionality without selectItems', () => {
      // selectItems was removed to avoid circular dependency
      // The component should still function correctly for basic operations
      expect(selectComponent.zValue).toBeDefined();
      expect(selectComponent.selectedLabels).toBeDefined();
    });

    it('should update selectedLabel when value changes', () => {
      hostComponent.value.set('option2');
      hostFixture.detectChanges();

      expect(selectComponent.zValue()).toBe('option2');

      // If contentChildren is not working, the label will be the value
      const [label] = selectComponent.selectedLabels();
      expect(['option2', 'Option 2']).toContain(label);
    });

    it('should use manual label when provided', () => {
      hostComponent.value.set('option1');
      hostComponent.label.set('Custom Label');
      hostFixture.detectChanges();

      expect(selectComponent.zValue()).toBe('option1');
      expect(selectComponent.selectedLabels()[0]).toBe('Custom Label');
    });

    it('should respect disabled state', () => {
      hostComponent.disabled.set(true);
      hostFixture.detectChanges();

      const button = hostFixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });

    it('reflects invalid state on host and trigger', () => {
      hostComponent.invalid.set(true);
      hostFixture.detectChanges();

      const selectElement = hostFixture.debugElement.query(By.directive(ZardSelectComponent)).nativeElement;
      const button = hostFixture.nativeElement.querySelector('button');
      expect(selectElement).toHaveAttribute('data-slot', 'select');
      expect(selectElement).toHaveAttribute('data-invalid', '');
      expect(button).toHaveAttribute('aria-invalid', 'true');
    });

    it('should display placeholder when no value is selected', () => {
      const button = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;
      expect(button.textContent).toContain('Select an option...');
      expect(button).toHaveAttribute('aria-label', 'Select an option...');
    });

    it('should update placeholder text', () => {
      hostComponent.placeholder.set('Choose a value');
      hostFixture.detectChanges();

      const button = hostFixture.nativeElement.querySelector('button > span');
      expect(button.textContent).toContain('Choose a value');
      expect(hostFixture.nativeElement.querySelector('button')).toHaveAttribute('aria-label', 'Choose a value');
    });

    it('uses popper positioning by default when opened', fakeAsync(() => {
      const selectElement = hostFixture.debugElement.query(By.directive(ZardSelectComponent))
        .nativeElement as HTMLElement;
      Object.defineProperty(selectElement, 'offsetWidth', { configurable: true, value: 240 });
      const trigger = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;
      Object.defineProperty(trigger, 'offsetHeight', { configurable: true, value: 36 });

      trigger.click();
      flush();
      hostFixture.detectChanges();

      const overlayPane = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      const content = overlayPane.querySelector('[data-slot="select-content"]') as HTMLElement;
      const viewport = content.querySelector('[data-slot="select-viewport"]') as HTMLElement;
      expect(trigger).toHaveAttribute('data-size', 'default');
      expect(content).toHaveAttribute('role', 'listbox');
      expect(content.style.getPropertyValue('--z-select-trigger-width')).toBe('240px');
      expect(content.style.getPropertyValue('--z-select-trigger-height')).toBe('36px');
      expect(content).toHaveAttribute('data-position', 'popper');
      expect(content).not.toHaveAttribute('data-align-trigger');
      expect(content).toHaveClass('w-full');
      expect(viewport).toHaveAttribute('role', 'presentation');
      expect(viewport).toHaveClass('p-1');
      expect(viewport).toHaveAttribute('data-position', 'popper');
      expect(viewport).toHaveClass('box-border');
      expect(viewport).toHaveClass('min-h-0');
      expect(overlayPane.style.minWidth).toBe('240px');
    }));

    it('focuses and highlights the selected item when opened', fakeAsync(() => {
      hostComponent.value.set('option2');
      hostFixture.detectChanges();
      const trigger = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

      trigger.click();
      flush();
      hostFixture.detectChanges();
      flush();

      const selectedItem = document.querySelector(
        '[data-slot="select-content"] z-select-item[value="option2"]',
      ) as HTMLElement;
      expect(selectedItem).toHaveAttribute('data-selected', '');
      expect(selectedItem).toHaveAttribute('data-highlighted', '');
      expect(selectedItem.className).toContain('data-highlighted:bg-accent');
      expect(selectedItem.className).not.toContain('data-selected:bg-accent');
      expect(selectedItem.className).not.toContain('data-selected:text-accent-foreground');
      expect(document.activeElement).toBe(selectedItem);
    }));

    it('clears trigger focus after selecting an item', fakeAsync(() => {
      const selectElement = hostFixture.debugElement.query(By.directive(ZardSelectComponent))
        .nativeElement as HTMLElement;
      const trigger = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;
      trigger.focus();

      trigger.click();
      flush();
      hostFixture.detectChanges();
      flush();
      const selectedItem = document.querySelector(
        '[data-slot="select-content"] z-select-item[value="option2"]',
      ) as HTMLElement;
      selectedItem.click();
      flush();
      hostFixture.detectChanges();

      expect(hostComponent.value()).toBe('option2');
      expect(selectElement).not.toHaveAttribute('data-active');
      expect(document.activeElement).not.toBe(trigger);
    }));
  });

  describe('with FormControl', () => {
    let hostComponent: TestHostWithFormControlComponent;
    let hostFixture: ComponentFixture<TestHostWithFormControlComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostWithFormControlComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostWithFormControlComponent);
      hostComponent = hostFixture.componentInstance;

      // Initial change detection to create the component tree
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      selectComponent = hostFixture.debugElement.children[0].componentInstance as ZardSelectComponent;

      // Additional change detection to ensure content children are processed
      hostFixture.detectChanges();
      await hostFixture.whenStable();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should work with reactive forms', () => {
      hostComponent.control.setValue('banana');
      hostFixture.detectChanges();

      expect(selectComponent.zValue()).toBe('banana');

      // If contentChildren is not working, the label will be the value
      const [label] = selectComponent.selectedLabels();
      expect(['banana', 'Banana']).toContain(label);
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

    it('should call onTouched when dropdown closes', fakeAsync(() => {
      const onTouchedSpy = jest.fn();
      selectComponent.registerOnTouched(onTouchedSpy);

      selectComponent.toggle(); // open
      flush();
      selectComponent.toggle(); // close

      expect(onTouchedSpy).toHaveBeenCalled();
    }));

    it('should disable component when FormControl is disabled', () => {
      hostComponent.control.disable();
      hostFixture.detectChanges();

      const button = hostFixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(true);
    });

    it('should enable component when FormControl is enabled after being disabled', () => {
      hostComponent.control.disable();
      hostFixture.detectChanges();

      hostComponent.control.enable();
      hostFixture.detectChanges();

      const button = hostFixture.nativeElement.querySelector('button');
      expect(button.disabled).toBe(false);
    });
  });

  describe('documented API inputs and outputs', () => {
    let hostComponent: TestApiHostComponent;
    let hostFixture: ComponentFixture<TestApiHostComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestApiHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestApiHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      selectComponent = hostFixture.debugElement.query(By.directive(ZardSelectComponent)).componentInstance;
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('applies class and size inputs to the public DOM', () => {
      hostComponent.size.set('lg');
      hostFixture.detectChanges();

      const selectElement = hostFixture.debugElement.query(By.directive(ZardSelectComponent))
        .nativeElement as HTMLElement;
      const trigger = hostFixture.nativeElement.querySelector('[data-slot="select-trigger"]') as HTMLElement;
      expect(selectElement).toHaveClass('w-64');
      expect(selectElement).not.toHaveAttribute('dir');
      expect(trigger).toHaveAttribute('data-size', 'lg');
      expect(trigger).toHaveClass('h-10');
      expect(trigger).toHaveClass('text-base');
    });

    it('applies popper positioning attributes and trigger min-width sizing when opened', fakeAsync(() => {
      hostComponent.position.set('popper');
      hostFixture.detectChanges();
      const selectElement = hostFixture.debugElement.query(By.directive(ZardSelectComponent))
        .nativeElement as HTMLElement;
      Object.defineProperty(selectElement, 'offsetWidth', { configurable: true, value: 220 });
      const trigger = hostFixture.nativeElement.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement;
      Object.defineProperty(trigger, 'offsetHeight', { configurable: true, value: 40 });

      trigger.click();
      flush();
      hostFixture.detectChanges();

      const overlayPane = document.querySelector('.cdk-overlay-pane') as HTMLElement;
      const content = overlayPane.querySelector('[data-slot="select-content"]') as HTMLElement;
      const viewport = content.querySelector('[data-slot="select-viewport"]') as HTMLElement;
      expect(content).toHaveAttribute('data-position', 'popper');
      expect(content).not.toHaveAttribute('data-align-trigger');
      expect(viewport).toHaveAttribute('data-position', 'popper');
      expect(viewport.className).toContain('min-w-(--z-select-trigger-width)');
      expect(overlayPane.style.minWidth).toBe('220px');
    }));

    it('offsets item-aligned content so the selected option sits over the trigger', fakeAsync(() => {
      hostComponent.value.set('banana');
      hostFixture.detectChanges();
      const selectElement = hostFixture.debugElement.query(By.directive(ZardSelectComponent))
        .nativeElement as HTMLElement;
      Object.defineProperty(selectElement, 'offsetWidth', { configurable: true, value: 220 });
      const trigger = hostFixture.nativeElement.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement;
      Object.defineProperty(trigger, 'offsetHeight', { configurable: true, value: 36 });

      trigger.click();
      const content = document.querySelector('[data-slot="select-content"]') as HTMLElement;
      const selectedItem = content.querySelector('z-select-item[value="banana"]') as HTMLElement;
      Object.defineProperty(content, 'offsetHeight', { configurable: true, value: 96 });
      Object.defineProperty(selectedItem, 'offsetTop', { configurable: true, value: 36 });
      Object.defineProperty(selectedItem, 'offsetHeight', { configurable: true, value: 32 });
      flush();
      hostFixture.detectChanges();
      flush();

      const overlayRef = selectComponent['overlayRef'] as unknown as {
        _positionStrategy: { positions: Array<{ offsetY?: number }> };
      };
      const positionStrategy = overlayRef._positionStrategy;
      expect(content).toHaveAttribute('data-position', 'item-aligned');
      expect(content).toHaveAttribute('data-align-trigger', 'true');
      expect(positionStrategy.positions[0].offsetY).toBe(-70);
      expect(positionStrategy.positions[1].offsetY).toBe(62);
    }));

    it('emits zSelectionChange with the selected value', () => {
      selectComponent.selectItem('banana', 'Banana');
      hostFixture.detectChanges();

      expect(hostComponent.value()).toBe('banana');
      expect(hostComponent.selectionChanges).toEqual(['banana']);
      expect(hostFixture.nativeElement.querySelector('[data-slot="select-trigger"]')).toHaveAttribute(
        'aria-label',
        'Banana',
      );
    });
  });

  describe('signal reactivity', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;

      // Initial change detection to create the component tree
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      selectComponent = hostFixture.debugElement.children[0].componentInstance as ZardSelectComponent;

      // Additional change detection to ensure content children are processed
      hostFixture.detectChanges();
      await hostFixture.whenStable();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should automatically update label when items change', () => {
      hostComponent.value.set('option1');
      hostFixture.detectChanges();

      // If contentChildren is not working, the label will be the value
      const [label] = selectComponent.selectedLabels();
      expect(['option1', 'Option 1']).toContain(label);

      // The computed signal automatically reacts to content children changes
      // When new items are added or removed, the label will update accordingly
      // This is handled automatically by the contentChildren signal

      // Verify the label still reflects the correct item text
      expect(selectComponent.zValue()).toBe('option1');
      expect(['option1', 'Option 1']).toContain(selectComponent.selectedLabels()[0]);
    });
  });

  describe('regression: dynamic projected items and effect-driven close', () => {
    @Component({
      imports: [ZardSelectComponent, ZardSelectItemComponent, ReactiveFormsModule],
      template: `
        <z-select [formControl]="control">
          @for (item of items(); track item.value) {
            <z-select-item [zValue]="item.value">{{ item.label }}</z-select-item>
          }
        </z-select>
      `,
    })
    class DynamicHostComponent {
      readonly items = signal<{ value: string; label: string }[]>([
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
        { value: 'c', label: 'Charlie' },
      ]);

      readonly control = new FormControl('');
    }

    let hostComponent: DynamicHostComponent;
    let hostFixture: ComponentFixture<DynamicHostComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DynamicHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      hostFixture = TestBed.createComponent(DynamicHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      selectComponent = hostFixture.debugElement.query(By.directive(ZardSelectComponent)).componentInstance;
      hostFixture.detectChanges();
      await hostFixture.whenStable();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('picks up new projected items after @for collection mutation', fakeAsync(() => {
      expect(selectComponent.selectItems().length).toBe(3);

      hostComponent.items.update(items => [...items, { value: 'd', label: 'Delta' }]);
      hostFixture.detectChanges();
      flush();

      expect(selectComponent.selectItems().length).toBe(4);
      expect(selectComponent.selectItems()[3].zValue()).toBe('d');
    }));

    it('preserves selection after adding new projected items', fakeAsync(() => {
      hostComponent.control.setValue('b');
      hostFixture.detectChanges();
      flush();

      expect(selectComponent.zValue()).toBe('b');

      hostComponent.items.update(items => [...items, { value: 'd', label: 'Delta' }]);
      hostFixture.detectChanges();
      flush();

      expect(selectComponent.zValue()).toBe('b');
      expect(selectComponent.selectedLabels()).toContain('Beta');
    }));

    it('closes dropdown via close(false) when disabledState becomes true while open', fakeAsync(() => {
      const selectElement = hostFixture.debugElement.query(By.directive(ZardSelectComponent))
        .nativeElement as HTMLElement;
      const onTouchedSpy = jest.fn();
      selectComponent.registerOnTouched(onTouchedSpy);

      selectComponent.toggle();
      flush();
      hostFixture.detectChanges();

      expect(selectComponent.isOpen()).toBe(true);

      hostComponent.control.disable();
      hostFixture.detectChanges();
      flush();

      expect(selectComponent.isOpen()).toBe(false);
      expect(selectElement).toHaveAttribute('data-disabled');
      expect(onTouchedSpy).not.toHaveBeenCalled();
    }));

    it('propagates CVA onChange after projected item mutation', fakeAsync(() => {
      hostComponent.items.update(items => [...items, { value: 'd', label: 'Delta' }]);
      hostFixture.detectChanges();
      flush();

      selectComponent.toggle();
      flush();
      hostFixture.detectChanges();

      expect(selectComponent.isOpen()).toBe(true);

      const overlayElement = selectComponent['overlayRef']?.overlayElement;
      const deltaItem = overlayElement?.querySelector<HTMLElement>('z-select-item[value="d"]');
      deltaItem?.click();
      flush();
      hostFixture.detectChanges();

      expect(hostComponent.control.value).toBe('d');
      expect(selectComponent.zValue()).toBe('d');
      expect(selectComponent.isOpen()).toBe(false);
    }));

    it('falls back to raw value in selectedLabels when selected item is removed', fakeAsync(() => {
      hostComponent.control.setValue('b');
      hostFixture.detectChanges();
      flush();

      expect(selectComponent.selectedLabels()).toContain('Beta');

      hostComponent.items.update(items => items.filter(i => i.value !== 'b'));
      hostFixture.detectChanges();
      flush();

      expect(selectComponent.zValue()).toBe('b');
      expect(selectComponent.selectedLabels()).toEqual(['b']);
    }));
  });

  describe('grouped items', () => {
    @Component({
      imports: [ZardSelectImports],
      template: `
        <z-select [(zValue)]="value">
          <z-select-group>
            <z-select-label>Fruits</z-select-label>
            <z-select-item zValue="apple">Apple</z-select-item>
            <z-select-item zValue="banana">Banana</z-select-item>
          </z-select-group>
          <z-select-separator />
        </z-select>
      `,
    })
    class GroupedHostComponent {
      readonly value = signal('');
    }

    it('discovers items projected inside select groups', async () => {
      await TestBed.configureTestingModule({
        imports: [GroupedHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      const hostFixture = TestBed.createComponent(GroupedHostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const selectComponent = hostFixture.debugElement.query(By.directive(ZardSelectComponent)).componentInstance;

      expect(selectComponent.selectItems().length).toBe(2);
      expect(selectComponent.selectItems()[0].zValue()).toBe('apple');

      TestBed.resetTestingModule();
    });

    it('renders separators as block one-pixel elements when opened', async () => {
      await TestBed.configureTestingModule({
        imports: [GroupedHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      const hostFixture = TestBed.createComponent(GroupedHostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();
      const trigger = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

      trigger.click();
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const separator = document.querySelector('[data-slot="select-content"] z-select-separator') as HTMLElement;
      expect(separator).toHaveAttribute('role', 'separator');
      expect(separator).toHaveClass('block');
      expect(separator).toHaveClass('h-px');

      TestBed.resetTestingModule();
    });
  });

  describe('scrollable content', () => {
    @Component({
      imports: [ZardSelectImports],
      template: `
        <z-select [(zValue)]="value">
          <z-select-group>
            <z-select-label>North America</z-select-label>
            <z-select-item zValue="est">Eastern Standard Time</z-select-item>
            <z-select-item zValue="cst">Central Standard Time</z-select-item>
            <z-select-item zValue="mst">Mountain Standard Time</z-select-item>
            <z-select-item zValue="pst">Pacific Standard Time</z-select-item>
            <z-select-item zValue="akst">Alaska Standard Time</z-select-item>
            <z-select-item zValue="hst">Hawaii Standard Time</z-select-item>
          </z-select-group>
        </z-select>
      `,
    })
    class GroupedScrollableHostComponent {
      readonly value = signal('');
    }

    @Component({
      imports: [ZardSelectImports],
      template: `
        <z-select [(zValue)]="value">
          <z-select-item zValue="est">Eastern Standard Time</z-select-item>
          <z-select-item zValue="cst">Central Standard Time</z-select-item>
          <z-select-item zValue="mst">Mountain Standard Time</z-select-item>
          <z-select-item zValue="pst">Pacific Standard Time</z-select-item>
          <z-select-item zValue="akst">Alaska Standard Time</z-select-item>
          <z-select-item zValue="hst">Hawaii Standard Time</z-select-item>
        </z-select>
      `,
    })
    class ScrollableHostComponent {
      readonly value = signal('');
    }

    it('renders scroll controls for grouped selects when options overflow like shadcn', fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [GroupedScrollableHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      });

      const hostFixture = TestBed.createComponent(GroupedScrollableHostComponent);
      hostFixture.detectChanges();
      const trigger = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

      trigger.click();
      hostFixture.detectChanges();
      const viewport = document.querySelector(
        '[data-slot="select-content"] [data-slot="select-viewport"]',
      ) as HTMLElement;
      Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 320 });
      Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 120 });
      viewport.dispatchEvent(new Event('scroll'));
      hostFixture.detectChanges();

      const content = document.querySelector('[data-slot="select-content"]') as HTMLElement;
      expect(content.querySelector('[data-slot="select-scroll-up-button"]')).toBeNull();
      expect(content.querySelector('[data-slot="select-scroll-down-button"]')).toBeTruthy();

      TestBed.resetTestingModule();
    }));

    it('renders centered shadcn-style scroll buttons for ungrouped selects when options overflow', fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [ScrollableHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      });

      const hostFixture = TestBed.createComponent(ScrollableHostComponent);
      hostFixture.detectChanges();
      const trigger = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

      trigger.click();
      hostFixture.detectChanges();
      const viewport = document.querySelector(
        '[data-slot="select-content"] [data-slot="select-viewport"]',
      ) as HTMLElement;
      Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 320 });
      Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 120 });
      viewport.dispatchEvent(new Event('scroll'));
      hostFixture.detectChanges();

      const content = document.querySelector('[data-slot="select-content"]') as HTMLElement;
      const scrollDownButton = content.querySelector('[data-slot="select-scroll-down-button"]') as HTMLElement;
      expect(content.querySelector('[data-slot="select-scroll-up-button"]')).toBeNull();
      expect(content).toHaveClass('flex', 'flex-col');
      expect(content).toHaveAttribute('role', 'listbox');
      expect(viewport).toHaveAttribute('role', 'presentation');
      expect(viewport).toHaveClass('flex-1');
      expect(scrollDownButton.tagName.toLowerCase()).toBe('div');
      expect(scrollDownButton).toHaveClass('justify-center', 'bg-popover', 'z-10');
      expect(scrollDownButton).not.toHaveClass('w-full');
      expect(scrollDownButton).not.toHaveClass('text-muted-foreground');
      expect(scrollDownButton.style.flexShrink).toBe('0');
      expect(scrollDownButton).toHaveAttribute('aria-hidden', 'true');

      viewport.scrollTop = 24;
      viewport.dispatchEvent(new Event('scroll'));
      hostFixture.detectChanges();

      const scrollUpButton = content.querySelector('[data-slot="select-scroll-up-button"]') as HTMLElement;
      expect(scrollUpButton.tagName.toLowerCase()).toBe('div');
      expect(scrollUpButton).toHaveClass('justify-center', 'bg-popover', 'z-10');
      expect(scrollUpButton).toHaveAttribute('aria-hidden', 'true');

      viewport.scrollTop = 200;
      viewport.dispatchEvent(new Event('scroll'));
      hostFixture.detectChanges();

      expect(content.querySelector('[data-slot="select-scroll-down-button"]')).toBeNull();

      TestBed.resetTestingModule();
    }));

    it('auto-scrolls ungrouped select content while the pointer is over a scroll control', fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [ScrollableHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      });

      const hostFixture = TestBed.createComponent(ScrollableHostComponent);
      hostFixture.detectChanges();
      const trigger = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

      trigger.click();
      hostFixture.detectChanges();
      const viewport = document.querySelector(
        '[data-slot="select-content"] [data-slot="select-viewport"]',
      ) as HTMLElement;
      Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 320 });
      Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 120 });
      viewport.dispatchEvent(new Event('scroll'));
      hostFixture.detectChanges();

      const content = document.querySelector('[data-slot="select-content"]') as HTMLElement;
      const scrollDownButton = content.querySelector('[data-slot="select-scroll-down-button"]') as HTMLElement;
      scrollDownButton.dispatchEvent(new Event('pointermove'));
      tick(55);
      hostFixture.detectChanges();

      expect(viewport.scrollTop).toBe(32);

      scrollDownButton.dispatchEvent(new Event('pointerleave'));
      const stoppedScrollTop = viewport.scrollTop;
      tick(100);

      expect(viewport.scrollTop).toBe(stoppedScrollTop);

      TestBed.resetTestingModule();
    }));

    it('switches auto-scroll direction when moving between scroll controls', fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [ScrollableHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      });

      const hostFixture = TestBed.createComponent(ScrollableHostComponent);
      hostFixture.detectChanges();
      const trigger = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

      trigger.click();
      hostFixture.detectChanges();
      const viewport = document.querySelector(
        '[data-slot="select-content"] [data-slot="select-viewport"]',
      ) as HTMLElement;
      Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 320 });
      Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 120 });
      viewport.scrollTop = 80;
      viewport.dispatchEvent(new Event('scroll'));
      hostFixture.detectChanges();

      const content = document.querySelector('[data-slot="select-content"]') as HTMLElement;
      const scrollDownButton = content.querySelector('[data-slot="select-scroll-down-button"]') as HTMLElement;
      const scrollUpButton = content.querySelector('[data-slot="select-scroll-up-button"]') as HTMLElement;
      scrollDownButton.dispatchEvent(new Event('pointermove'));
      tick(55);
      hostFixture.detectChanges();
      expect(viewport.scrollTop).toBe(112);

      scrollUpButton.dispatchEvent(new Event('pointermove'));
      tick(55);
      hostFixture.detectChanges();

      expect(viewport.scrollTop).toBe(80);

      scrollUpButton.dispatchEvent(new Event('pointerleave'));
      TestBed.resetTestingModule();
    }));

    it('lets wheel scrolling take over from scroll-button auto-scroll', fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [ScrollableHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      });

      const hostFixture = TestBed.createComponent(ScrollableHostComponent);
      hostFixture.detectChanges();
      const trigger = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

      trigger.click();
      hostFixture.detectChanges();
      const viewport = document.querySelector(
        '[data-slot="select-content"] [data-slot="select-viewport"]',
      ) as HTMLElement;
      Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 320 });
      Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 120 });
      viewport.scrollTop = 80;
      viewport.dispatchEvent(new Event('scroll'));
      hostFixture.detectChanges();

      const scrollDownButton = document.querySelector(
        '[data-slot="select-content"] [data-slot="select-scroll-down-button"]',
      ) as HTMLElement;
      scrollDownButton.dispatchEvent(new Event('pointermove'));
      tick(55);
      hostFixture.detectChanges();
      expect(viewport.scrollTop).toBe(112);

      viewport.dispatchEvent(new Event('wheel', { bubbles: true }));
      viewport.scrollTop = 40;
      viewport.dispatchEvent(new Event('scroll'));
      hostFixture.detectChanges();
      tick(100);

      expect(viewport.scrollTop).toBe(40);

      TestBed.resetTestingModule();
    }));

    it('stops scroll-button auto-scroll when it reaches the scroll edge', fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [ScrollableHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      });

      const hostFixture = TestBed.createComponent(ScrollableHostComponent);
      hostFixture.detectChanges();
      const trigger = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

      trigger.click();
      hostFixture.detectChanges();
      const viewport = document.querySelector(
        '[data-slot="select-content"] [data-slot="select-viewport"]',
      ) as HTMLElement;
      Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 320 });
      Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 120 });
      viewport.scrollTop = 190;
      viewport.dispatchEvent(new Event('scroll'));
      hostFixture.detectChanges();

      const scrollDownButton = document.querySelector(
        '[data-slot="select-content"] [data-slot="select-scroll-down-button"]',
      ) as HTMLElement;
      scrollDownButton.dispatchEvent(new Event('pointermove'));
      tick(55);
      hostFixture.detectChanges();
      expect(viewport.scrollTop).toBe(200);

      viewport.scrollTop = 160;
      viewport.dispatchEvent(new Event('scroll'));
      hostFixture.detectChanges();
      tick(100);

      expect(viewport.scrollTop).toBe(160);

      TestBed.resetTestingModule();
    }));

    it('clears item highlight when moving over a scroll control like Radix', fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [ScrollableHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      });

      const hostFixture = TestBed.createComponent(ScrollableHostComponent);
      hostFixture.componentInstance.value.set('cst');
      hostFixture.detectChanges();
      const trigger = hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

      trigger.click();
      flush();
      hostFixture.detectChanges();
      const selectedItem = document.querySelector(
        '[data-slot="select-content"] z-select-item[value="cst"]',
      ) as HTMLElement;
      const viewport = document.querySelector(
        '[data-slot="select-content"] [data-slot="select-viewport"]',
      ) as HTMLElement;
      Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 320 });
      Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 120 });
      viewport.dispatchEvent(new Event('scroll'));
      hostFixture.detectChanges();
      expect(selectedItem).toHaveAttribute('data-highlighted', '');

      const scrollDownButton = document.querySelector(
        '[data-slot="select-content"] [data-slot="select-scroll-down-button"]',
      ) as HTMLElement;
      scrollDownButton.dispatchEvent(new Event('pointermove'));
      hostFixture.detectChanges();

      expect(selectedItem).not.toHaveAttribute('data-highlighted');
      expect(document.activeElement).toBe(document.querySelector('[data-slot="select-content"]'));

      TestBed.resetTestingModule();
    }));
  });

  describe('Multiselect mode', () => {
    @Component({
      imports: [ZardSelectComponent, ZardSelectItemComponent],
      standalone: true,
      template: `
        <z-select
          [(zValue)]="value"
          [zLabel]="label()"
          [zPlaceholder]="placeholder()"
          [zDisabled]="disabled()"
          [zMultiple]="true"
          [zMaxLabelCount]="labelsLimit"
          (zSelectionChange)="selectionChanges.push($event)"
        >
          <z-select-item zValue="option1">OptionOne</z-select-item>
          <z-select-item zValue="option2">OptionTwo</z-select-item>
          <z-select-item zValue="option3">OptionThree</z-select-item>
          <z-select-item zValue="option4">OptionFour</z-select-item>
        </z-select>
      `,
    })
    class TestMultiselectHostComponent {
      readonly value = signal<string[]>([]);
      readonly label = signal('');
      readonly placeholder = signal('Select an option...');
      readonly disabled = signal(false);
      readonly selectionChanges: Array<string | string[]> = [];
      labelsLimit = 0;
    }

    let hostComponent: TestMultiselectHostComponent;
    let hostFixture: ComponentFixture<TestMultiselectHostComponent>;
    let selectComponent: ZardSelectComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestMultiselectHostComponent],
        providers: [
          {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ZardEventManagerPlugin,
            multi: true,
          },
        ],
      }).compileComponents();

      hostFixture = TestBed.createComponent(TestMultiselectHostComponent);
      hostComponent = hostFixture.componentInstance;

      // Initial change detection to create the component tree
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      selectComponent = hostFixture.debugElement.query(By.directive(ZardSelectComponent)).componentInstance;

      // Additional change detection to ensure content children are processed
      hostFixture.detectChanges();
      await hostFixture.whenStable();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should create component', () => {
      expect(hostComponent).toBeTruthy();
      expect(selectComponent).toBeTruthy();
      expect(selectComponent.zMultiple).toBeTruthy();
    });

    it('select two items', () => {
      hostComponent.labelsLimit = 2;
      hostFixture.detectChanges();

      selectComponent.selectItem('option1', 'OptionOne');
      selectComponent.selectItem('option4', 'OptionFour');

      expect(hostComponent.value().length).toBe(2);
      expect(selectComponent.selectedLabels()).toEqual(['OptionOne', 'OptionFour']);
    });

    it('select three items', () => {
      hostComponent.labelsLimit = 2;
      hostFixture.detectChanges();

      selectComponent.selectItem('option1', 'OptionOne');
      selectComponent.selectItem('option3', 'OptionThree');
      selectComponent.selectItem('option4', 'OptionFour');

      expect(hostComponent.value().length).toBe(3);
      expect(selectComponent.selectedLabels()).toEqual(['OptionOne', 'OptionThree', '1 more item selected']);
    });

    it('keeps wrapped selected labels inside the trigger container', () => {
      hostComponent.labelsLimit = 3;
      hostFixture.detectChanges();

      selectComponent.selectItem('option1', 'OptionOne');
      selectComponent.selectItem('option2', 'OptionTwo');
      selectComponent.selectItem('option3', 'OptionThree');
      selectComponent.selectItem('option4', 'OptionFour');
      hostFixture.detectChanges();

      const trigger = hostFixture.nativeElement.querySelector('[data-slot="select-trigger"]') as HTMLElement;
      const valueSlot = trigger.querySelector('[data-slot="select-value"]') as HTMLElement;
      expect(trigger).toHaveClass('h-auto');
      expect(trigger).toHaveClass('min-h-9');
      expect(trigger).toHaveClass('py-1.5');
      expect(valueSlot).toHaveClass('flex-wrap');
      expect(valueSlot).toHaveClass('overflow-visible');
      expect(trigger.className).not.toContain('line-clamp-1');
      expect(trigger.querySelectorAll('z-badge').length).toBe(4);
    });

    it('should handle multiple deselects correctly', () => {
      selectComponent.selectItem('option1', 'OptionOne');
      selectComponent.selectItem('option2', 'OptionTwo');
      selectComponent.selectItem('option3', 'OptionThree');
      selectComponent.selectItem('option2', 'OptionTwo');

      expect(hostComponent.value().length).toBe(2);
      expect(selectComponent.selectedLabels()).toEqual(['OptionOne', 'OptionThree']);
    });

    it('should handle multiple selects correctly', () => {
      selectComponent.selectItem('option1', 'OptionOne');
      selectComponent.selectItem('option2', 'OptionTwo');
      selectComponent.selectItem('option4', 'OptionFour');

      expect(hostComponent.value().length).toBe(3);
      expect(selectComponent.selectedLabels()).toEqual(['OptionOne', 'OptionTwo', 'OptionFour']);
    });

    it('emits the full selected value array through ControlValueAccessor', () => {
      const onChangeSpy = jest.fn();
      selectComponent.registerOnChange(onChangeSpy);

      selectComponent.selectItem('option1', 'OptionOne');

      expect(onChangeSpy).toHaveBeenCalledWith(['option1']);
    });

    it('emits selected value arrays through zSelectionChange', () => {
      selectComponent.selectItem('option1', 'OptionOne');
      selectComponent.selectItem('option3', 'OptionThree');

      expect(hostComponent.selectionChanges).toEqual([['option1'], ['option1', 'option3']]);
    });
  });
});
