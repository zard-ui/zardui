# Scoped token overrides

Because `@theme inline` emits `var(--primary)` rather than a baked-in color, any container can
redefine a token for its own subtree — no extra Tailwind configuration involved.

```css title="src/styles.css" copyButton
.theme-brand {
  --primary: oklch(0.55 0.22 264);
  --primary-foreground: oklch(0.98 0.01 264);
  --radius: 1rem;
}
```

```html
<section class="theme-brand">
  <!-- Every ZardUI component in here picks up the scoped values. -->
  <button z-button>Brand button</button>
</section>
```
