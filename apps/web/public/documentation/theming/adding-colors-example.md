```css title="src/styles.css"
/* Add to your src/styles.css */
@theme {
  --color-warning: oklch(0.84 0.16 84);
  --color-warning-foreground: oklch(0.28 0.07 46);
}

@theme dark {
  --color-warning: oklch(0.41 0.11 46);
  --color-warning-foreground: oklch(0.99 0.02 95);
}
```

You can now use the `warning` utility class in your Angular components:

```html
<div class="bg-warning text-warning-foreground">Warning message</div>
```
