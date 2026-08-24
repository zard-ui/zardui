import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { findFixture, TYPESET_FIXTURES } from '../data/fixtures';
import { findFont, MONO_FONTS, TEXT_FONTS } from '../data/fonts.data';
import { DEFAULT_STATE, FLOW_CHOICES, LEADING_CHOICES, MEASURE_CHOICES, SCALE_CHOICES } from '../data/options.data';
import { INHERIT_HEADING, type TypesetFont, type TypesetSlot, type TypesetState } from '../models/typeset.model';

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

/** How many steps the menu's Undo walks back. Fifty is well past what anyone undoes. */
const HISTORY_LIMIT = 50;

/*
 * The defaults, resolved once. Resolving them on every read would return
 * `TypesetFont | undefined`, and the only way to satisfy the compiler would be a
 * non-null assertion in every `computed`; the first entry of the list is a real
 * fallback and always exists.
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

  /*
   * The history is the builder's, not the browser's: every choice rewrites the
   * URL with `replaceUrl`, precisely so the back button is not filled with
   * intermediate steps. Undoing a choice needs this stack instead.
   */
  private readonly past = signal<readonly TypesetState[]>([]);
  private readonly future = signal<readonly TypesetState[]>([]);

  constructor() {
    // The URL is the input; the signal is the truth. Reading back what we just
    // wrote finds the same state and does nothing, so this covers the first load,
    // a reload and the browser's back button without looping.
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

  /** The state as a query string, `?` included, for a link that has to carry it. */
  readonly queryString = computed(() => {
    const params = new URLSearchParams(this.nonDefaultParams());
    const query = params.toString();
    return query ? `?${query}` : '';
  });

  /** The preset class name the exported CSS declares. */
  readonly presetName = computed(() => `typeset-${this._state().item}`);

  /** Whether the menu's Undo and Redo have anywhere to go. */
  readonly canUndo = computed(() => this.past().length > 0);
  readonly canRedo = computed(() => this.future().length > 0);

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
    this.commit({ ...DEFAULT_STATE });
  }

  undo(): void {
    const past = this.past();
    const previous = past.at(-1);
    if (!previous) return;

    this.future.update(stack => [this._state(), ...stack]);
    this.past.set(past.slice(0, -1));
    this._state.set(previous);
    this.syncUrl();
  }

  redo(): void {
    const [next, ...rest] = this.future();
    if (!next) return;

    this.past.update(stack => [...stack, this._state()]);
    this.future.set(rest);
    this._state.set(next);
    this.syncUrl();
  }

  /**
   * A random preset that is still a preset someone would ship.
   *
   * Each slot draws from its own list — mono only ever gets a mono face — and
   * the measure is left alone, because it belongs to the layout, not the type.
   * A slot the customizer reports as locked keeps what it holds: shuffling is
   * how you explore around the one choice you have already made.
   */
  randomize(locked: ReadonlySet<TypesetSlot> = new Set()): void {
    const state = this._state();

    const draw = <T extends string | number>(slot: TypesetSlot, values: readonly T[], current: T): T =>
      locked.has(slot) ? current : randomOf(values);

    this.commit({
      ...state,
      body: draw(
        'body',
        TEXT_FONTS.map(font => font.id),
        state.body,
      ),
      heading: draw('heading', [INHERIT_HEADING, ...TEXT_FONTS.map(font => font.id)], state.heading),
      mono: draw(
        'mono',
        MONO_FONTS.map(font => font.id),
        state.mono,
      ),
      scale: draw(
        'scale',
        SCALE_CHOICES.map(choice => choice.value),
        state.scale,
      ),
      leading: draw(
        'leading',
        LEADING_CHOICES.map(choice => choice.value),
        state.leading,
      ),
      flow: draw(
        'flow',
        FLOW_CHOICES.map(choice => choice.value),
        state.flow,
      ),
    });
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

  /**
   * The wrapper the reader puts around their rendered markdown.
   *
   * The measure rides on the wrapper, never in the preset: typeset declares no
   * `max-width` on purpose, so a snippet without one hands over a rhythm that
   * runs the full width of whatever container it lands in.
   */
  exportUsage(): string {
    return `<div class="typeset ${this.presetName()} max-w-[${this.measureWidth()}]">\n  <!-- rendered markdown -->\n</div>`;
  }

  /**
   * The whole job, written out for a coding agent.
   *
   * It reads as one instruction per step, in the order the work happens, and
   * the fifth is the important one: the agent must not pick a surface on its
   * own. Applying a prose class to the wrong container is the kind of change
   * that looks harmless in a diff and is obvious in production.
   */
  exportPrompt(): string {
    const state = this._state();
    const fonts = uniqueBy([this.bodyFont(), this.headingFont(), this.monoFont()], font => font.id);
    const fontList = fonts.map(font => `- ${font.label} (\`${font.dependency}\`, exposed as \`${font.cssVariable}\`)`);

    return [
      'Install the zard/ui typeset in this project.',
      '',
      'Typeset is a single stylesheet that styles rendered markdown: wrap the output in a',
      '`typeset` container and everything inside (headings, lists, tables, code, blockquotes,',
      'math) is styled. Everything outside is untouched.',
      '',
      '1. Add the stylesheet:',
      '',
      '   ```bash',
      '   npx zard-cli@latest add typeset',
      '   ```',
      '',
      "   This writes `typeset.css` next to the project's global stylesheet. If the project",
      '   does not use the zard CLI, download https://zardui.com/r/typeset.json and save its',
      '   `typeset.css` file there by hand. If the file already exists, replace it.',
      '',
      '2. Import it in the global stylesheet, after the Tailwind import:',
      '',
      '   ```css',
      "   @import 'tailwindcss';",
      "   @import './typeset.css';",
      '   ```',
      '',
      '3. Install the fonts. They are self-hosted through @fontsource — no request to a',
      '   third-party CDN:',
      '',
      ...fontList.map(line => `   ${line}`),
      '',
      '   ```bash',
      `   ${this.exportInstallCommand('npm')}`,
      '   ```',
      '',
      '   Then import the faces and declare their variables in the global stylesheet:',
      '',
      '   ```css',
      ...indent(this.exportFontCss()),
      '   ```',
      '',
      '4. Add this preset to the global stylesheet, after the typeset import. If a class named',
      `   \`.${this.presetName()}\` already exists, update its values in place. Leave any other`,
      '   `typeset-*` preset untouched: they are separate surfaces.',
      '',
      '   ```css',
      ...indent(this.exportCss()),
      '   ```',
      '',
      `   It is ${state.scale}px on a ${state.leading} line height, with ${state.flow} between blocks.`,
      '',
      '5. Do not apply the class anywhere yet. Search the project for surfaces that render',
      '   markdown or rich content: ngx-markdown, marked or markdown-it output, `[innerHTML]`',
      '   with parsed markdown, `prose` classes, CMS content renderers. Present the candidates',
      '   you find as a short list and ask which surface should use typeset. Then wrap only the',
      '   one picked:',
      '',
      '   ```html',
      ...indent(this.exportUsage()),
      '   ```',
      '',
      '   If that surface already has its own typography — a `prose` class, styled markdown',
      '   components — list those styles and let the user decide what to remove before wrapping.',
      '',
      'Notes:',
      '- Typeset only styles what is inside a `typeset` container. Nothing else changes.',
      '- To exclude an embedded component, put the `not-typeset` class or the `data-not-typeset`',
      '  attribute on it: the opt-out covers the element and everything under it.',
      '- Typeset declares no `max-width`. The measure belongs to the layout around it, which is',
      `  what the \`max-w-[${this.measureWidth()}]\` on the wrapper is for.`,
      '- Verify on the surface that was picked: headings, lists, tables and code inside the',
      '  container should be styled with no classes on the content itself.',
      '- Docs: https://zardui.com/docs/typeset',
    ].join('\n');
  }

  private patch(changes: Partial<TypesetState>): void {
    this.commit({ ...this._state(), ...changes });
  }

  /**
   * Applies a new state, remembering the one it replaces.
   *
   * A choice that changes nothing is dropped here: re-picking the value a row
   * already holds would otherwise cost an undo step that undoes nothing.
   */
  private commit(next: TypesetState): void {
    if (statesMatch(next, this._state())) return;

    this.past.update(stack => [...stack, this._state()].slice(-HISTORY_LIMIT));
    this.future.set([]);
    this._state.set(next);
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

    const present = this.nonDefaultParams();
    const queryParams: Record<string, string | null> = {};

    for (const key of Object.values(PARAM_KEYS)) {
      queryParams[key] = present[key] ?? null;
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  /** The params that are not at their default, keyed the way the URL spells them. */
  private nonDefaultParams(): Record<string, string> {
    const state = this._state();
    const params: Record<string, string> = {};

    for (const key of Object.keys(PARAM_KEYS) as (keyof TypesetState)[]) {
      const value = state[key];
      if (value !== DEFAULT_STATE[key]) params[PARAM_KEYS[key]] = String(value);
    }

    return params;
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

/** A generated block, moved under the numbered step that introduces it. */
function indent(block: string): string[] {
  return block.split('\n').map(line => `   ${line}`);
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
