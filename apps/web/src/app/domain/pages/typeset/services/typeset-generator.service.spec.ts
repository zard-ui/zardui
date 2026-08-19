import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { TypesetGeneratorService } from './typeset-generator.service';
import { DEFAULT_STATE } from '../data/options.data';

/** Um `ParamMap` construído a partir de um objeto simples. */
function paramMap(params: Record<string, string>) {
  return {
    get: (key: string) => params[key] ?? null,
    has: (key: string) => key in params,
    getAll: (key: string) => (key in params ? [params[key]] : []),
    keys: Object.keys(params),
  };
}

describe('TypesetGeneratorService', () => {
  let queryParamMap: BehaviorSubject<ReturnType<typeof paramMap>>;
  let navigate: jest.Mock;

  function createService(params: Record<string, string> = {}): TypesetGeneratorService {
    queryParamMap = new BehaviorSubject(paramMap(params));
    navigate = jest.fn().mockResolvedValue(true);

    TestBed.configureTestingModule({
      providers: [
        TypesetGeneratorService,
        { provide: Router, useValue: { navigate } },
        { provide: ActivatedRoute, useValue: { queryParamMap } },
      ],
    });

    const service = TestBed.inject(TypesetGeneratorService);
    TestBed.tick();
    return service;
  }

  afterEach(() => TestBed.resetTestingModule());

  describe('defaults', () => {
    it('starts on the documented defaults', () => {
      const service = createService();

      expect(service.state()).toEqual({
        body: 'geist',
        heading: 'inherit',
        mono: 'geist-mono',
        scale: 15,
        leading: 1.75,
        flow: '1.25em',
        measure: 80,
        item: 'docs',
      });
    });

    it('exposes the preview variables for those defaults', () => {
      const service = createService();

      expect(service.previewStyles()).toContain('--typeset-size: 15px');
      expect(service.previewStyles()).toContain('--typeset-leading: 1.75');
      expect(service.previewStyles()).toContain('--typeset-flow: 1.25em');
    });
  });

  describe('each control moves the preview', () => {
    it('changes the size', () => {
      const service = createService();
      service.setScale(18);

      expect(service.previewStyles()).toContain('--typeset-size: 18px');
    });

    it('changes the leading', () => {
      const service = createService();
      service.setLeading(1.9);

      expect(service.previewStyles()).toContain('--typeset-leading: 1.9');
    });

    it('changes the flow', () => {
      const service = createService();
      service.setFlow('2em');

      expect(service.previewStyles()).toContain('--typeset-flow: 2em');
    });

    it('changes the body family', () => {
      const service = createService();
      service.setBody('lora');

      expect(service.previewStyles()).toContain("--typeset-font-body: 'Lora Variable', serif");
    });

    it('changes the mono family', () => {
      const service = createService();
      service.setMono('jetbrains-mono');

      expect(service.previewStyles()).toContain("--typeset-font-mono: 'JetBrains Mono Variable', monospace");
    });

    it('changes the measure', () => {
      const service = createService();
      service.setMeasure(60);

      expect(service.measureWidth()).toBe('28em');
    });

    it('changes the fixture', () => {
      const service = createService();
      service.setItem('elements');

      expect(service.fixture().id).toBe('elements');
    });
  });

  describe('heading inherit', () => {
    it('repeats the body family in the preview', () => {
      const service = createService();
      service.setBody('lora');

      expect(service.previewStyles()).toContain("--typeset-font-heading: 'Lora Variable', serif");
    });

    it('repeats the body variable in the exported preset', () => {
      const service = createService();
      service.setBody('lora');

      expect(service.exportCss()).toContain('--typeset-font-heading: var(--font-lora);');
    });

    it('uses its own family once one is picked', () => {
      const service = createService();
      service.setBody('lora');
      service.setHeading('inter');

      expect(service.exportCss()).toContain('--typeset-font-heading: var(--font-inter);');
      expect(service.exportCss()).toContain('--typeset-font-body: var(--font-lora);');
    });
  });

  describe('exportCss', () => {
    it('produces the preset for the current choices', () => {
      const service = createService();
      service.setBody('geist');
      service.setMono('geist-mono');
      service.setScale(15);

      expect(service.exportCss()).toBe(
        [
          '.typeset-docs {',
          '  --typeset-font-body: var(--font-geist);',
          '  --typeset-font-heading: var(--font-geist);',
          '  --typeset-font-mono: var(--font-geist-mono);',
          '  --typeset-size: 15px;',
          '  --typeset-leading: 1.75;',
          '  --typeset-flow: 1.25em;',
          '}',
        ].join('\n'),
      );
    });

    it('names the preset after the fixture on show', () => {
      const service = createService();
      service.setItem('chat');

      expect(service.exportCss()).toContain('.typeset-chat {');
    });
  });

  describe('font install output', () => {
    it('lists each package once when two slots share a family', () => {
      const service = createService();
      service.setBody('lora');

      expect(service.dependencies()).toEqual(['@fontsource-variable/lora', '@fontsource-variable/geist-mono']);
    });

    it('writes the command for the chosen package manager', () => {
      const service = createService();

      expect(service.exportInstallCommand('pnpm')).toMatch(/^pnpm add /);
      expect(service.exportInstallCommand('bun')).toMatch(/^bun add /);
      expect(service.exportInstallCommand('npm')).toMatch(/^npm install /);
    });

    it('declares the variables the preset reads', () => {
      const service = createService();
      service.setBody('lora');

      expect(service.exportFontCss()).toContain("@import '@fontsource-variable/lora';");
      expect(service.exportFontCss()).toContain("--font-lora: 'Lora Variable', serif;");
    });
  });

  describe('the prompt', () => {
    it('carries the generated preset', () => {
      const service = createService();
      service.setScale(18);

      expect(service.exportPrompt()).toContain('--typeset-size: 18px;');
    });

    it('tells the agent to ask before applying the class', () => {
      const service = createService();

      expect(service.exportPrompt()).toContain('Do not apply the class anywhere yet');
    });
  });

  describe('state read from the URL', () => {
    it('restores every parameter', () => {
      const service = createService({
        body: 'lora',
        heading: 'inter',
        mono: 'jetbrains-mono',
        scale: '18',
        leading: '1.9',
        flow: '2em',
        measure: '60',
        item: 'article',
      });

      expect(service.state()).toEqual({
        body: 'lora',
        heading: 'inter',
        mono: 'jetbrains-mono',
        scale: 18,
        leading: 1.9,
        flow: '2em',
        measure: 60,
        item: 'article',
      });
    });

    // Query param é entrada não confiável: qualquer coisa fora da lista tem de
    // cair no default antes de chegar a um binding de `style`.
    it('falls back to the default for an unknown font', () => {
      const service = createService({ body: 'comic-sans' });

      expect(service.state().body).toBe(DEFAULT_STATE.body);
    });

    it('refuses a mono face in the body slot', () => {
      const service = createService({ body: 'geist-mono' });

      expect(service.state().body).toBe(DEFAULT_STATE.body);
    });

    it('refuses a text face in the mono slot', () => {
      const service = createService({ mono: 'lora' });

      expect(service.state().mono).toBe(DEFAULT_STATE.mono);
    });

    it('falls back for a size outside the list', () => {
      const service = createService({ scale: '99' });

      expect(service.state().scale).toBe(DEFAULT_STATE.scale);
    });

    it('falls back for a non-numeric size', () => {
      const service = createService({ scale: 'large' });

      expect(service.state().scale).toBe(DEFAULT_STATE.scale);
    });

    it('falls back for an unknown fixture', () => {
      const service = createService({ item: '../../etc/passwd' });

      expect(service.state().item).toBe(DEFAULT_STATE.item);
    });

    it('falls back for a flow value outside the list', () => {
      const service = createService({ flow: '99em' });

      expect(service.state().flow).toBe(DEFAULT_STATE.flow);
    });

    it('keeps inherit as a valid heading', () => {
      const service = createService({ heading: 'inherit' });

      expect(service.state().heading).toBe('inherit');
    });
  });

  describe('state written to the URL', () => {
    it('writes a changed value', () => {
      const service = createService();
      service.setScale(18);

      expect(navigate).toHaveBeenCalledWith(
        [],
        expect.objectContaining({ queryParams: expect.objectContaining({ scale: '18' }) }),
      );
    });

    it('drops a value that is back on its default', () => {
      const service = createService({ scale: '18' });
      service.setScale(DEFAULT_STATE.scale);

      const [, options] = navigate.mock.calls.at(-1) as [unknown, { queryParams: Record<string, string | null> }];
      expect(options.queryParams['scale']).toBeNull();
    });

    it('replaces the history entry instead of stacking one per keystroke', () => {
      const service = createService();
      service.setScale(18);

      expect(navigate).toHaveBeenCalledWith(
        [],
        expect.objectContaining({ replaceUrl: true, queryParamsHandling: 'merge' }),
      );
    });
  });

  describe('randomize', () => {
    it('only ever produces choices the pickers offer', () => {
      const service = createService();

      for (let attempt = 0; attempt < 40; attempt++) {
        service.randomize();
        const state = service.state();

        expect(service.bodyFonts.some(font => font.id === state.body)).toBe(true);
        expect(state.heading === 'inherit' || service.headingFonts.some(font => font.id === state.heading)).toBe(true);
        expect(service.monoFonts.some(font => font.id === state.mono)).toBe(true);
        expect([14, 15, 16, 18]).toContain(state.scale);
        expect([1.6, 1.75, 1.9]).toContain(state.leading);
        expect(['1em', '1.25em', '2em']).toContain(state.flow);
      }
    });

    it('leaves the measure alone, because it belongs to the layout', () => {
      const service = createService();
      service.setMeasure(60);
      service.randomize();

      expect(service.state().measure).toBe(60);
    });
  });

  describe('reset', () => {
    it('returns every control to its default', () => {
      const service = createService({ body: 'lora', scale: '18' });
      service.reset();

      expect(service.state()).toEqual({ ...DEFAULT_STATE });
    });
  });
});
