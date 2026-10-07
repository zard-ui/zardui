---
title: Typeset
description: A styling system for HTML and rendered markdown, from blog posts to streaming chat. One CSS file you own.
---

# Typeset

A styling system for HTML and rendered markdown, from blog posts to streaming chat. One CSS file you own.

You render markdown and get back plain unstyled HTML: headings, paragraphs, lists, tables. So you style the elements one by one — font sizes, line heights, spacing. You do it for the blog. Then again for the docs. Then again for the chat. Every time, the same fight: sizing and spacing.

Typeset is one CSS file that styles everything inside a `typeset` container. The file lives in your project, so you change it directly when you need to.

A typeset is a small preset class. You can keep several in one app, one per context.

src/styles.css

```
.typeset-docs {
  --typeset-size: 15px;
  --typeset-flow: 1.5em;
}
```

Pick fonts and rhythm visually in the [typeset builder](/typeset) ; it hands you the CSS, the font install commands and the preset.

## Principles

Scale ratios, tracking, kerning, optical sizing, measure, leading, the space above and below every element — exposing all of it is too much. Typeset condenses it into three controls: **size** , **leading** and **flow** . Heading sizes, list indents, the gap under a heading, the space around a rule: all derived. Three controls. That is the rhythm.

## Features

- **It fits its container.** Sizes are in `em` , never `rem` . Put it in a chat bubble and it follows the smaller type around it. Put it in an article and it scales with the page. On small screens it gets a small bump for readability.
- **It uses your theme.** Colors, fonts and radius come from your tokens. Dark mode follows.
- **It is easy to tune.** Three values control base size, line height and block spacing.
- **It works with streaming.** A new block arriving never restyles the blocks already on screen.

### Live preview

Everything below this line is plain HTML inside a `typeset typeset-docs` container. No utility class on any element in it.

## The rhythm of a page

Three controls decide how this reads: the base *size* , the *leading* between lines, and the *flow* between blocks. Every other measurement on this page derives from those three.

### What derives from them

- Heading sizes, and the space each one takes above itself.
- The indent of a list, and the gap between its items.
- The margin around a rule, and the padding inside a code block.

> The layout owns the measure. Typeset sets no `max-width` of its own.

Inline code such as `--typeset-flow` picks up the mono family, and a link keeps the surrounding weight.

---

A rule closes a section, and the heading after it starts the next one without extra space.

## Installation

The CLI writes `typeset.css` next to your global stylesheet and adds the import for you. Manually, copy the file and import it after Tailwind.

```
npx zard-cli@latest add typeset
```

### Then wrap your content

`typeset` turns the styles on. `typeset-docs` is your preset.

```
<div class="typeset typeset-docs">
  <!-- rendered markdown -->
</div>
```

## Custom typesets

Six variables govern the whole system. Three of them name font families; the other three are the rhythm.

typeset.css

```
.typeset {
  --typeset-font-body: inherit;
  --typeset-font-heading: var(--font-heading, var(--font-sans, inherit));
  --typeset-font-mono: var(--font-mono);

  --typeset-size: 1em; /* body font-size */
  --typeset-leading: 1.75; /* line-height */
  --typeset-flow: 1.25em; /* space between blocks */
}
```

- `--typeset-size` sets the base text size. `1em` follows the surrounding layout.
- `--typeset-leading` sets the space between lines.
- `--typeset-flow` sets the space between blocks; headings and rules derive their spacing from it.

Typeset sets no max-width

Your layout owns the measure. The builder's Measure control puts it on the wrapper instead of hiding it in the stylesheet, so typeset never argues with the layout around it.

### Several presets in one app

One per context. They all read the same stylesheet; only the variables differ.

src/styles.css

```
.typeset-chat {
  --typeset-flow: 1em;
  --typeset-leading: 1.6;
}

.typeset-docs {
  --typeset-size: 15px;
  --typeset-flow: 1.5em;
}
```

### One-off, without a preset

An arbitrary-property utility sets the variable on the element itself.

```
<article class="typeset [--typeset-flow:1.75em]">…</article>
```

## Fonts

The three font variables tell typeset which families to use. Leave them alone and typeset follows your app.

`--font-sans` and `--font-mono` already exist in a zard theme. `--font-heading` does not: define it only if you want headings on a different face from body text — otherwise typeset falls back to `--font-sans` .

src/styles.css

```
@import '@fontsource-variable/lora';

:root {
  --font-lora: 'Lora Variable', serif;
}

.typeset-reading {
  --typeset-font-body: var(--font-lora);
  --typeset-font-heading: var(--font-lora);
}
```

## Custom themes

Two presets that change the reading experience, not just the size.

src/styles.css

```
/* Reading: serif, larger type, roomy rhythm. */
.typeset-reading {
  --typeset-font-body: var(--font-lora);
  --typeset-font-heading: var(--font-lora);
  --typeset-size: 18px;
  --typeset-leading: 1.9;
  --typeset-flow: 2em;
}

/* Compact: sans, smaller type, tighter rhythm. */
.typeset-compact {
  --typeset-font-body: var(--font-geist);
  --typeset-font-heading: var(--font-geist);
  --typeset-size: 14px;
  --typeset-leading: 1.6;
  --typeset-flow: 1em;
}
```

## Accessibility and dark mode

A larger preset for readers who need one, and a touch more leading in the dark theme, where thinner strokes read tighter than they measure.

src/styles.css

```
.typeset-large {
  --typeset-size: 16px;
  --typeset-leading: 2;
  --typeset-flow: 2em;
}

.dark .typeset {
  --typeset-leading: 1.9;
}
```

## Responsive table

Tables stay real tables and wrap to fit. To scroll a wide one instead, wrap it. It works for any wide block, not just tables.

```
<div class="typeset-scroll">
  <table>…</table>
</div>
```

## Overrides

Typeset lives in the `components` layer and wraps every element selector in `:where()` , which costs zero specificity. A Tailwind utility on the element wins with no `!important` .

```
<div class="typeset typeset-docs">
  <p class="text-lg">This paragraph is larger than the preset asks for.</p>
</div>
```

## Opting out

`not-typeset` and `data-not-typeset` both cover the element and everything inside it. Another `typeset` container in that subtree stays opted out too.

```
<div class="typeset">
  <p>Styled prose.</p>
  <z-card class="not-typeset">Untouched component.</z-card>
</div>
```

## Streaming

Text that arrives token by token restyles itself if the CSS looks forward. Three rules keep that from happening.

- **No forward-looking selectors.**`:last-child` , `:has()` and `:empty` are kept out of layout rules, because their matches change as content is appended.
- **Spacing flows one way.**`margin-block-start` only. A new block brings its own space.
- **Table separators live on the cells being added** , so a new row never restyles the row above it.

## Prior art

`prose` , from `@tailwindcss/typography` , is excellent at what it was built for. Typeset takes a different approach.

|  | @tailwindcss/typography | Typeset |
| --- | --- | --- |
| Sizing | fixed `rem` scale, `prose-sm` to `prose-2xl` | relative to the container, any size |
| Dark mode | `prose-invert` , a second palette | your tokens flip, nothing to add |
| Theming | prose color variables, scale baked in | your theme tokens, plus font and rhythm controls |
| Overrides | `prose-a:` , `prose-headings:` modifier API | plain utilities and CSS win |
| Streaming | no append-stability contract | designed for stable appends |
| Distribution | npm plugin, generated CSS | one CSS file you own |

Typeset borrows the two best ideas from the plugin: the zero-specificity `:where()` guard, and the escape-hatch class — `not-typeset` , in the spirit of `not-prose` .
