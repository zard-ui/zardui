# Step 1: Configure TailwindCSS v4

Add the custom variant to your `src/styles.css` file:

```css
@import 'tailwindcss';

@theme {
  /* Your existing theme configuration */
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(8.5% 0 0);
  /* ... other colors */
}

/* Dark mode custom variant */
@custom-variant dark (&:is(.dark *));
```

## What this does

The `@custom-variant` directive:

1. **Creates a new variant**: You can now use `dark:` prefix with any utility
2. **Targets descendants**: Applies to elements inside containers with `.dark` class
3. **Uses modern CSS**: Leverages `:is()` selector for better performance
4. **Works with all utilities**: `dark:bg-gray-900`, `dark:text-white`, etc.

## Examples

After adding the custom variant, you can use:

```html
<!-- These styles apply when .dark class is present -->
<div class="bg-white dark:bg-gray-900">
  <p class="text-black dark:text-white">
    This text changes color based on theme
  </p>
</div>
```

## Verifying the setup

Test that the variant works by temporarily adding the `.dark` class to your `<html>` element and checking if your dark styles apply.