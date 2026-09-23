# Typeset

The prose layer. See [customization.md](../customization.md) for the theme tokens it reads.

Typeset is one CSS file, installed by `zard-cli add typeset`, that styles every element inside a `typeset` container. It exists so that rendered markdown — a blog post, a docs page, a streaming chat reply — does not have to be styled element by element.

## Contents

- Never style rendered markdown element by element
- Six variables, three of them the rhythm
- One preset per context
- `not-typeset` for anything that owns its own styling
- `typeset-scroll` for a wide block
- Utilities win — no `!important`
- Typeset sets no `max-width`
- Nothing outside a `typeset` container changes

---

## Never style rendered markdown element by element

This is the rule the whole file exists for. If the project has typeset installed, prose gets a container class, not a class per tag.

**Incorrect:**

```angular-html
<div [innerHTML]="renderedMarkdown()"></div>
```

```ts
// ...and then a rehype plugin, or a stylesheet, assigning classes per tag:
if (node.tagName === 'h2') node.properties.class = ['text-2xl', 'font-medium', 'mt-6'];
if (node.tagName === 'p') node.properties.class = ['text-base', 'leading-7', 'text-muted-foreground'];
```

**Correct:**

```angular-html
<div class="typeset typeset-docs" [innerHTML]="renderedMarkdown()"></div>
```

Nothing else. The heading sizes, the list indents, the space under a heading and the margin around a rule all come from the stylesheet.

Not installed yet:

```bash
npx zard-cli add typeset
```

It writes `typeset.css` next to the file named by `tailwind.css` in `components.json` and adds the `@import` for it. Running it twice does not duplicate the import.

---

## Six variables, three of them the rhythm

```css
.typeset {
  --typeset-font-body: inherit;
  --typeset-font-heading: var(--font-heading, var(--font-sans, inherit));
  --typeset-font-mono: var(--font-mono);

  --typeset-size: 1em; /* body font-size */
  --typeset-leading: 1.75; /* line-height */
  --typeset-flow: 1.25em; /* space between blocks */
}
```

Three families and three numbers. Everything else derives from the last three — do not add variables to reach a size that already derives from them.

`--font-sans` and `--font-mono` exist in every zard theme. `--font-heading` does not: define it only when headings should sit on a different face from body text. Without it, headings fall back to `--font-sans`.

Sizes are in `em`, never `rem`, so a container sets the scale for everything in it.

---

## One preset per context

A "typeset" is a preset class that redefines the variables. Several coexist.

**Incorrect:**

```css
/* One class, overridden per page with more classes. */
.typeset {
  --typeset-size: 15px;
}
```

**Correct:**

```css
.typeset-docs {
  --typeset-size: 15px;
  --typeset-flow: 1.5em;
}

.typeset-chat {
  --typeset-leading: 1.6;
  --typeset-flow: 1em;
}
```

```angular-html
<article class="typeset typeset-docs">…</article>
<div class="typeset typeset-chat">…</div>
```

`typeset` turns the styles on; the second class carries the values. Build a preset visually at [zardui.com/typeset](https://zardui.com/typeset) — it hands back the CSS, the `@fontsource` install command and the wrapper.

For a one-off, an arbitrary-property utility is enough — no preset needed:

```angular-html
<article class="typeset [--typeset-flow:1.75em]">…</article>
```

---

## `not-typeset` for anything that owns its own styling

A zard component embedded in prose brings its own sizing. Typeset styling it on top is the bug.

**Incorrect:**

```angular-html
<div class="typeset typeset-docs">
  <p>Rendered prose.</p>
  <z-card>…</z-card>
  <z-code-block [data]="block" />
</div>
```

**Correct:**

```angular-html
<div class="typeset typeset-docs">
  <p>Rendered prose.</p>
  <z-card class="not-typeset">…</z-card>
  <z-code-block class="not-typeset" [data]="block" />
</div>
```

`not-typeset` and `data-not-typeset` both cover the element and its whole subtree. Another `typeset` container nested in that subtree stays opted out too.

The same applies to markdown pipelines: mark the wrapper a code-block plugin builds, rather than hoping its own rules win the cascade.

---

## `typeset-scroll` for a wide block

Tables stay real tables and wrap to fit. A table too wide to read that way gets a wrapper.

**Incorrect:**

```angular-html
<div class="overflow-auto rounded-md border">
  <table class="w-full min-w-3xl">…</table>
</div>
```

**Correct:**

```angular-html
<div class="typeset-scroll">
  <table>…</table>
</div>
```

The wrapper owns the flow margin and gives the table back its natural width. It works for any wide block, not just tables.

---

## Utilities win — no `!important`

Typeset lives in the `components` layer and wraps every element selector in `:where()`, which costs zero specificity. A Tailwind utility on the element beats it.

**Incorrect:**

```angular-html
<p class="!text-lg">…</p>
```

**Correct:**

```angular-html
<p class="text-lg">…</p>
```

This is also the escape hatch when a page's heading scale must not move: leave the heading utilities in place and let typeset own the prose around them.

---

## Typeset sets no `max-width`

The measure belongs to the layout. Do not add one to the stylesheet or to a preset.

**Incorrect:**

```css
.typeset-docs {
  --typeset-size: 15px;
  max-width: 65ch;
}
```

**Correct:**

```angular-html
<div class="mx-auto max-w-prose">
  <div class="typeset typeset-docs">…</div>
</div>
```

---

## Nothing outside a `typeset` container changes

Every selector in the file is scoped under `.typeset`. Importing it cannot restyle the rest of the app — so if something outside a container moved, the cause is elsewhere.

Streaming content is safe by construction: no `:last-child`, `:has()` or `:empty` in layout rules, and spacing flows one way with `margin-block-start` only. A block appended to a container never restyles the blocks above it. Do not add a rule that breaks either guarantee.

---

## Reference

- [zardui.com/docs/typeset](https://zardui.com/docs/typeset) — the full documentation
- [zardui.com/typeset](https://zardui.com/typeset) — the builder
- `<registryUrl>/typeset.json` — the stylesheet as the registry publishes it
