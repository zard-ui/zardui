import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { findFixture, TYPESET_FIXTURES } from '../data/fixtures';
import { findFont, MONO_FONTS, TEXT_FONTS } from '../data/fonts.data';
import { DEFAULT_STATE, FLOW_CHOICES, LEADING_CHOICES, MEASURE_CHOICES, SCALE_CHOICES } from '../data/options.data';
import { INHERIT_HEADING, type TypesetFont, type TypesetState } from '../models/typeset.model';

/** The query param each piece of state travels in. */
const PARAM_KEYS: Record<keyof TypesetState, string> = {
  body: 'body',
  heading: 'heading',
  mono: 'mono',
  scale: 'scale',
  leading: 'leading',
  flow: 'flow',
  measure: 'measure',
  item: 'item',
};

/*
 * Os defaults, resolvidos uma vez. Resolvê-los a cada leitura devolveria
 * `TypesetFont | undefined`, e o único jeito de convencer o compilador seria
 * uma asserção não-nula em cada `computed`; a primeira posição da lista é um
 * fallback de verdade e sempre existe.
 */
const DEFAULT_BODY_FONT = findFont(DEFAULT_STATE.body) ?? TEXT_FONTS[0];
const DEFAULT_MONO_FONT = findFont(DEFAULT_STATE.mono) ?? MONO_FONTS[0];

@Injectable()
export class TypesetGeneratorService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly queryParams = toSignal(this.route.queryParamMap);

  private readonly _state = signal<TypesetState>({ ...DEFAULT_STATE });

  constructor() {
    // A URL é a entrada; o sinal é a verdade. Ler de volta o que acabamos de
    // escrever encontra o mesmo estado e não faz nada, então isto cobre o
    // primeiro carregamento, o recarregar e o voltar do navegador sem laço.
    effect(() => {
      const params = this.queryParams();
      if (!params) return;

      const fromUrl = this.parse((key: string) => params.get(key));
      if (!statesMatch(fromUrl, this._state())) {
        this._state.set(fromUrl);
      }
    });
  }

  readonly state = this._state.asReadonly();

  readonly bodyFonts = TEXT_FONTS;
  readonly headingFonts = TEXT_FONTS;
  readonly monoFonts = MONO_FONTS;
  readonly fixtures = TYPESET_FIXTURES;

  readonly bodyFont = computed(() => findFont(this._state().body) ?? DEFAULT_BODY_FONT);

  /** `inherit` means "whatever body is" — the preset repeats the family rather than omitting it. */
  readonly headingFont = computed(() => {
    const heading = this._state().heading;
    return heading === INHERIT_HEADING ? this.bodyFont() : (findFont(heading) ?? this.bodyFont());
  });

  readonly monoFont = computed(() => findFont(this._state().mono) ?? DEFAULT_MONO_FONT);

  readonly fixture = computed(() => findFixture(this._state().item) ?? TYPESET_FIXTURES[0]);

  readonly measureWidth = computed(
    () => MEASURE_CHOICES.find(choice => choice.value === this._state().measure)?.width ?? '37em',
  );

  /**
   * The variables the preview container carries, as one `style` string.
   *
   * The families go in resolved, not as `var(--font-x)`: the site defines those
   * variables for the builder's own catalog, but the preview has to be right
   * even before anyone runs the install command the code panel hands out.
   */
  readonly previewStyles = computed(() => {
    const state = this._state();

    return [
      `--typeset-font-body: ${this.bodyFont().family}`,
      `--typeset-font-heading: ${this.headingFont().family}`,
      `--typeset-font-mono: ${this.monoFont().family}`,
      `--typeset-size: ${state.scale}px`,
      `--typeset-leading: ${state.leading}`,
      `--typeset-flow: ${state.flow}`,
    ].join('; ');
  });

  /** The preset class name the exported CSS declares. */
  readonly presetName = computed(() => `typeset-${this._state().item}`);

  /** The packages the chosen families need, deduplicated and ordered. */
  readonly dependencies = computed(() => {
    const packages = [this.bodyFont().dependency, this.headingFont().dependency, this.monoFont().dependency];
    return [...new Set(packages)];
  });

  setBody(id: string): void {
    this.patch({ body: this.validFont(id, TEXT_FONTS, DEFAULT_STATE.body) });
  }

  setHeading(id: string): void {
    const heading = id === INHERIT_HEADING ? INHERIT_HEADING : this.validFont(id, TEXT_FONTS, INHERIT_HEADING);
    this.patch({ heading });
  }

  setMono(id: string): void {
    this.patch({ mono: this.validFont(id, MONO_FONTS, DEFAULT_STATE.mono) });
  }

  setScale(value: number): void {
    this.patch({ scale: pick(SCALE_CHOICES, value, DEFAULT_STATE.scale) });
  }

  setLeading(value: number): void {
    this.patch({ leading: pick(LEADING_CHOICES, value, DEFAULT_STATE.leading) });
  }

  setFlow(value: string): void {
    this.patch({ flow: pick(FLOW_CHOICES, value, DEFAULT_STATE.flow) });
  }

  setMeasure(value: number): void {
    const allowed = MEASURE_CHOICES.some(choice => choice.value === value);
    this.patch({ measure: allowed ? value : DEFAULT_STATE.measure });
  }

  setItem(id: string): void {
    this.patch({ item: findFixture(id) ? id : DEFAULT_STATE.item });
  }

  reset(): void {
    this._state.set({ ...DEFAULT_STATE });
    this.syncUrl();
  }

  /**
   * A random preset that is still a preset someone would ship.
   *
   * Each slot draws from its own list — mono only ever gets a mono face — and
   * the measure is left alone, because it belongs to the layout, not the type.
   */
  randomize(): void {
    const heading = randomOf([INHERIT_HEADING, ...TEXT_FONTS.map(font => font.id)]);

    this._state.update(state => ({
      ...state,
      body: randomOf(TEXT_FONTS.map(font => font.id)),
      heading,
      mono: randomOf(MONO_FONTS.map(font => font.id)),
      scale: randomOf(SCALE_CHOICES.map(choice => choice.value)),
      leading: randomOf(LEADING_CHOICES.map(choice => choice.value)),
      flow: randomOf(FLOW_CHOICES.map(choice => choice.value)),
    }));

    this.syncUrl();
  }

  /** The preset, as it goes into the consumer's global stylesheet. */
  exportCss(): string {
    const state = this._state();

    return [
      `.${this.presetName()} {`,
      `  --typeset-font-body: var(${this.bodyFont().cssVariable});`,
      `  --typeset-font-heading: var(${this.headingFont().cssVariable});`,
      `  --typeset-font-mono: var(${this.monoFont().cssVariable});`,
      `  --typeset-size: ${state.scale}px;`,
      `  --typeset-leading: ${state.leading};`,
      `  --typeset-flow: ${state.flow};`,
      `}`,
    ].join('\n');
  }

  /** The `@import` plus `:root` block that gives the preset its families. */
  exportFontCss(): string {
    const fonts = uniqueBy([this.bodyFont(), this.headingFont(), this.monoFont()], font => font.id);

    const imports = fonts.map(font => `@import '${font.dependency}';`);
    const variables = fonts.map(font => `  ${font.cssVariable}: ${font.family};`);

    return [...imports, '', ':root {', ...variables, '}'].join('\n');
  }

  /** The install command, for the package manager the reader picked. */
  exportInstallCommand(packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun'): string {
    const packages = this.dependencies().join(' ');

    switch (packageManager) {
      case 'pnpm':
        return `pnpm add ${packages}`;
      case 'yarn':
        return `yarn add ${packages}`;
      case 'bun':
        return `bun add ${packages}`;
      default:
        return `npm install ${packages}`;
    }
  }

  /** The wrapper the reader puts around their rendered markdown. */
  exportUsage(): string {
    return `<div class="typeset ${this.presetName()}">\n  <!-- rendered markdown -->\n</div>`;
  }

  /**
   * The whole job, written out for a coding agent.
   *
   * The last instruction is the important one: the agent must not pick a
   * surface on its own. Applying a prose class to the wrong container is the
   * kind of change that looks harmless in a diff and is obvious in production.
   */
  exportPrompt(): string {
    const state = this._state();
    const fonts = uniqueBy([this.bodyFont(), this.headingFont(), this.monoFont()], font => font.id);
    const fontList = fonts.map(font => `- ${font.label} (\`${font.dependency}\`, exposed as \`${font.cssVariable}\`)`);

    return [
      'Add the zard/ui typeset to this Angular project, with the preset below.',
      '',
      '1. Install the stylesheet:',
      '',
      '   ```bash',
      '   npx zard-cli@latest add typeset',
      '   ```',
      '',
      "   This writes `typeset.css` next to the project's global stylesheet and adds the",
      '   `@import` for it. If the project does not use the zard CLI, copy the file from',
      '   https://zardui.com/r/typeset.json instead and import it after Tailwind.',
      '',
      '2. Install these font packages:',
      '',
      ...fontList.map(line => `   ${line}`),
      '',
      '   ```bash',
      `   ${this.exportInstallCommand('npm')}`,
      '   ```',
      '',
      '3. Import the faces and declare their variables in the global stylesheet:',
      '',
      '   ```css',
      ...this.exportFontCss()
        .split('\n')
        .map(line => `   ${line}`),
      '   ```',
      '',
      `4. Add the preset, also in the global stylesheet:`,
      '',
      '   ```css',
      ...this.exportCss()
        .split('\n')
        .map(line => `   ${line}`),
      '   ```',
      '',
      `   It is ${state.scale}px on a ${state.leading} line height, with ${state.flow} between blocks.`,
      '',
      '5. Do not apply the class anywhere yet. First list every surface that renders HTML or',
      '   markdown prose in this project — article bodies, docs pages, chat message bodies,',
      '   changelog entries — and report them. Ask which ones should use the preset before',
      '   touching a single template.',
      '',
      'Notes:',
      '- Typeset only styles what is inside a `typeset` container. Nothing else changes.',
      '- Put `not-typeset` on any component embedded in the prose that should keep its own styles.',
      '- Typeset sets no `max-width`. The measure belongs to the layout around it.',
    ].join('\n');
  }

  private patch(changes: Partial<TypesetState>): void {
    this._state.update(state => ({ ...state, ...changes }));
    this.syncUrl();
  }

  /**
   * Writes the state into the URL, leaving defaults out.
   *
   * `null` removes a param under `merge`, so a control returned to its default
   * takes its key back out instead of leaving `scale=15` sitting there.
   */
  private syncUrl(): void {
    if (!this.isBrowser) return;

    const state = this._state();
    const queryParams: Record<string, string | null> = {};

    for (const key of Object.keys(PARAM_KEYS) as (keyof TypesetState)[]) {
      const value = state[key];
      queryParams[PARAM_KEYS[key]] = value === DEFAULT_STATE[key] ? null : String(value);
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  /**
   * A state built from raw strings, with every value checked against its list.
   *
   * A query param is untrusted input: anything unrecognised falls back to the
   * default rather than reaching a `style` binding.
   */
  private parse(read: (key: string) => string | null): TypesetState {
    const scale = Number(read(PARAM_KEYS.scale));
    const leading = Number(read(PARAM_KEYS.leading));
    const measure = Number(read(PARAM_KEYS.measure));
    const heading = read(PARAM_KEYS.heading);

    return {
      body: this.validFont(read(PARAM_KEYS.body), TEXT_FONTS, DEFAULT_STATE.body),
      heading: heading === INHERIT_HEADING ? INHERIT_HEADING : this.validFont(heading, TEXT_FONTS, INHERIT_HEADING),
      mono: this.validFont(read(PARAM_KEYS.mono), MONO_FONTS, DEFAULT_STATE.mono),
      scale: pick(SCALE_CHOICES, scale, DEFAULT_STATE.scale),
      leading: pick(LEADING_CHOICES, leading, DEFAULT_STATE.leading),
      flow: pick(FLOW_CHOICES, read(PARAM_KEYS.flow), DEFAULT_STATE.flow),
      measure: MEASURE_CHOICES.some(choice => choice.value === measure) ? measure : DEFAULT_STATE.measure,
      item: findFixture(read(PARAM_KEYS.item)) ? (read(PARAM_KEYS.item) as string) : DEFAULT_STATE.item,
    };
  }

  private validFont(id: string | null | undefined, allowed: readonly TypesetFont[], fallback: string): string {
    return allowed.some(font => font.id === id) ? (id as string) : fallback;
  }
}

function pick<T extends string | number>(choices: readonly { readonly value: T }[], value: unknown, fallback: T): T {
  return choices.some(choice => choice.value === value) ? (value as T) : fallback;
}

function randomOf<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function uniqueBy<T>(values: readonly T[], key: (value: T) => string): T[] {
  const seen = new Set<string>();
  return values.filter(value => {
    const id = key(value);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function statesMatch(a: TypesetState, b: TypesetState): boolean {
  return (Object.keys(a) as (keyof TypesetState)[]).every(key => a[key] === b[key]);
}
