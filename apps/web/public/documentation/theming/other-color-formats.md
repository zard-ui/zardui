# Other color formats

The raw tokens in `:root` / `.dark` hold plain CSS colors, so any color function works.
Keep the `@theme inline` mapping untouched — that is what turns a token into a Tailwind utility.

```css title="src/styles.css" copyButton
:root {
  /* OKLCH — what ZardUI ships */
  --primary: oklch(0.205 0 0);

  /* RGB */
  --secondary: rgb(244 244 245);

  /* HSL */
  --accent: hsl(240 5% 96%);

  /* HEX */
  --muted: #f4f4f5;
}
```
