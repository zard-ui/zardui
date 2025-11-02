# Using Dark Mode Classes

Apply dark mode styles to your components using the `dark:` prefix:

## Basic Examples

```html
<!-- Background colors -->
<div class="bg-white dark:bg-gray-900">Light background becomes dark</div>

<!-- Text colors -->
<p class="text-gray-900 dark:text-white">Dark text becomes light</p>

<!-- Border colors -->
<div class="border border-gray-200 dark:border-gray-700">Subtle borders for both themes</div>
```

## Component Styling

```html
<!-- Card component with theme support -->
<div
  class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/20"
>
  <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Card Title</h3>
  <p class="text-gray-600 dark:text-gray-300">Card description that adapts to both light and dark themes.</p>
  <button
    class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
  >
    Action Button
  </button>
</div>
```

## Form Elements

```html
<!-- Input with dark mode support -->
<input
  type="text"
  placeholder="Enter text..."
  class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
/>

<!-- Select dropdown -->
<select
  class="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

## Navigation Elements

```html
<!-- Navigation bar -->
<nav class="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
  <div class="mx-auto max-w-7xl px-4">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <img src="/logo.svg" alt="Logo" class="h-8 dark:invert" />
      </div>

      <!-- Menu items -->
      <div class="flex space-x-4">
        <a
          href="/"
          class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          Home
        </a>
        <a
          href="/about"
          class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          About
        </a>
      </div>
    </div>
  </div>
</nav>
```

## Best Practices

1. **Always provide both variants**: Every element that can be seen should have both light and dark styles
2. **Test contrast ratios**: Ensure text remains readable in both themes
3. **Consider hover states**: Dark mode hover states often need different values
4. **Use semantic colors**: Prefer colors that convey meaning (success, error, warning)
5. **Don't forget focus states**: Ensure focus indicators work in both themes

## Common Color Patterns

```css
/* Background layers */
bg-white dark:bg-gray-900          /* Main background */
bg-gray-50 dark:bg-gray-800        /* Secondary background */
bg-gray-100 dark:bg-gray-700       /* Tertiary background */

/* Text colors */
text-gray-900 dark:text-white      /* Primary text */
text-gray-600 dark:text-gray-300   /* Secondary text */
text-gray-500 dark:text-gray-400   /* Tertiary text */

/* Border colors */
border-gray-200 dark:border-gray-700   /* Subtle borders */
border-gray-300 dark:border-gray-600   /* Prominent borders */
```
