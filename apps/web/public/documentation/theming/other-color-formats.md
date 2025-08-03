While ZardUI primarily uses OKLCH for better color accuracy and perceptual uniformity, you can also use other color formats with TailwindCSS v4:

```css
@theme {
  /* OKLCH (recommended) */
  --color-primary: oklch(0.64 0.22 260);
  
  /* RGB */
  --color-secondary: rgb(59 130 246);
  
  /* HSL */
  --color-accent: hsl(210 100% 50%);
  
  /* HEX */
  --color-muted: #6b7280;
}
```

See the [TailwindCSS documentation](https://tailwindcss.com/docs/colors) for more information on using different color formats.