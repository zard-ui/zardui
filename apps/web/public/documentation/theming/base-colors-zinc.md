```css
@import "tailwindcss";

@theme {
  /* Zinc Theme (Default) */
  --color-background: 0 0% 100%;
  --color-foreground: 240 10% 3.9%;
  --color-card: 0 0% 100%;
  --color-card-foreground: 240 10% 3.9%;
  --color-popover: 0 0% 100%;
  --color-popover-foreground: 240 10% 3.9%;
  --color-primary: 240 5.9% 10%;
  --color-primary-foreground: 0 0% 98%;
  --color-secondary: 240 4.8% 95.9%;
  --color-secondary-foreground: 240 5.9% 10%;
  --color-muted: 240 4.8% 95.9%;
  --color-muted-foreground: 240 3.8% 46.1%;
  --color-accent: 240 4.8% 95.9%;
  --color-accent-foreground: 240 5.9% 10%;
  --color-destructive: 0 84.2% 60.2%;
  --color-destructive-foreground: 0 0% 98%;
  --color-border: 240 5.9% 90%;
  --color-input: 240 5.9% 90%;
  --color-ring: 240 5.9% 10%;
  --radius: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: 240 10% 3.9%;
    --color-foreground: 0 0% 98%;
    --color-card: 240 10% 3.9%;
    --color-card-foreground: 0 0% 98%;
    --color-popover: 240 10% 3.9%;
    --color-popover-foreground: 0 0% 98%;
    --color-primary: 0 0% 98%;
    --color-primary-foreground: 240 5.9% 10%;
    --color-secondary: 240 3.7% 15.9%;
    --color-secondary-foreground: 0 0% 98%;
    --color-muted: 240 3.7% 15.9%;
    --color-muted-foreground: 240 5% 64.9%;
    --color-accent: 240 3.7% 15.9%;
    --color-accent-foreground: 0 0% 98%;
    --color-destructive: 0 62.8% 30.6%;
    --color-destructive-foreground: 0 0% 98%;
    --color-border: 240 3.7% 15.9%;
    --color-input: 240 3.7% 15.9%;
    --color-ring: 240 4.9% 83.9%;
  }
}
```