```css
@import "tailwindcss";

@theme {
  /* Gray Theme */
  --color-background: 0 0% 100%;
  --color-foreground: 0 0% 3.9%;
  --color-card: 0 0% 100%;
  --color-card-foreground: 0 0% 3.9%;
  --color-popover: 0 0% 100%;
  --color-popover-foreground: 0 0% 3.9%;
  --color-primary: 0 0% 9%;
  --color-primary-foreground: 0 0% 98%;
  --color-secondary: 0 0% 96.1%;
  --color-secondary-foreground: 0 0% 9%;
  --color-muted: 0 0% 96.1%;
  --color-muted-foreground: 0 0% 45.1%;
  --color-accent: 0 0% 96.1%;
  --color-accent-foreground: 0 0% 9%;
  --color-destructive: 0 84.2% 60.2%;
  --color-destructive-foreground: 0 0% 98%;
  --color-border: 0 0% 89.8%;
  --color-input: 0 0% 89.8%;
  --color-ring: 0 0% 3.9%;
  --radius: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: 0 0% 3.9%;
    --color-foreground: 0 0% 98%;
    --color-card: 0 0% 3.9%;
    --color-card-foreground: 0 0% 98%;
    --color-popover: 0 0% 3.9%;
    --color-popover-foreground: 0 0% 98%;
    --color-primary: 0 0% 98%;
    --color-primary-foreground: 0 0% 9%;
    --color-secondary: 0 0% 14.9%;
    --color-secondary-foreground: 0 0% 98%;
    --color-muted: 0 0% 14.9%;
    --color-muted-foreground: 0 0% 63.9%;
    --color-accent: 0 0% 14.9%;
    --color-accent-foreground: 0 0% 98%;
    --color-destructive: 0 62.8% 30.6%;
    --color-destructive-foreground: 0 0% 98%;
    --color-border: 0 0% 14.9%;
    --color-input: 0 0% 14.9%;
    --color-ring: 0 0% 83.1%;
  }
}
```