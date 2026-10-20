import { Component, PLATFORM_ID, signal } from '@angular/core';
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

/** jsdom has no PointerEvent; the handlers only read the fields a MouseEvent also has. */
const pointer = (element: HTMLElement, type: string, clientX: number) =>
  element.dispatchEvent(new MouseEvent(type, { clientX, clientY: 0, button: 0, bubbles: true }));

type EyeDropperWindow = Window & { EyeDropper?: unknown };

describe('ZardColorPickerComponent', () => {
  let component: ZardColorPickerComponent;
  let fixture: ComponentFixture<ZardColorPickerComponent>;
  let emitted: string[];
  let committed: string[];

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

  const create = () => {
    fixture = TestBed.createComponent(ZardColorPickerComponent);
    component = fixture.componentInstance;
    emitted = [];
    committed = [];
    component.zColorChange.subscribe(value => emitted.push(value));
    component.zColorCommit.subscribe(value => committed.push(value));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ZardColorPickerComponent], providers }).compileComponents();
    create();
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

    it('should show zPlaceholder while empty', () => {
      setInput('zShowValue', true);
      setInput('zPlaceholder', 'Escolha uma cor');

      expect(trigger().textContent?.trim()).toBe('Escolha uma cor');
    });

    it('should paint the swatch with the value', () => {
      setInput('value', '#ff0000');

      expect(host().hasAttribute('data-empty')).toBe(false);
      expect(swatchFill()?.style.backgroundColor).toBe('rgba(255, 0, 0, 1)');
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

    it('should close the panel and leave keys alone when disabled while open', async () => {
      setInput('value', '#ff0000');
      await open();
      const hue = overlay('[data-slot="color-picker-hue"]') as HTMLElement;

      setInput('disabled', true);
      await fixture.whenStable();
      // The panel closes after the render that disabled it; the trigger reflects that on the next one.
      fixture.detectChanges();
      expect(isOpen()).toBe(false);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true });
      hue.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
      expect(emitted).toEqual([]);
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

    it('should move brightness by 10 with PageUp / PageDown', () => {
      const area = overlay('[data-slot="color-picker-area"]') as HTMLElement;

      press(area, 'PageDown');
      fixture.detectChanges();
      expect(area.getAttribute('aria-valuetext')).toBe('Saturation 100%, brightness 90%');
      expect(area.getAttribute('aria-roledescription')).toBe('2D slider');
    });

    it.each(['altKey', 'ctrlKey', 'metaKey'])('should leave %s shortcuts to the browser', modifier => {
      const hue = overlay('[data-slot="color-picker-hue"]') as HTMLElement;
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        [modifier]: true,
        bubbles: true,
        cancelable: true,
      });

      hue.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
      expect(emitted).toEqual([]);
    });

    it('should commit every key press', () => {
      const hue = overlay('[data-slot="color-picker-hue"]') as HTMLElement;

      press(hue, 'ArrowRight');
      press(hue, 'ArrowRight');

      expect(committed).toEqual(emitted);
      expect(committed.length).toBe(2);
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

  describe('pointer', () => {
    const hue = () => {
      const element = overlay('[data-slot="color-picker-hue"]') as HTMLElement;
      jest
        .spyOn(element, 'getBoundingClientRect')
        .mockReturnValue({ left: 0, top: 0, width: 360, height: 12 } as DOMRect);
      return element;
    };

    beforeEach(async () => {
      setInput('value', '#ff0000');
      await open();
    });

    it('should coalesce moves into one update per frame and commit once on release', () => {
      const track = hue();

      pointer(track, 'pointerdown', 120);
      pointer(track, 'pointermove', 180);
      pointer(track, 'pointermove', 240);
      expect(emitted).toEqual(['#00ff00']);
      expect(committed).toEqual([]);

      pointer(track, 'pointerup', 240);
      expect(emitted).toEqual(['#00ff00', '#0000ff']);
      expect(committed).toEqual(['#0000ff']);
    });

    it('should not commit a drag that ends where it started', () => {
      const track = hue();

      pointer(track, 'pointerdown', 120);
      pointer(track, 'pointermove', 0);
      pointer(track, 'pointerup', 0);

      expect(component.value()).toBe('#ff0000');
      expect(committed).toEqual([]);
    });

    it('should measure the track again when the page scrolls mid-drag', () => {
      const track = hue();
      pointer(track, 'pointerdown', 0);

      // The overlay follows the scroll, so the track now starts 120px further right.
      jest
        .spyOn(track, 'getBoundingClientRect')
        .mockReturnValue({ left: 120, top: 0, width: 360, height: 12 } as DOMRect);
      pointer(track, 'pointermove', 360);
      pointer(track, 'pointerup', 360);

      expect(component.value()).toBe('#0000ff');
    });

    it('should mark the panel as dragging and the dragged thumb as active until release', () => {
      const track = hue();
      const panel = () => overlay('z-popover') as HTMLElement;
      const thumb = () => track.querySelector('span') as HTMLElement;
      const areaThumb = () => overlay('[data-slot="color-picker-area"] span') as HTMLElement;

      pointer(track, 'pointerdown', 120);
      fixture.detectChanges();
      expect(panel().hasAttribute('data-dragging')).toBe(true);
      expect(swatchFill()?.hasAttribute('data-dragging')).toBe(true);
      expect(thumb().hasAttribute('data-active')).toBe(true);
      expect(areaThumb().hasAttribute('data-active')).toBe(false);

      pointer(track, 'pointerup', 120);
      fixture.detectChanges();
      expect(panel().hasAttribute('data-dragging')).toBe(false);
      expect(thumb().hasAttribute('data-active')).toBe(false);
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

    it('should commit once when Enter is followed by a change event', () => {
      overlay('[data-slot="color-picker-format"] button:nth-of-type(3)')?.click();
      fixture.detectChanges();

      // Chrome fires `change` after a handled Enter, reading the rounded HSL the field now shows.
      field().value = '#123456';
      field().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      field().dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(field().value).toBe('hsl(210, 65%, 20%)');
      expect(component.value()).toBe('#123456');
      expect(emitted).toEqual(['#123456']);
    });

    it('should keep the hue when a gray is typed', () => {
      type('#00ff00');
      type('#000');

      expect(overlay('[data-slot="color-picker-hue"]')?.getAttribute('aria-valuenow')).toBe('120');
    });

    const tabs = () =>
      Array.from(
        document.querySelectorAll<HTMLButtonElement>('.cdk-overlay-container [data-slot="color-picker-format"] button'),
      );
    const pickTab = (label: string) => {
      tabs()
        .find(tab => tab.textContent?.trim() === label)
        ?.click();
      fixture.detectChanges();
    };
    const pressedTab = () =>
      tabs()
        .find(tab => tab.getAttribute('aria-pressed') === 'true')
        ?.textContent?.trim();

    it('should offer every format as a tab, starting at zFormat', () => {
      expect(overlay('[data-slot="color-picker-format"]')?.getAttribute('role')).toBe('group');
      expect(tabs().map(tab => tab.textContent?.trim())).toEqual(['HEX', 'RGB', 'HSL', 'OKLCH']);
      expect(pressedTab()).toBe('HEX');
    });

    it('should slide the indicator under the active tab', () => {
      const indicator = () => overlay('[data-slot="color-picker-format-indicator"]') as HTMLElement;
      expect(indicator().style.transform).toBe('translateX(0%)');

      pickTab('HSL');
      expect(indicator().style.transform).toBe('translateX(200%)');

      pickTab('OKLCH');
      expect(indicator().style.transform).toBe('translateX(300%)');
    });

    it('should switch the text format without changing the value', () => {
      pickTab('RGB');
      expect(pressedTab()).toBe('RGB');
      expect(field().value).toBe('rgb(255, 0, 0)');

      pickTab('HSL');
      expect(field().value).toBe('hsl(0, 100%, 50%)');
      expect(emitted).toEqual([]);

      type('hsl(120, 100%, 50%)');
      expect(component.value()).toBe('#00ff00');
      expect(field().value).toBe('hsl(120, 100%, 50%)');
    });

    it('should show OKLCH and keep it selected when clicked again', () => {
      pickTab('OKLCH');
      pickTab('OKLCH');
      expect(pressedTab()).toBe('OKLCH');
      expect(field().value).toBe('oklch(0.628 0.25768 29.23)');

      pickTab('HEX');
      expect(field().value).toBe('#ff0000');
    });

    it('should emit OKLCH with zFormat="oklch"', () => {
      setInput('zFormat', 'oklch');
      type('#0000ff');

      expect(component.value()).toBe('oklch(0.452 0.31321 264.05)');
      expect(field().value).toBe('oklch(0.452 0.31321 264.05)');
    });

    it('should hide the format toggle with zShowFormatToggle off', () => {
      setInput('zShowFormatToggle', false);

      expect(overlay('[data-slot="color-picker-format"]')).toBeNull();
    });
  });

  describe('eyedropper', () => {
    afterEach(() => {
      delete (window as EyeDropperWindow).EyeDropper;
    });

    it('should not render without browser support', async () => {
      await open();

      expect(overlay('[data-slot="color-picker-eyedropper"]')).toBeNull();
    });

    it('should commit the color picked from the screen', async () => {
      (window as EyeDropperWindow).EyeDropper = class {
        open = () => Promise.resolve({ sRGBHex: '#123456' });
      };
      create();
      await open();

      overlay('[data-slot="color-picker-eyedropper"]')?.click();
      await fixture.whenStable();

      expect(component.value()).toBe('#123456');
      expect(committed).toEqual(['#123456']);
    });

    it('should ignore a dismissed eyedropper', async () => {
      (window as EyeDropperWindow).EyeDropper = class {
        // A native async rejection, like the real API; zone.js would flag a patched `Promise.reject` as unhandled.
        open = async () => {
          throw new DOMException('Canceled', 'AbortError');
        };
      };
      create();
      setInput('value', '#ff0000');
      await open();

      overlay('[data-slot="color-picker-eyedropper"]')?.click();
      await fixture.whenStable();

      expect(component.value()).toBe('#ff0000');
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

    it('should mark the matching preset when an outside value carries alpha that zAlpha drops', () => {
      setInput('value', '#2563eb80');

      expect(presets().map(button => button.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
    });

    it('should render duplicated presets', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation();
      const error = jest.spyOn(console, 'error').mockImplementation();

      setInput('zPresets', ['#2563eb', '#2563eb']);

      expect(presets().length).toBe(2);
      expect(warn).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
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

  it('should show a value written back after a different one', async () => {
    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();

    document
      .querySelector<HTMLButtonElement>('.cdk-overlay-container [data-slot="color-picker-presets"] button')
      ?.click();
    fixture.detectChanges();

    const { control } = fixture.componentInstance;
    control.setValue('#00ff00');
    fixture.detectChanges();
    control.setValue('hsl(240, 100%, 50%)');
    fixture.detectChanges();

    expect(trigger().getAttribute('aria-label')).toBe('Choose color, hsl(240, 100%, 50%)');
  });

  it('should disable the trigger with the control', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    expect(trigger().disabled).toBe(true);
  });
});

describe('ZardColorPickerComponent on the server', () => {
  it('should read named colors without a browser, so the server renders what the client hydrates', async () => {
    await TestBed.configureTestingModule({
      imports: [ZardColorPickerComponent],
      providers: [...providers, { provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();

    const fixture = TestBed.createComponent(ZardColorPickerComponent);
    fixture.componentRef.setInput('value', 'rebeccapurple');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.hasAttribute('data-empty')).toBe(false);
    expect(host.querySelector('button')?.getAttribute('aria-label')).toBe('Choose color, #663399');
  });
});
