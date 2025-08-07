```css
@import "tailwindcss";

@theme {
  /* Your existing theme colors */
  --color-background: 0 0% 100%;
  --color-foreground: 240 10% 3.9%;
  /* ... other colors ... */
  
  /* Adding new warning color */
  --color-warning: 38 92% 50%;
  --color-warning-foreground: 48 96% 89%;
}

@media (prefers-color-scheme: dark) {
  @theme {
    /* Your existing dark theme colors */
    --color-background: 240 10% 3.9%;
    --color-foreground: 0 0% 98%;
    /* ... other colors ... */
    
    /* Dark mode warning colors */
    --color-warning: 48 96% 89%;
    --color-warning-foreground: 38 92% 50%;
  }
}
```