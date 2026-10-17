import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardMapStyleService } from '@/shared/components/map/map-style.service';
import { ZARD_MAP_PRESETS } from '@/shared/components/map/map-styles';
import { ZardEventManagerPlugin } from '@/shared/core/provider/event-manager-plugins/zard-event-manager-plugin';

import { ZardMapStyleSelectComponent } from './map-style-select.component';

describe('ZardMapStyleSelectComponent', () => {
  const setup = () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [ZardMapStyleSelectComponent],
      providers: [{ provide: EVENT_MANAGER_PLUGINS, useClass: ZardEventManagerPlugin, multi: true }],
    });

    const fixture = TestBed.createComponent(ZardMapStyleSelectComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const service = TestBed.inject(ZardMapStyleService);
    const overlay = () => TestBed.inject(OverlayContainer).getContainerElement();
    const trigger = () => host.querySelector<HTMLButtonElement>('button[data-slot="popover-trigger"]')!;
    const open = () => {
      trigger().click();
      fixture.detectChanges();
    };
    const option = (id: string) => {
      const index = ZARD_MAP_PRESETS.findIndex(preset => preset.id === id);
      return overlay().querySelectorAll<HTMLButtonElement>('[role="radio"]')[index];
    };
    const pick = (id: string) => {
      option(id).click();
      fixture.detectChanges();
    };

    return { fixture, host, service, overlay, trigger, open, option, pick };
  };

  afterEach(() => {
    TestBed.inject(OverlayContainer).ngOnDestroy();
  });

  it('shows the style in use on the trigger, with its provider since two providers ship a Positron', () => {
    const { trigger, service, fixture } = setup();

    expect(trigger().textContent).toContain('Map style');
    expect(trigger().textContent).toContain('Carto · Positron');
    expect(trigger().querySelector('svg')).not.toBeNull();
    expect(trigger().getAttribute('aria-label')).toBe('Map style, current: Carto · Positron');

    service.select('openfreemap-positron');
    fixture.detectChanges();

    expect(trigger().textContent).toContain('OpenFreeMap · Positron');
  });

  it('lists every preset as a radio in a labelled radiogroup, with the one in use checked', () => {
    const { open, overlay, option } = setup();
    open();

    const group = overlay().querySelector('[role="radiogroup"]');
    expect(group?.getAttribute('aria-label')).toBe('Map style');
    expect(overlay().querySelectorAll('[role="radio"]').length).toBe(ZARD_MAP_PRESETS.length);
    expect(option('carto-positron').getAttribute('aria-checked')).toBe('true');
    expect(option('carto-positron').textContent).toContain('Default');
    expect(option('carto-voyager').getAttribute('aria-checked')).toBe('false');
  });

  it('says how each preset is served and whether it needs a key', () => {
    const { open, option } = setup();
    open();

    expect(option('carto-positron').textContent).toContain('Vector · No key needed');
    expect(option('osm-raster').textContent).toContain('Raster · Dev only');
    expect(option('maptiler-streets').textContent).toContain('Vector · API key');
  });

  it('paints a mini-map swatch per preset with its own palette', () => {
    const { open, option } = setup();
    open();

    const swatch = option('maptiler-streets').querySelector<HTMLElement>('[data-slot="map-style-swatch"]')!;
    expect(swatch.querySelector('svg')).not.toBeNull();
    expect(swatch.style.getPropertyValue('--l-water')).toBe('#9ec7ef');
    expect(swatch.style.getPropertyValue('--d-land')).toBe('#1f242b');
  });

  it('switches the basemap of every map when a keyless preset is picked, and closes', () => {
    const { service, open, pick, overlay, fixture } = setup();
    open();

    pick('openfreemap-liberty');

    expect(service.presetId()).toBe('openfreemap-liberty');
    expect(overlay().querySelector('[data-slot="popover-content"]')?.getAttribute('data-closed')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('button')?.textContent).toContain('OpenFreeMap · Liberty');
  });

  it('asks for the key inside the popover for a key-based preset, and changes nothing until it arrives', () => {
    const { service, open, pick, overlay } = setup();
    open();

    pick('maptiler-streets');

    expect(service.presetId()).toBe('carto-positron');
    expect(overlay().querySelector('input[type="password"]')).not.toBeNull();
    expect(overlay().textContent).toContain('MapTiler API key');
  });

  it('applies the key, then hides the prompt', () => {
    const { fixture, service, open, pick, overlay } = setup();
    open();
    pick('maptiler-streets');

    const input = overlay().querySelector<HTMLInputElement>('input[type="password"]')!;
    input.value = 'my-key';
    overlay()
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();

    expect(service.presetId()).toBe('maptiler-streets');
    expect(service.styles().light).toContain('key=my-key');
    expect(overlay().querySelector('form')).toBeNull();
  });

  it('refuses an empty key and flags the field as invalid', () => {
    const { fixture, service, open, pick, overlay } = setup();
    open();
    pick('stadia-outdoors');

    overlay()
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();

    expect(service.presetId()).toBe('carto-positron');
    expect(overlay().querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('cancels the prompt without touching the maps', () => {
    const { fixture, service, open, pick, overlay } = setup();
    open();
    pick('maptiler-dataviz');

    const cancel = Array.from(overlay().querySelectorAll('button')).find(
      button => button.textContent?.trim() === 'Cancel',
    );
    cancel!.click();
    fixture.detectChanges();

    expect(overlay().querySelector('form')).toBeNull();
    expect(service.presetId()).toBe('carto-positron');
  });

  it('emits the preset in use after a pick', () => {
    const { fixture, open, pick } = setup();
    const emitted: string[] = [];
    fixture.componentInstance.zStyleChange.subscribe(preset => emitted.push(preset.id));
    open();

    pick('carto-voyager');

    expect(emitted).toEqual(['carto-voyager']);
  });
});
