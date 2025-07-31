# Custom Variant Configuration

Add this custom variant to your `src/styles.css` file:

```css
@theme {
  /* Your existing theme configuration */
}

/* Dark mode custom variant */
@custom-variant dark (&:is(.dark *));

/* This enables dark: prefix for all utilities */
/* Example: dark:bg-gray-900, dark:text-white */
```

## How it works

The `@custom-variant dark (&:is(.dark *))` syntax creates a custom variant called `dark` that:

1. Applies styles when an element is a descendant of an element with `.dark` class
2. Uses the modern `:is()` selector for better performance
3. Allows the dark mode to be controlled programmatically by adding/removing the `.dark` class

## Advantages over media queries

- **User control**: Users can toggle themes regardless of system preferences
- **Better performance**: No need to check media query state
- **More reliable**: Works consistently across all browsers
- **Programmatic control**: Easy to toggle via JavaScript/TypeScript