import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardColorPickerComponent } from './color-picker.component';

const providers = [{ provide: EVENT_MANAGER_PLUGINS, useClass: ZardEventManagerPlugin, multi: true }];

/** The popover renders into the overlay container, outside the fixture. */
const overlay = (selector: string) => document.querySelector<HTMLElement>(`.cdk-overlay-container ${selector}`);

const press = (element: HTMLElement, key: string, shiftKey = false) =>
  element.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }));

describe('ZardColorPickerComponent', () => {
  let component: ZardColorPickerComponent;
  let fixture: ComponentFixture<ZardColorPickerComponent>;
  let emitted: string[];

  const host = () => fixture.nativeElement as HTMLElement;
  const trigger = () => host().querySelector('button') as HTMLButtonElement;
  const swatchFill = () => host().querySelector<HTMLElement>('[data-slot="color-picker-swatch"] span');
  const isOpen = () => trigger().getAttribute('aria-expanded') === 'true';

  const setInput = (name: string, value: unknown) => {
    fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
  };

  const open = async () => {
    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ZardColorPickerComponent], providers }).compileComponents();

    fixture = TestBed.createComponent(ZardColorPickerComponent);
    component = fixture.componentInstance;
    emitted = [];
    component.zColorChange.subscribe(value => emitted.push(value));
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelector('.cdk-overlay-container')?.replaceChildren();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(host().getAttribute('data-slot')).toBe('color-picker');
  });

  describe('trigger', () => {
    it('should be empty with no value', () => {
      expect(host().getAttribute('data-empty')).toBe('true');
      expect(swatchFill()).toBeNull();
      expect(trigger().getAttribute('aria-label')).toBe('Choose color, Pick a color');
    });

    it('should paint the swatch with the value', () => {
      setInput('value', '#ff0000');

      expect(host().hasAttribute('data-empty')).toBe(false);
      expect(swatchFill()?.style.background).toBe('rgba(255, 0, 0, 1)');
      expect(trigger().getAttribute('aria-label')).toBe('Choose color, #ff0000');
    });

    it('should only show the value text with zShowValue', () => {
      setInput('value', '#2563eb');
      expect(trigger().textContent?.trim()).toBe('');

      setInput('zShowValue', true);
      expect(trigger().textContent?.trim()).toBe('#2563eb');
    });

    it('should render the value in zFormat', () => {
      setInput('zShowValue', true);
      setInput('value', '#2563eb');
      setInput('zFormat', 'rgb');

      expect(trigger().textContent?.trim()).toBe('rgb(37, 99, 235)');
    });

    it('should leave the accessible name to the label when zId is set', () => {
      setInput('zId', 'brand');

      expect(trigger().id).toBe('brand');
      expect(trigger().hasAttribute('aria-label')).toBe(false);
    });

    it('should use the icon button size without the value text, and the regular one with it', () => {
      setInput('zSize', 'sm');
      expect(trigger().className).toContain('size-7');

      setInput('zShowValue', true);
      expect(trigger().className).toContain('h-7');
      expect(trigger().className).not.toContain('size-7');
    });
  });

  describe('panel', () => {
    it('should open with the area and hue, without alpha by default', async () => {
      await open();

      expect(isOpen()).toBe(true);
      expect(overlay('[data-slot="color-picker-area"]')).not.toBeNull();
      expect(overlay('[data-slot="color-picker-hue"]')).not.toBeNull();
      expect(overlay('[data-slot="color-picker-alpha"]')).toBeNull();
      expect(overlay('[data-slot="color-picker-presets"]')).toBeNull();
    });

    it('should show the alpha slider with zAlpha', async () => {
      setInput('zAlpha', true);
      await open();

      expect(overlay('[data-slot="color-picker-alpha"]')).not.toBeNull();
    });

    it('should expose the sliders to assistive tech', async () => {
      setInput('value', 'hsl(200, 100%, 50%)');
      await open();

      const hue = overlay('[data-slot="color-picker-hue"]') as HTMLElement;
      expect(hue.getAttribute('role')).toBe('slider');
      expect(hue.getAttribute('aria-valuenow')).toBe('200');
      expect(hue.getAttribute('aria-valuetext')).toBe('200 degrees');
      expect(overlay('[data-slot="color-picker-area"]')?.getAttribute('aria-valuetext')).toBe(
        'Saturation 100%, brightness 100%',
      );
    });

    it('should disable the trigger', () => {
      setInput('disabled', true);

      expect(trigger().disabled).toBe(true);
    });
  });

  describe('keyboard', () => {
    beforeEach(async () => {
      setInput('value', '#ff0000');
      await open();
    });

    it('should move the hue by 1 with arrows and by 10 with Shift', () => {
      const hue = overlay('[data-slot="color-picker-hue"]') as HTMLElement;

      press(hue, 'ArrowRight');
      fixture.detectChanges();
      expect(hue.getAttribute('aria-valuenow')).toBe('1');

      press(hue, 'ArrowRight', true);
      fixture.detectChanges();
      expect(hue.getAttribute('aria-valuenow')).toBe('11');

      press(hue, 'Home');
      fixture.detectChanges();
      expect(component.value()).toBe('#ff0000');
      expect(emitted.length).toBe(3);
    });

    it('should move saturation and brightness in the area', () => {
      const area = overlay('[data-slot="color-picker-area"]') as HTMLElement;

      press(area, 'ArrowDown', true);
      fixture.detectChanges();
      expect(area.getAttribute('aria-valuetext')).toBe('Saturation 100%, brightness 90%');

      press(area, 'ArrowLeft', true);
      fixture.detectChanges();
      expect(area.getAttribute('aria-valuetext')).toBe('Saturation 90%, brightness 90%');
      expect(component.value()).toBe('#e61717');
    });

    it('should keep the hue when the color passes through black', () => {
      const hue = overlay('[data-slot="color-picker-hue"]') as HTMLElement;
      const area = overlay('[data-slot="color-picker-area"]') as HTMLElement;

      press(hue, 'ArrowRight', true);
      for (let i = 0; i < 10; i++) {
        press(area, 'ArrowDown', true);
      }
      press(area, 'ArrowUp', true);
      fixture.detectChanges();

      expect(hue.getAttribute('aria-valuenow')).toBe('10');
    });

    it('should change alpha only with zAlpha', () => {
      setInput('zAlpha', true);
      const alpha = overlay('[data-slot="color-picker-alpha"]') as HTMLElement;

      press(alpha, 'ArrowLeft', true);
      fixture.detectChanges();

      expect(component.value()).toBe('#ff0000e6');
    });
  });

  describe('text field', () => {
    const field = () => overlay('input[aria-label="Color value"]') as HTMLInputElement;
    const type = (text: string) => {
      field().value = text;
      field().dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };

    beforeEach(async () => {
      setInput('value', '#ff0000');
      await open();
    });

    it('should commit a valid color in zFormat', () => {
      type('rgb(0, 128, 0)');

      expect(component.value()).toBe('#008000');
      expect(field().value).toBe('#008000');
      expect(emitted).toEqual(['#008000']);
    });

    it('should revert invalid input', () => {
      type('banana!');

      expect(component.value()).toBe('#ff0000');
      expect(field().value).toBe('#ff0000');
      expect(emitted).toEqual([]);
    });
  });

  describe('presets', () => {
    beforeEach(async () => {
      setInput('zPresets', ['#0f172a', '#2563eb', 'not-a-color']);
      setInput('value', '#2563eb');
      await open();
    });

    const presets = () =>
      Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          '.cdk-overlay-container [data-slot="color-picker-presets"] button',
        ),
      );

    it('should render valid presets only and mark the active one', () => {
      expect(presets().map(button => button.getAttribute('aria-label'))).toEqual(['#0f172a', '#2563eb']);
      expect(presets().map(button => button.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
    });

    it('should set the value on click and keep the panel open', () => {
      presets()[0].click();
      fixture.detectChanges();

      expect(component.value()).toBe('#0f172a');
      expect(emitted).toEqual(['#0f172a']);
      expect(isOpen()).toBe(true);
    });
  });
});

@Component({
  imports: [ZardColorPickerComponent, ReactiveFormsModule],
  template: `
    <z-color-picker [formControl]="control" zFormat="hsl" [zPresets]="presets()" />
  `,
})
class FormHostComponent {
  readonly control = new FormControl<string | null>('#ff0000');
  readonly presets = signal(['#0000ff']);
}

describe('ZardColorPickerComponent with forms', () => {
  let fixture: ComponentFixture<FormHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FormHostComponent], providers }).compileComponents();
    fixture = TestBed.createComponent(FormHostComponent);
    fixture.detectChanges();
  });

  const trigger = () => (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;

  afterEach(() => {
    document.querySelector('.cdk-overlay-container')?.replaceChildren();
  });

  it('should write the control value to the trigger', () => {
    expect(trigger().getAttribute('aria-label')).toBe('Choose color, hsl(0, 100%, 50%)');

    fixture.componentInstance.control.setValue('#00ff00');
    fixture.detectChanges();
    expect(trigger().getAttribute('aria-label')).toBe('Choose color, hsl(120, 100%, 50%)');
  });

  it('should push picks to the control and mark it touched on close', async () => {
    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();

    document
      .querySelector<HTMLButtonElement>('.cdk-overlay-container [data-slot="color-picker-presets"] button')
      ?.click();
    fixture.detectChanges();

    const { control } = fixture.componentInstance;
    expect(control.value).toBe('hsl(240, 100%, 50%)');
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(false);

    trigger().click();
    fixture.detectChanges();
    expect(control.touched).toBe(true);
  });

  it('should disable the trigger with the control', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    expect(trigger().disabled).toBe(true);
  });
});
