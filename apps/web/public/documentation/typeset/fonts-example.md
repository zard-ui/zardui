# Point typeset at a font

```css title="src/styles.css" copyButton
@import '@fontsource-variable/lora';

:root {
  --font-lora: 'Lora Variable', serif;
}

.typeset-reading {
  --typeset-font-body: var(--font-lora);
  --typeset-font-heading: var(--font-lora);
}
```
