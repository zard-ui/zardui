# Styling

See [customization.md](../customization.md) for the theme tokens and how to add one.

## Contents

- Semantic tokens, never raw colours
- Variants before classes
- `class` is for layout
- `mergeClasses`, not concatenation
- No `space-x-*` / `space-y-*`
- `size-*` when width and height match
- No `dark:` colour overrides
- Tailwind v4 — no config file
- No manual z-index on overlays
- CSS utilities: `scroll-fade` and `shimmer`

---

## Semantic tokens, never raw colours

**Incorrect:**

```angular-html
<div class="bg-blue-500 text-white">
  <p class="text-gray-600">Secondary text</p>
</div>
```

**Correct:**

```angular-html
<div class="bg-primary text-primary-foreground">
  <p class="text-muted-foreground">Secondary text</p>
</div>
```

Same for status indicators — use a badge variant or `text-destructive`, not a raw colour:

**Incorrect:**

```angular-html
<span class="text-emerald-600">+20.1%</span>
<span class="text-red-600">Failed</span>
```

**Correct:**

```angular-html
<z-badge zType="secondary">+20.1%</z-badge>
<span class="text-destructive">Failed</span>
```

If you need a colour that has no token, add one to the theme (see [customization.md](../customization.md)) rather than reaching into the Tailwind palette.

---

## Variants before classes

**Incorrect:**

```angular-html
<button z-button class="border-border bg-background hover:bg-muted h-7 px-2.5 text-[0.8rem]">Save</button>
```

**Correct:**

```angular-html
<button z-button zType="outline" zSize="sm">Save</button>
```

---

## `class` is for layout

`class` is merged last and wins the conflict — which is exactly why it must not be used to repaint the component. Use it for `max-w-*`, `mx-auto`, `mt-*`, grid placement.

**Incorrect:**

```angular-html
<z-card class="bg-blue-100 font-bold text-blue-900">…</z-card>
```

**Correct:**

```angular-html
<z-card class="mx-auto max-w-md">…</z-card>
```

---

## `mergeClasses`, not concatenation

`mergeClasses` is `twMerge(clsx(...))`: it resolves conflicting Tailwind utilities instead of emitting both and leaving the winner to source order.

**Incorrect:**

```angular-ts
protected readonly classes = computed(() => `rounded-lg border p-4 ${this.class()}`);
```

**Correct:**

```angular-ts
import { mergeClasses } from '@/shared/utils/merge-classes';

protected readonly classes = computed(() =>
  mergeClasses(cardVariants({ zSize: this.zSize() }), this.zActive() && 'ring-2 ring-ring', this.class()),
);
```

Order: variants, then conditionals, then `this.class()`.

---

## No `space-x-*` / `space-y-*`

Use `gap-*`. `space-y-4` → `flex flex-col gap-4`; `space-x-2` → `flex gap-2`.

**Incorrect:**

```angular-html
<div class="space-y-4">
  <input z-input />
  <button z-button>Submit</button>
</div>
```

**Correct:**

```angular-html
<div class="flex flex-col gap-4">
  <input z-input />
  <button z-button>Submit</button>
</div>
```

---

## `size-*` when width and height match

`size-4`, not `w-4 h-4`. Applies to icons, avatars, skeletons, spinners.

---

## No `dark:` colour overrides

The tokens already switch under `.dark`. A `dark:` colour is a second source of truth that drifts.

**Incorrect:**

```angular-html
<div class="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-50">…</div>
```

**Correct:**

```angular-html
<div class="bg-background text-foreground">…</div>
```

`dark:` for something that is genuinely not a token — a decorative opacity, an image swap — is fine.

---

## Tailwind v4 — no config file

There is no `tailwind.config.js` and nothing to add to one. The theme is CSS: `@theme inline` for the token-to-utility mapping, `@custom-variant` for custom variants. Creating a config file is how a project ends up with settings that the v4 pipeline never reads.

---

## No manual z-index on overlays

Dialog, sheet, popover, tooltip, dropdown and the alert dialog manage their own stacking through the CDK overlay. A `z-50` added by hand competes with it.

---

## CSS utilities: `scroll-fade` and `shimmer`

Two pure-CSS utilities ship in `css/utilities.css`, which `css/tailwind.css` imports (both come from the `core` registry item). No directive, no service, no listener.

`scroll-fade` fades the edges of a scroll container in sync with its scroll position. **It only paints a mask — it does not make the container scrollable.** Always pair it with an overflow class and a height.

```angular-html
<div class="scroll-fade h-72 overflow-y-auto">…</div>
<div class="scroll-fade-x overflow-x-auto">…</div>
```

`scroll-fade`/`scroll-fade-y` fade both vertical edges; `scroll-fade-x` both inline ones. Single edges: `-t` `-b` `-l` `-r` (physical), `-s` `-e` (logical, mirror under RTL). Depth comes from `scroll-fade-<n>` / `scroll-fade-[<value>]` and per edge from `scroll-fade-t-<n>` etc. — those carry a value only, so keep the mask class next to them (`scroll-fade scroll-fade-4`). `scroll-fade-none` disables it.

`shimmer` sweeps a highlight across text while something is being generated. **It is text-only** — on a wrapper it clips that wrapper's background to its own text and everything inside looks broken. Put it on the element that holds the words.

```angular-html
<p class="shimmer text-muted-foreground">Generating response…</p>
```

`shimmer-once` runs a single sweep, `shimmer-reverse` flips the direction, `shimmer-none` turns it off (useful as `md:shimmer-none`). Tune with `shimmer-color-*` (theme colour or arbitrary, `/<opacity>` supported), `shimmer-duration-*` (**milliseconds** — `shimmer-duration-1000` is 1s), `shimmer-spread-*` and `shimmer-angle-*`. The base colour is `currentColor`, so it adapts on its own — including in dark mode — and `prefers-reduced-motion: reduce` disables it automatically.
