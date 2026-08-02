# Adding new colors

Declare the raw value in `:root` / `.dark`, then map it to a Tailwind color through
`@theme inline` — the same three-step shape ZardUI uses for every built-in token.

```css title="src/styles.css" copyButton
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

```html
<div class="bg-warning text-warning-foreground">Warning message</div>
```
