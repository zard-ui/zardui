# Styles

Eight looks for every component — `vega`, `nova` (the default), `maia`, `lyra`, `mira`, `luma`, `sera`, `rhea` — the same
names shadcn/ui uses. They change spacing, radius, density and typography, never a component's API.

## How a component carries a style

A component does not write the classes that decide its look. It writes a **marker**:

```ts
export const cardHeaderVariants = cva('cn-card-header group/card-header @container/card-header grid items-start');
```

`cn-card-header` stands for "the classes the current style gives a card header". What is left in the source is structure:
the `grid`, the `group/` hooks, `pointer-events-none`, `outline-none`. Anything a style might want to change (padding,
gap, radius, font size, colors, shadows, ring widths…) lives in the marker.

A **style sheet** (`style-<id>.css`) says what each marker stands for. One rule per marker, one `@apply` per rule:

```css
.style-lyra {
  .cn-card-header {
    @apply gap-1 rounded-none px-(--card-spacing) [.border-b]:pb-(--card-spacing);
  }
}
```

A marker a style has nothing to say about is an empty rule (`.cn-x { }`), never a missing one — `npm run check:registry`
fails on a marker some sheet does not define, and on a rule no component uses.

## Where the sheets are used

- **Docs site** — `apps/web/src/styles.css` imports all eight into the `components` layer. A `style-<id>` class on `<body>`
  (or any ancestor) selects one; no class is the default, nova (its rules are written with `:not(.style-… *)` so they are
  exclusive). Switching is CSS only: no reload, no component re-created. Because the rules sit in the `components` layer, a
  `class` on a component (a utility) always wins over its style, the same as `mergeClasses` guarantees.
- **`zard-cli add`** — resolves the markers once while writing the file, using `components.json`'s `style`
  (`packages/cli/src/core/styles`). The project ships plain Tailwind classes and no runtime style switch. `css`, the legacy
  value, means nova and installs exactly the classes the library has always installed.
- **Registry** — `scripts/build-registry.cts` publishes every file as `content` (nova, resolved — what any reader that
  predates styles installs) plus `styled` (the source with its markers), and each sheet as `public/r/styles/<id>.json`.
- **Unit tests** — `libs/zard/jest-style-transformer.cjs` resolves the markers with `style-nova.css` before the specs
  run, so a spec that asserts `toHaveClass('h-8')` keeps asserting what a user ends up with.

## Naming

Markers follow shadcn's names so its own sheets map onto ours: `cn-<component>[-<part>][-<variant|size|…>-<value>]`
(`cn-button-variant-outline`, `cn-card-header`, `cn-dropdown-menu-item`). A part zard has and shadcn does not gets a name in
the same shape (`cn-calendar-day-button`).

## Adding or changing a component

1. Put the structure in the source and the look in markers; name them as above.
2. Add one rule per marker to **all eight** sheets (copy nova's, then adjust). In nova the rule is the classes the component
   had; the other seven decide how that part looks in their style.
3. Keep conflicting tokens out of one marker (`rounded-lg` and `rounded-md` in the same rule): a sheet is CSS, so the last
   one wins by position, not by `twMerge`.
4. `npm run build:registry` rebuilds the published tables and the CLI's bundled copy; `npm run check:registry` verifies them.

## Known limits

- Only class strings in `*.variants.ts` and the marked spots of a few component files are style-aware. Icon sizes written
  as `class="size-4"` in a template are not.
- Styles are not meant to nest. A `style-*` class inside another `style-*` class resolves to whichever sheet comes later.
