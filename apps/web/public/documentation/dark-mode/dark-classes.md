# Using Dark Mode Classes

Apply dark mode styles to your components using the `dark:` prefix:

## Basic Examples

```html
<!-- Background colors -->
<div class="bg-white dark:bg-gray-900">
  Light background becomes dark
</div>

<!-- Text colors -->
<p class="text-gray-900 dark:text-white">
  Dark text becomes light
</p>

<!-- Border colors -->
<div class="border border-gray-200 dark:border-gray-700">
  Subtle borders for both themes
</div>
```

## Component Styling

```html
<!-- Card component with theme support -->
<div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
    Card Title
  </h3>
  <p class="text-gray-600 dark:text-gray-300">
    Card description that adapts to both light and dark themes.
  </p>
  <button class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md transition-colors">
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
  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
>

<!-- Select dropdown -->
<select class="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

## Navigation Elements

```html
<!-- Navigation bar -->
<nav class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <img src="/logo.svg" alt="Logo" class="h-8 dark:invert">
      </div>
      
      <!-- Menu items -->
      <div class="flex space-x-4">
        <a href="/" class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          Home
        </a>
        <a href="/about" class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
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