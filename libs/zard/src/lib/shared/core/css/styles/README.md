# Styles

Eight looks for every component — `vega`, `nova` (the default), `maia`, `lyra`, `mira`, `luma`, `sera`, `rhea` — the same
names shadcn/ui uses. `nova` is zard's own default look (the one the library always had), not a copy of shadcn's
nova; the other seven follow shadcn's style family. They change spacing, radius, density and typography, never a component's API.

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

One marker is not a component part: `cn-font-heading`, on the titles shadcn gives the heading font (card, dialog,
alert-dialog, sheet, drawer, empty). Every sheet resolves it to `font-heading`, which reads `--font-heading` — the
variable a preset's Heading font sets (`zard-cli init --preset`). A project without it keeps the inherited font.

## Adding or changing a component

1. Put the structure in the source and the look in markers; name them as above.
2. Add one rule per marker to **all eight** sheets (copy nova's, then adjust). In nova the rule is the classes the component
   had; the other seven decide how that part looks in their style.
3. Keep conflicting tokens out of one marker (`rounded-lg` and `rounded-md` in the same rule): a sheet is CSS, so the last
   one wins by position, not by `twMerge`.
4. `npm run build:registry` rebuilds the published tables and the CLI's bundled copy; `npm run check:registry` verifies them.

## Things that trip a marker up

- **Icons.** `<ng-icon>` sizes itself with an unlayered rule (`width: var(--ng-icon__size, 1em)`), so a style's
  `[&_svg:not([class*='size-'])]:size-4` never reaches it and a plain `size-4` utility loses to it. An icon whose size a
  style changes (select chevron, command search, empty-state glyph…) therefore carries its own marker
  (`cn-select-trigger-icon`) that resolves to `size-4!` or `size-3.5!`. A literal `size-4!` in a template pins the icon
  for every style, so use one only when no style varies it.
- **Overlay masks.** The CDK takes the backdrop classes as an array, one class per entry, so a marker there is written
  `'cn-dialog-overlay'.split(' ').filter(Boolean)`: the CLI resolves the literal, and the split turns the resolved classes
  back into entries (`DIALOG_BACKDROP_CLASSES`, `ALERT_DIALOG_BACKDROP_CLASSES`, `SHEET_BACKDROP_CLASSES`,
  `DRAWER_BACKDROP_CLASSES`).
- **Attributes.** The sheets are written for the attributes the zard components render, not for shadcn's Base UI ones:
  `data-size` on the select trigger (`zSize`), `data-orientation` for `data-vertical:` / `data-horizontal:` (the
  `data-vertical` variant in `zard.css` reads `data-orientation`, on the slider thumb as everywhere else),
  `data-slot="radio-group-item"` / `checkbox` / `switch` plus `peer` on the host for the `peer-data-[slot=…]` label rules.
  `npm run check:registry` fails on a rule that reads an attribute nothing renders.
- **`cn-label`.** The look of a form label (size, weight, case) lives in `cn-label`, which `z-field-label` carries next to
  `cn-field-label` (layout, state, `leading-*`); nova leaves it empty, because nova's `cn-field-label` keeps the whole
  label look. Keep a `leading-*` out of `cn-label`: the one in `cn-field-label` must win.
- **Drawer.** `cn-drawer` is the panel itself (shadcn's `cn-drawer-popup`): in maia, mira, luma and rhea it is the inset
  card (`m-2`, border, radius), in vega, lyra and sera it is flush with the edge and rounded only on the side that faces
  the page (`cn-drawer-placement-*`).

## Known limits

- Only class strings in `*.variants.ts` and the marked spots of a few component files are style-aware. An icon size or
  radius written inline as `class="size-4"` in a template is not, unless it is a marker (see above).
- Styles are not meant to nest. A `style-*` class inside another `style-*` class resolves to whichever sheet comes later.
