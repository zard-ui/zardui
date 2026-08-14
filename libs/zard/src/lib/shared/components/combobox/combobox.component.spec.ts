import { Component, signal } from '@angular/core';
import { type ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardComboboxComponent } from './combobox.component';
import { ZardComboboxImports } from './combobox.imports';
import type { ZardComboboxGroup, ZardComboboxOption } from './combobox.types';

const testOptions: ZardComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const testGroups: ZardComboboxGroup[] = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
    ],
  },
];

@Component({
  imports: [ZardComboboxComponent],
  template: `
    <z-combobox
      [options]="options()"
      [groups]="groups()"
      [value]="value()"
      [zDisabled]="disabled()"
      [searchable]="searchable()"
      [placeholder]="placeholder()"
      [ariaLabel]="ariaLabel()"
      (zValueChange)="valueChanges.push($event)"
      (zComboSelected)="selectedOptions.push($event)"
    />
  `,
})
class ShorthandHostComponent {
  readonly options = signal<ZardComboboxOption[]>(testOptions);
  readonly groups = signal<ZardComboboxGroup[]>([]);
  readonly value = signal<string | null>(null);
  readonly disabled = signal(false);
  readonly searchable = signal(true);
  readonly placeholder = signal('Select...');
  readonly ariaLabel = signal('');
  readonly valueChanges: Array<string | string[] | null> = [];
  readonly selectedOptions: ZardComboboxOption[] = [];
}

@Component({
  imports: [ZardComboboxImports],
  template: `
    <z-combobox
      [(zValue)]="value"
      [zMultiple]="multiple()"
      [zFilter]="filter()"
      [zFilterFn]="filterFn()"
      [zAutoHighlight]="autoHighlight()"
      [zInvalid]="invalid()"
      (zComboSelected)="selectedOptions.push($event)"
    >
      <z-combobox-input [zShowClear]="showClear()" placeholder="Search fruit..." />

      <z-combobox-content>
        <z-combobox-empty>No fruit found.</z-combobox-empty>

        <z-combobox-list>
          @for (option of options; track option.value) {
            <z-combobox-item [zValue]="option.value" [zDisabled]="option.disabled ?? false">
              {{ option.label }}
            </z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
})
class ComposableHostComponent {
  readonly value = signal<string | string[] | null>(null);
  readonly multiple = signal(false);
  readonly showClear = signal(false);
  readonly autoHighlight = signal(false);
  readonly invalid = signal(false);
  readonly filter = signal<'contains' | 'startsWith' | 'none'>('contains');
  readonly filterFn = signal<((label: string, query: string) => boolean) | null>(null);
  readonly selectedOptions: ZardComboboxOption[] = [];

  options: ZardComboboxOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry pie' },
    { value: 'durian', label: 'Durian', disabled: true },
  ];
}

@Component({
  imports: [ZardComboboxImports],
  template: `
    <z-combobox zMultiple [zInvalid]="invalid()" [(zValue)]="value">
      <z-combobox-chips>
        @for (selected of selectedValues(); track selected) {
          <z-combobox-chip [zValue]="selected">{{ selected }}</z-combobox-chip>
        }
        <input z-combobox-chips-input />
      </z-combobox-chips>

      <z-combobox-content>
        <z-combobox-list>
          @for (option of options; track option.value) {
            <z-combobox-item [zValue]="option.value">{{ option.label }}</z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
})
class ChipsHostComponent {
  readonly value = signal<string | string[] | null>(['apple']);
  readonly invalid = signal(false);
  options: ZardComboboxOption[] = testOptions;

  selectedValues(): string[] {
    const value = this.value();
    return Array.isArray(value) ? value : value ? [value] : [];
  }
}

@Component({
  imports: [ZardComboboxImports, ReactiveFormsModule],
  template: `
    <z-combobox [formControl]="control" [zMultiple]="multiple()">
      <z-combobox-input />

      <z-combobox-content>
        <z-combobox-list>
          @for (option of options; track option.value) {
            <z-combobox-item [zValue]="option.value">{{ option.label }}</z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
})
class FormHostComponent {
  readonly multiple = signal(false);
  control = new FormControl<string | string[] | null>(null);
  options: ZardComboboxOption[] = testOptions;
}

@Component({
  imports: [ZardButtonComponent, ZardComboboxImports],
  template: `
    <z-combobox [(zValue)]="value">
      <button type="button" z-button z-combobox-trigger zType="outline" class="w-64 justify-between">
        <z-combobox-value placeholder="Select a fruit" />
      </button>

      <z-combobox-content>
        <z-combobox-input [zShowTrigger]="false" placeholder="Search" />

        <z-combobox-list>
          @for (option of options; track option.value) {
            <z-combobox-item [zValue]="option.value">{{ option.label }}</z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
})
class PopupHostComponent {
  readonly value = signal<string | string[] | null>(null);
  options: ZardComboboxOption[] = testOptions;
}

@Component({
  imports: [ZardComboboxImports],
  template: `
    <z-combobox [(zValue)]="value">
      <z-combobox-input />

      <z-combobox-content>
        <z-combobox-list>
          @for (option of options; track option.value) {
            <z-combobox-item [zValue]="option.value" [zLabel]="option.label">
              <span>{{ option.label }}</span>
              <span>projected noise</span>
            </z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
})
class LabelledHostComponent {
  readonly value = signal<string | string[] | null>(null);
  options: ZardComboboxOption[] = testOptions;
}

function providers() {
  return [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZardEventManagerPlugin,
      multi: true,
    },
  ];
}

function itemElements(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('z-combobox-item'));
}

function visibleItemElements(): HTMLElement[] {
  return itemElements().filter(item => !item.hasAttribute('hidden'));
}

function popupElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-slot="combobox-content"]');
}

function comboboxOf<T>(fixture: ComponentFixture<T>): ZardComboboxComponent {
  return fixture.debugElement.children[0].componentInstance as ZardComboboxComponent;
}

function inputOf<T>(fixture: ComponentFixture<T>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input') as HTMLInputElement;
}

function hostElementOf<T>(fixture: ComponentFixture<T>): HTMLElement {
  return fixture.nativeElement.querySelector('z-combobox') as HTMLElement;
}

function pressKey<T>(fixture: ComponentFixture<T>, key: string): void {
  hostElementOf(fixture).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  fixture.detectChanges();
}

function typeInto<T>(fixture: ComponentFixture<T>, text: string): void {
  const input = inputOf(fixture);
  input.value = text;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  fixture.detectChanges();
}

describe('ZardComboboxComponent', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('shorthand mode', () => {
    let fixture: ComponentFixture<ShorthandHostComponent>;
    let host: ShorthandHostComponent;
    let combobox: ZardComboboxComponent;

    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({ imports: [ShorthandHostComponent], providers: providers() });
      fixture = TestBed.createComponent(ShorthandHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      combobox = comboboxOf(fixture);
    }));

    it('creates successfully', () => {
      expect(combobox).toBeTruthy();
    });

    it('renders an editable input instead of the legacy button', () => {
      const input = inputOf(fixture);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('placeholder', 'Select...');
      expect(fixture.nativeElement.querySelector('button[z-combobox-trigger]')).toBeInTheDocument();
    });

    it('renders the options coming from [options]', fakeAsync(() => {
      combobox.openPanel();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(itemElements()).toHaveLength(testOptions.length);
      expect(visibleItemElements()[0]).toHaveTextContent('Apple');
    }));

    it('renders grouped options coming from [groups]', fakeAsync(() => {
      host.groups.set(testGroups);
      host.options.set([]);
      fixture.detectChanges();
      flush();

      combobox.openPanel();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(itemElements()).toHaveLength(4);
      expect(document.querySelectorAll('z-combobox-group')).toHaveLength(2);
      expect(document.querySelectorAll('z-combobox-label')[0]).toHaveTextContent('Fruits');
    }));

    it('keeps accepting the legacy [value] input', () => {
      host.value.set('banana');
      fixture.detectChanges();

      expect(combobox.zValue()).toBe('banana');
      expect(inputOf(fixture).value).toBe('Banana');
    });

    it('exposes the legacy aria-label on the input', () => {
      host.ariaLabel.set('Choose your favorite fruit');
      fixture.detectChanges();

      expect(inputOf(fixture)).toHaveAttribute('aria-label', 'Choose your favorite fruit');
    });

    it('makes the input read-only when searchable is false', () => {
      host.searchable.set(false);
      fixture.detectChanges();

      expect(inputOf(fixture).readOnly).toBe(true);
    });

    it('emits zValueChange and zComboSelected on selection', fakeAsync(() => {
      combobox.openPanel();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      visibleItemElements()[1].click();
      fixture.detectChanges();
      flush();

      expect(host.valueChanges).toContain('banana');
      expect(host.selectedOptions).toEqual([{ value: 'banana', label: 'Banana' }]);
    }));
  });

  describe('composable mode', () => {
    let fixture: ComponentFixture<ComposableHostComponent>;
    let host: ComposableHostComponent;
    let combobox: ZardComboboxComponent;

    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({ imports: [ComposableHostComponent], providers: providers() });
      fixture = TestBed.createComponent(ComposableHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      combobox = comboboxOf(fixture);

      combobox.openPanel();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
    }));

    it('projects the content instead of rendering the default structure', () => {
      expect(itemElements()).toHaveLength(4);
      expect(document.querySelectorAll('z-combobox-empty')).toHaveLength(1);
      expect(popupElement()).toBeInTheDocument();
    });

    it('reads item labels from the projected text content', () => {
      expect(combobox.labelOf('cherry')).toBe('Cherry pie');
    });

    it('filters items with the default contains strategy', () => {
      typeInto(fixture, 'pie');

      expect(visibleItemElements()).toHaveLength(1);
      expect(visibleItemElements()[0]).toHaveTextContent('Cherry pie');
    });

    it('filters items with the startsWith strategy', () => {
      host.filter.set('startsWith');
      fixture.detectChanges();

      typeInto(fixture, 'ba');
      expect(visibleItemElements()).toHaveLength(1);

      typeInto(fixture, 'pie');
      expect(visibleItemElements()).toHaveLength(0);
    });

    it('filters items with a custom zFilterFn', () => {
      host.filterFn.set((label, query) => label.toLowerCase().endsWith(query.toLowerCase()));
      fixture.detectChanges();

      typeInto(fixture, 'na');

      expect(visibleItemElements()).toHaveLength(1);
      expect(visibleItemElements()[0]).toHaveTextContent('Banana');
    });

    it('shows the empty state when nothing matches', () => {
      typeInto(fixture, 'zzz');

      expect(visibleItemElements()).toHaveLength(0);
      expect(popupElement()).toHaveAttribute('data-empty');
    });

    it('selects a single value, closes the popup and emits the option', fakeAsync(() => {
      visibleItemElements()[0].click();
      fixture.detectChanges();
      flush();

      expect(host.value()).toBe('apple');
      expect(combobox.open()).toBe(false);
      expect(host.selectedOptions).toEqual([{ value: 'apple', label: 'Apple', disabled: false }]);
    }));

    it('clears the value when the selected item is picked again', fakeAsync(() => {
      visibleItemElements()[0].click();
      fixture.detectChanges();
      flush();

      combobox.openPanel();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      visibleItemElements()[0].click();
      fixture.detectChanges();
      flush();

      expect(host.value()).toBeNull();
    }));

    it('does not select a disabled item', fakeAsync(() => {
      const disabledItem = itemElements()[3];
      expect(disabledItem).toHaveAttribute('data-disabled');

      disabledItem.click();
      fixture.detectChanges();
      flush();

      expect(host.value()).toBeNull();
    }));

    it('keeps the popup open and accumulates values in multiple mode', fakeAsync(() => {
      host.multiple.set(true);
      fixture.detectChanges();
      flush();

      visibleItemElements()[0].click();
      fixture.detectChanges();
      visibleItemElements()[1].click();
      fixture.detectChanges();
      flush();

      expect(host.value()).toEqual(['apple', 'banana']);
      expect(combobox.open()).toBe(true);
    }));

    it('renders the clear button only when there is a value', fakeAsync(() => {
      host.showClear.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('button[z-combobox-clear]')).not.toBeInTheDocument();

      visibleItemElements()[0].click();
      fixture.detectChanges();
      flush();

      const clearButton = fixture.nativeElement.querySelector('button[z-combobox-clear]') as HTMLButtonElement;
      expect(clearButton).toBeInTheDocument();
      // The trigger hides through `group-has-data-[slot=combobox-clear]/input-group:hidden`,
      // so the clear button must keep its own data-slot even sharing the element with z-input-group-button.
      expect(clearButton).toHaveAttribute('data-slot', 'combobox-clear');

      clearButton.click();
      fixture.detectChanges();
      flush();

      expect(host.value()).toBeNull();
      expect(combobox.query()).toBe('');
    }));

    it('merges the input-group button and the combobox trigger styles on the same element', () => {
      const trigger = fixture.nativeElement.querySelector('button[z-combobox-trigger]') as HTMLElement;

      expect(trigger).toHaveAttribute('data-slot', 'combobox-trigger');
      expect(trigger).toHaveAttribute('data-size', 'icon-xs');
      expect(trigger).toHaveAttribute('tabindex', '-1');
      expect(trigger.className).toContain('size-6');
      expect(trigger.className).toContain('group-has-data-[slot=combobox-clear]/input-group:hidden');
      expect(trigger.className).toContain('aria-expanded:bg-transparent');
    });

    describe('zInvalid', () => {
      it('does not flag anything by default', () => {
        expect(hostElementOf(fixture)).not.toHaveAttribute('data-invalid');
        expect(inputOf(fixture)).not.toHaveAttribute('aria-invalid');
      });

      it('marks the root and the input as invalid', () => {
        host.invalid.set(true);
        fixture.detectChanges();

        expect(hostElementOf(fixture)).toHaveAttribute('data-invalid', '');
        expect(inputOf(fixture)).toHaveAttribute('aria-invalid', 'true');
      });
    });

    describe('zAutoHighlight', () => {
      it('highlights nothing while typing by default', () => {
        typeInto(fixture, 'a');

        expect(hostElementOf(fixture)).not.toHaveAttribute('data-auto-highlight');
        expect(itemElements().some(item => item.hasAttribute('data-highlighted'))).toBe(false);
      });

      it('does not select anything with Enter until an arrow key moved the highlight', fakeAsync(() => {
        typeInto(fixture, 'a');
        pressKey(fixture, 'Enter');
        flush();

        expect(host.value()).toBeNull();
        expect(combobox.open()).toBe(true);
      }));

      it('highlights the first selectable item while typing when enabled', () => {
        host.autoHighlight.set(true);
        fixture.detectChanges();

        typeInto(fixture, 'a');

        expect(hostElementOf(fixture)).toHaveAttribute('data-auto-highlight', '');
        expect(itemElements()[0]).toHaveAttribute('data-highlighted');
      });

      it('skips a disabled first match and highlights nothing when no item is selectable', () => {
        host.autoHighlight.set(true);
        fixture.detectChanges();

        typeInto(fixture, 'durian');

        expect(visibleItemElements()).toHaveLength(1);
        expect(itemElements()[3]).toHaveAttribute('data-disabled');
        expect(itemElements().some(item => item.hasAttribute('data-highlighted'))).toBe(false);
      });

      it('selects the highlighted item straight away with Enter', fakeAsync(() => {
        host.autoHighlight.set(true);
        fixture.detectChanges();

        typeInto(fixture, 'ban');
        pressKey(fixture, 'Enter');
        flush();

        expect(host.value()).toBe('banana');
      }));
    });

    it('exposes the expected ARIA contract', () => {
      const input = inputOf(fixture);
      const list = document.querySelector('z-combobox-list');

      expect(input).toHaveAttribute('role', 'combobox');
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input.getAttribute('aria-controls')).toBe(combobox.listboxId);
      expect(list).toHaveAttribute('role', 'listbox');
      expect(list).toHaveAttribute('id', combobox.listboxId);
      expect(itemElements()[0]).toHaveAttribute('role', 'option');
      expect(itemElements()[0]).toHaveAttribute('aria-selected', 'false');
    });

    describe('keyboard navigation', () => {
      it('highlights the next and previous item with the arrow keys', () => {
        pressKey(fixture, 'ArrowDown');
        expect(itemElements()[0]).toHaveAttribute('data-highlighted');
        expect(inputOf(fixture).getAttribute('aria-activedescendant')).toBe(itemElements()[0].id);

        pressKey(fixture, 'ArrowDown');
        expect(itemElements()[1]).toHaveAttribute('data-highlighted');

        pressKey(fixture, 'ArrowUp');
        expect(itemElements()[0]).toHaveAttribute('data-highlighted');
      });

      it('skips disabled items and wraps around', () => {
        pressKey(fixture, 'End');
        expect(itemElements()[2]).toHaveAttribute('data-highlighted');
        expect(itemElements()[3]).not.toHaveAttribute('data-highlighted');

        pressKey(fixture, 'ArrowDown');
        expect(itemElements()[0]).toHaveAttribute('data-highlighted');

        pressKey(fixture, 'Home');
        expect(itemElements()[0]).toHaveAttribute('data-highlighted');
      });

      it('selects the highlighted item with Enter', fakeAsync(() => {
        pressKey(fixture, 'ArrowDown');
        pressKey(fixture, 'Enter');
        flush();

        expect(host.value()).toBe('apple');
        expect(combobox.open()).toBe(false);
      }));

      it('closes with Escape and clears the value when already closed', fakeAsync(() => {
        pressKey(fixture, 'ArrowDown');
        pressKey(fixture, 'Enter');
        flush();
        fixture.detectChanges();

        expect(host.value()).toBe('apple');

        pressKey(fixture, 'Escape');
        flush();

        expect(host.value()).toBeNull();
      }));

      it('closes the popup on Tab', fakeAsync(() => {
        pressKey(fixture, 'Tab');
        flush();

        expect(combobox.open()).toBe(false);
      }));
    });
  });

  describe('chips (multiple mode)', () => {
    let fixture: ComponentFixture<ChipsHostComponent>;
    let host: ChipsHostComponent;

    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({ imports: [ChipsHostComponent], providers: providers() });
      fixture = TestBed.createComponent(ChipsHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
    }));

    it('renders one chip per selected value', () => {
      const chips = fixture.nativeElement.querySelectorAll('z-combobox-chip');
      expect(chips).toHaveLength(1);
      expect(chips[0]).toHaveTextContent('apple');
    });

    it('removes the value when the chip remove button is clicked', fakeAsync(() => {
      const removeButton = fixture.nativeElement.querySelector('button[z-combobox-chip-remove]') as HTMLButtonElement;
      expect(removeButton).toHaveAttribute('data-slot', 'combobox-chip-remove');
      expect(removeButton.className).toContain('opacity-50');
      expect(removeButton.className).toContain('size-6');

      removeButton.click();
      fixture.detectChanges();
      flush();

      expect(host.value()).toEqual([]);
      expect(fixture.nativeElement.querySelectorAll('z-combobox-chip')).toHaveLength(0);
    }));

    it('removes the last chip when Backspace is pressed on an empty input', fakeAsync(() => {
      const chipsInput = fixture.nativeElement.querySelector('input[z-combobox-chips-input]') as HTMLInputElement;
      chipsInput.value = '';
      chipsInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
      fixture.detectChanges();
      flush();

      expect(host.value()).toEqual([]);
    }));

    it('anchors the popup on the chips container', fakeAsync(() => {
      comboboxOf(fixture).openPanel();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(popupElement()).toHaveAttribute('data-chips', 'true');
    }));

    it('marks the chips input as invalid when zInvalid is set', () => {
      const chipsInput = fixture.nativeElement.querySelector('input[z-combobox-chips-input]') as HTMLInputElement;
      expect(chipsInput).not.toHaveAttribute('aria-invalid');

      host.invalid.set(true);
      fixture.detectChanges();

      expect(chipsInput).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('popup mode', () => {
    let fixture: ComponentFixture<PopupHostComponent>;
    let host: PopupHostComponent;
    let combobox: ZardComboboxComponent;

    function triggerElement(): HTMLButtonElement {
      return fixture.nativeElement.querySelector('button[z-combobox-trigger]') as HTMLButtonElement;
    }

    function popupInput(): HTMLInputElement | null {
      return document.querySelector<HTMLInputElement>('[data-slot="combobox-content"] input');
    }

    function openPopup(): void {
      triggerElement().click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
    }

    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({ imports: [PopupHostComponent], providers: providers() });
      fixture = TestBed.createComponent(PopupHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      combobox = comboboxOf(fixture);
    }));

    it('keeps a standalone trigger in the tab order and drops the input-group only classes', () => {
      const trigger = triggerElement();

      expect(trigger).toHaveAttribute('tabindex', '0');
      expect(trigger.className).not.toContain('group-has-data-[slot=combobox-clear]/input-group:hidden');
      expect(trigger.className).not.toContain('aria-expanded:bg-transparent');
    });

    it('anchors the popup on the trigger', () => {
      expect(combobox.anchorElement()).toBe(triggerElement());
    });

    it('renders the placeholder of the value while there is no selection', () => {
      const value = fixture.nativeElement.querySelector('z-combobox-value') as HTMLElement;

      expect(value).toHaveAttribute('data-placeholder', '');
      expect(value).toHaveTextContent('Select a fruit');
    });

    it('opens on click and focuses the search input rendered inside the popup', fakeAsync(() => {
      openPopup();

      expect(combobox.open()).toBe(true);
      expect(popupInput()).toBeInTheDocument();
      expect(document.activeElement === popupInput()).toBe(true);
    }));

    it('closes with Escape and gives the focus back to the trigger', fakeAsync(() => {
      openPopup();

      popupInput()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(combobox.open()).toBe(false);
      expect(document.activeElement === triggerElement()).toBe(true);
    }));

    it('keeps the selected label on the trigger once the popup is gone', fakeAsync(() => {
      openPopup();

      visibleItemElements()[1].click();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      const value = fixture.nativeElement.querySelector('z-combobox-value') as HTMLElement;

      expect(host.value()).toBe('banana');
      expect(combobox.open()).toBe(false);
      expect(value).not.toHaveAttribute('data-placeholder');
      expect(value).toHaveTextContent('Banana');
    }));

    it('focuses the search input again when the popup is reopened', fakeAsync(() => {
      openPopup();

      popupInput()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      openPopup();

      expect(combobox.open()).toBe(true);
      expect(document.activeElement === popupInput()).toBe(true);
    }));
  });

  describe('items with zLabel', () => {
    let fixture: ComponentFixture<LabelledHostComponent>;
    let combobox: ZardComboboxComponent;

    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({ imports: [LabelledHostComponent], providers: providers() });
      fixture = TestBed.createComponent(LabelledHostComponent);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      combobox = comboboxOf(fixture);

      combobox.openPanel();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
    }));

    it('filters on zLabel instead of the projected text content', () => {
      expect(combobox.labelOf('apple')).toBe('Apple');

      typeInto(fixture, 'noise');
      expect(visibleItemElements()).toHaveLength(0);

      typeInto(fixture, 'appl');
      expect(visibleItemElements()).toHaveLength(1);
      expect(visibleItemElements()[0]).toHaveAttribute('data-value', 'apple');
    });
  });

  describe('ControlValueAccessor', () => {
    let fixture: ComponentFixture<FormHostComponent>;
    let host: FormHostComponent;
    let combobox: ZardComboboxComponent;

    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({ imports: [FormHostComponent], providers: providers() });
      fixture = TestBed.createComponent(FormHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      combobox = comboboxOf(fixture);
    }));

    it('writes the value coming from the form control', () => {
      host.control.setValue('cherry');
      fixture.detectChanges();

      expect(combobox.zValue()).toBe('cherry');
      expect(inputOf(fixture).value).toBe('Cherry');
    });

    it('propagates the selection back to the form control', fakeAsync(() => {
      combobox.openPanel();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      visibleItemElements()[0].click();
      fixture.detectChanges();
      flush();

      expect(host.control.value).toBe('apple');
    }));

    it('registers onChange and onTouched callbacks', fakeAsync(() => {
      const onChange = jest.fn();
      const onTouched = jest.fn();
      combobox.registerOnChange(onChange);
      combobox.registerOnTouched(onTouched);

      combobox.openPanel();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      visibleItemElements()[0].click();
      fixture.detectChanges();
      flush();

      expect(onChange).toHaveBeenCalledWith('apple');

      combobox.markAsTouched();
      expect(onTouched).toHaveBeenCalled();
    }));

    it('stores an array when zMultiple is enabled', fakeAsync(() => {
      host.multiple.set(true);
      fixture.detectChanges();
      flush();

      host.control.setValue(['apple', 'banana']);
      fixture.detectChanges();

      expect(combobox.zValue()).toEqual(['apple', 'banana']);

      combobox.writeValue('cherry');
      fixture.detectChanges();

      expect(combobox.zValue()).toEqual(['cherry']);
    }));

    it('disables the combobox through setDisabledState', fakeAsync(() => {
      host.control.disable();
      fixture.detectChanges();
      flush();

      expect(combobox.disabled()).toBe(true);
      expect(inputOf(fixture).disabled).toBe(true);

      combobox.openPanel();
      fixture.detectChanges();
      expect(combobox.open()).toBe(false);

      host.control.enable();
      fixture.detectChanges();
      flush();

      expect(combobox.disabled()).toBe(false);
      expect(inputOf(fixture).disabled).toBe(false);
    }));
  });
});
