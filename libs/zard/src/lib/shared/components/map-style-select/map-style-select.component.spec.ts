import { TestBed } from '@angular/core/testing';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardMapStyleService } from '@/shared/components/map/map-style.service';
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
    const pick = (id: string) => {
      (fixture.componentInstance as unknown as { onSelect(value: string): void }).onSelect(id);
      fixture.detectChanges();
    };

    return { fixture, host, service, pick };
  };

  it('is a labelled group', () => {
    const { host } = setup();

    expect(host.getAttribute('role')).toBe('group');
    expect(host.getAttribute('aria-label')).toBe('Map style');
  });

  it('names the preset in use with its provider, since two providers ship a Positron', () => {
    const { host, service, fixture } = setup();
    expect(host.querySelector('[data-slot="select-trigger"], button')?.textContent).toContain('Carto · Positron');

    service.select('openfreemap-positron');
    fixture.detectChanges();

    expect(host.querySelector('button')?.textContent).toContain('OpenFreeMap · Positron');
  });

  it('switches the basemap of every map when a keyless preset is picked', () => {
    const { service, pick } = setup();

    pick('openfreemap-liberty');

    expect(service.presetId()).toBe('openfreemap-liberty');
  });

  it('asks for the key inline for a key-based preset, and changes nothing until it arrives', () => {
    const { host, service, pick } = setup();

    pick('maptiler-streets');

    expect(service.presetId()).toBe('carto-positron');
    expect(host.querySelector('input[type="password"]')).not.toBeNull();
    expect(host.textContent).toContain('MapTiler API key');
  });

  it('applies the key, then hides the prompt', () => {
    const { fixture, host, service, pick } = setup();
    pick('maptiler-streets');

    const input = host.querySelector<HTMLInputElement>('input[type="password"]')!;
    input.value = 'my-key';
    host.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();

    expect(service.presetId()).toBe('maptiler-streets');
    expect(service.styles().light).toContain('key=my-key');
    expect(host.querySelector('form')).toBeNull();
  });

  it('refuses an empty key and flags the field as invalid', () => {
    const { fixture, host, service, pick } = setup();
    pick('stadia-outdoors');

    host.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();

    expect(service.presetId()).toBe('carto-positron');
    expect(host.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('cancels the prompt without touching the maps', () => {
    const { fixture, host, service, pick } = setup();
    pick('maptiler-dataviz');

    const cancel = Array.from(host.querySelectorAll('button')).find(button => button.textContent?.trim() === 'Cancel');
    cancel!.click();
    fixture.detectChanges();

    expect(host.querySelector('form')).toBeNull();
    expect(service.presetId()).toBe('carto-positron');
  });

  it('emits the preset in use after a pick', () => {
    const { fixture, pick } = setup();
    const emitted: string[] = [];
    fixture.componentInstance.zStyleChange.subscribe(preset => emitted.push(preset.id));

    pick('carto-voyager');

    expect(emitted).toEqual(['carto-voyager']);
  });
});
