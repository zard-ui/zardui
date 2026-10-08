# Customization & Theming

Components are source code in the user's project, so every layer is editable. That is the reason to be deliberate about which layer you reach for: the cheapest change that works is almost always the right one.

Order of preference:

1. **A built-in variant** — `zType`, `zSize`, `zShape`.
2. **The `class` input** — layout only.
3. **A theme token** — changes every component at once.
4. **A new variant in `<name>.variants.ts`** — when the same override keeps repeating.
5. **A wrapper component** — when the composition itself repeats.

---

## How the theme works

1. CSS variables are defined in `:root` (light) and `.dark` (dark) in the file at `tailwind.css` in `components.json` — typically `src/styles.css`.
2. An `@theme inline` block maps them to Tailwind utilities: `--color-primary: var(--primary)` makes `bg-primary` work.
3. Components use those utilities. Change the variable, and everything referencing it changes.

Presets, chosen at `init` and recorded as `tailwind.baseColor`: `neutral`, `stone`, `zinc`, `gray`, `slate`.

### Tokens

| Variable                                 | Purpose                                            |
| ---------------------------------------- | -------------------------------------------------- |
| `--background` / `--foreground`          | Page background and default text                   |
| `--card` / `--card-foreground`           | Card surfaces                                      |
| `--popover` / `--popover-foreground`     | Popovers, dropdowns, tooltips                      |
| `--primary` / `--primary-foreground`     | Primary actions                                    |
| `--secondary` / `--secondary-foreground` | Secondary actions                                  |
| `--muted` / `--muted-foreground`         | Muted text and surfaces                            |
| `--accent` / `--accent-foreground`       | Hover and accent states                            |
| `--destructive`                          | Errors and destructive actions                     |
| `--border`                               | Default border colour                              |
| `--input`                                | Form control borders                               |
| `--ring`                                 | Focus ring                                         |
| `--chart-1` … `--chart-5`                | Data visualisation                                 |
| `--sidebar-*`                            | Sidebar-specific surfaces                          |
| `--radius`                               | Base radius; `--radius-sm/md/lg/xl` derive from it |

Colours are OKLCH: `oklch(0.205 0 0)` — lightness (0–1), chroma (0 = grey), hue (0–360).

Dark mode is a `.dark` class on the root element, declared as `@custom-variant dark (&:is(.dark *))`.

### Adding a colour

Add it to the file at `tailwind.css` — never a new one — in both `:root` and `.dark`, then register it in the `@theme inline` block so Tailwind generates the utilities:

```css
:root {
  --success: oklch(0.72 0.19 149);
  --success-foreground: oklch(0.98 0.02 155);
}

.dark {
  --success: oklch(0.5 0.14 150);
  --success-foreground: oklch(0.98 0.02 155);
}

@theme inline {
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
}
```

There is no `tailwind.config.js` — this is TailwindCSS v4, and the theme lives in CSS.

---

## Prose

Theme tokens style components. They do not reach rendered markdown, which arrives as bare `h1`, `p`, `ul` and `table` with no class on anything.

That is what typeset is for: one stylesheet, installed by `zard-cli add typeset`, plus a preset class that sets six variables. It reads the same tokens as everything else, so a theme change moves the prose with it, and dark mode needs nothing added.

```css
.typeset-docs {
  --typeset-font-body: var(--font-geist);
  --typeset-font-heading: var(--font-geist);
  --typeset-font-mono: var(--font-geist-mono);
  --typeset-size: 15px;
  --typeset-leading: 1.75;
  --typeset-flow: 1.25em;
}
```

```angular-html
<div class="typeset typeset-docs" [innerHTML]="renderedMarkdown()"></div>
```

Build a preset visually at [zardui.com/typeset](https://zardui.com/typeset). The rules — including `not-typeset`, `typeset-scroll`, and why a plain utility overrides it — are in [rules/typeset.md](./rules/typeset.md).

---

## Variants

Every component declares its variants with `cva()` in `<name>.variants.ts`, exported as `<name>Variants`, with one exported type per dimension.

```ts
// button.variants.ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const buttonVariants = cva(mergeClasses('inline-flex shrink-0 items-center justify-center …'), {
  variants: {
    zType: {
      default: 'bg-primary text-primary-foreground',
      destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
      outline: 'border-border bg-background hover:bg-muted',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-muted hover:text-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    zSize: { default: 'h-8 gap-1.5 px-2.5', xs: 'h-6 …', sm: 'h-7 …', lg: 'h-9 …', icon: 'size-8' },
    zShape: { default: 'rounded-md', circle: 'rounded-full', square: 'rounded-none' },
    zDisabled: { true: 'pointer-events-none opacity-50' },
  },
  defaultVariants: { zType: 'default', zSize: 'default', zShape: 'default' },
});

export type ZardButtonTypeVariants = NonNullable<VariantProps<typeof buttonVariants>['zType']>;
export type ZardButtonSizeVariants = NonNullable<VariantProps<typeof buttonVariants>['zSize']>;
```

Adding a variant means adding a key and widening nothing else — the exported type follows automatically:

```ts
zType: {
  // …
  success: 'bg-success text-success-foreground hover:bg-success/90',
}
```

Boolean variants use a `true:` key. `defaultVariants` must cover every dimension the component defaults.

---

## Class composition

Final classes are always composed in a `computed()` through `mergeClasses`, and bound on the host:

```ts
import { mergeClasses } from '@/shared/utils/merge-classes';

protected readonly classes = computed(() =>
  mergeClasses(
    buttonVariants({ zType: this.zType(), zSize: this.zSize(), zShape: this.zShape(), zDisabled: this.zDisabled() }),
    this.class(),
  ),
);

// @Component: host: { 'data-slot': 'button', '[class]': 'classes()' }
```

`mergeClasses(...inputs: ClassValue[])` is `twMerge(clsx(inputs))`. Order matters: variants first, conditionals next, `this.class()` last — that is what makes the consumer's class win a conflict instead of both surviving.

The `class` input is the only unprefixed input on any component, and it exists for layout. Using it to repaint a component is how two sources of truth for the same colour get created.

---

## Host attributes

Components expose their state as attributes, which is what makes them stylable and testable from outside:

- `data-slot` — the stable semantic id of the element (`button`, `card-header`, `input`).
- `data-size` / `data-variant` — mirror the `z` inputs.
- `data-state` — lifecycle (`open`/`closed`, `checked`/`unchecked`).
- `aria-*` — disabled, invalid, expanded.

Target these rather than adding a marker class:

```css
[data-slot='button'][data-variant='destructive'] { … }
```

---

## Wrapper components

When the same composition repeats, wrap it — do not fork the component:

```angular-ts
@Component({
  selector: 'app-confirm-button',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="destructive" [zLoading]="pending()" [zDisabled]="pending()" (click)="confirm.emit()">
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmButton {
  readonly pending = input(false, { transform: booleanAttribute });
  readonly confirm = output<void>();
}
```

---

## Updating a component

There is no `--diff` or `--dry-run`. `zard-cli add <name> --overwrite` replaces the local files wholesale, which discards any customisation made in them — so read the file first, and **never pass `--overwrite` without the user's explicit approval**. Customisations kept in the theme, in a new variant, or in a wrapper survive an update; edits to the component body do not.
