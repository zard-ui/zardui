import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { DEFAULT_PRESET, encodePreset, LOCAL_PRESET_CATALOG } from '@zardui/preset';

import { CreateBuilderService } from './create-builder.service';

describe('CreateBuilderService', () => {
  let service: CreateBuilderService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), CreateBuilderService] });

    service = TestBed.inject(CreateBuilderService);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('starts on the default preset', () => {
    expect(service.preset()).toEqual(DEFAULT_PRESET);
    expect(service.code()).toBe('a000301e');
  });

  it('round-trips a control change through the code', () => {
    service.select('theme', 'indigo');

    expect(service.preset().theme).toBe('indigo');
    expect(service.code()).toBe(encodePreset({ ...DEFAULT_PRESET, theme: 'indigo' }, LOCAL_PRESET_CATALOG));
  });

  it('reads the toggles the way the preset spells them', () => {
    service.select('rtl', 'on');
    service.select('darkMode', 'off');

    expect(service.preset().rtl).toBe(true);
    expect(service.preset().darkMode).toBe('off');
  });

  /**
   * Cada clique num controle é mudança de estado, não navegação: sem
   * `replaceUrl`, voltar depois de experimentar dez combinações exigiria dez
   * cliques no botão de voltar.
   */
  it('keeps the URL in step without stacking history', () => {
    service.select('baseColor', 'slate');

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ replaceUrl: true, queryParams: { preset: service.code() } }),
    );
  });

  it('loads a preset from its code', () => {
    expect(service.applyCode('a4B0301t')).toEqual({ ok: true });
    expect(service.preset()).toMatchObject({ baseColor: 'slate', theme: 'blue' });
  });

  /** Um link truncado numa mensagem não pode deixar a página em branco. */
  it('falls back to the default on a code it cannot read, and says why', () => {
    const result = service.applyCode('not-a-code');

    expect(result.ok).toBe(false);
    expect(result.reason).toBeTruthy();
    expect(service.preset()).toEqual(DEFAULT_PRESET);
  });

  it('scopes the tokens as inline style, radius included', () => {
    const styles = service.scopedStyles();

    expect(styles).toContain('--radius: 0.625rem');
    expect(styles).toContain('--background: oklch(1 0 0)');
    expect(styles).toContain('--sidebar-ring:');
  });

  it('renders the same CSS the CLI would write', () => {
    const css = service.themeCss();

    expect(css.startsWith('@layer ng-icon, theme, base, components, utilities;')).toBe(true);
    expect(css).toContain(':root {');
    expect(css).toContain('.dark {');
  });

  it('lists a control for every knob, in panel order', () => {
    expect(service.controls().map(control => control.id)).toEqual([
      'baseColor',
      'theme',
      'chart',
      'icons',
      'radius',
      'darkMode',
      'rtl',
    ]);
  });

  it('labels a control with what the catalog calls it', () => {
    service.select('baseColor', 'slate');

    expect(service.controls()[0]?.value).toBe('Slate');
  });

  describe('shuffle', () => {
    it('leaves a locked control where it was', () => {
      service.select('baseColor', 'slate');
      service.toggleLock('baseColor');

      for (let attempt = 0; attempt < 20; attempt++) service.shuffle();

      expect(service.preset().baseColor).toBe('slate');
    });

    it('does move what is not locked', () => {
      const seen = new Set<string>();

      for (let attempt = 0; attempt < 40; attempt++) {
        service.shuffle();
        seen.add(service.preset().theme);
      }

      expect(seen.size).toBeGreaterThan(1);
    });

    it('toggles a lock off again', () => {
      service.toggleLock('theme');
      expect(service.isLocked('theme')).toBe(true);

      service.toggleLock('theme');
      expect(service.isLocked('theme')).toBe(false);
    });
  });

  it('writes a preset file that names its schema', () => {
    const file = JSON.parse(service.presetFile());

    expect(file.$schema).toBe('https://zardui.com/preset.schema.json');
    expect(file.version).toBe(1);
    expect(file.baseColor).toBe('neutral');
  });
});
