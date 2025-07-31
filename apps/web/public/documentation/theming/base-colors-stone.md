```css
@import "tailwindcss";

@theme {
  /* Stone Theme */
  --color-background: 0 0% 100%;
  --color-foreground: 20 14.3% 4.1%;
  --color-card: 0 0% 100%;
  --color-card-foreground: 20 14.3% 4.1%;
  --color-popover: 0 0% 100%;
  --color-popover-foreground: 20 14.3% 4.1%;
  --color-primary: 24 9.8% 10%;
  --color-primary-foreground: 60 9.1% 97.8%;
  --color-secondary: 60 4.8% 95.9%;
  --color-secondary-foreground: 24 9.8% 10%;
  --color-muted: 60 4.8% 95.9%;
  --color-muted-foreground: 25 5.3% 44.7%;
  --color-accent: 60 4.8% 95.9%;
  --color-accent-foreground: 24 9.8% 10%;
  --color-destructive: 0 84.2% 60.2%;
  --color-destructive-foreground: 60 9.1% 97.8%;
  --color-border: 20 5.9% 90%;
  --color-input: 20 5.9% 90%;
  --color-ring: 24 9.8% 10%;
  --radius: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: 20 14.3% 4.1%;
    --color-foreground: 60 9.1% 97.8%;
    --color-card: 20 14.3% 4.1%;
    --color-card-foreground: 60 9.1% 97.8%;
    --color-popover: 20 14.3% 4.1%;
    --color-popover-foreground: 60 9.1% 97.8%;
    --color-primary: 60 9.1% 97.8%;
    --color-primary-foreground: 24 9.8% 10%;
    --color-secondary: 12 6.5% 15.1%;
    --color-secondary-foreground: 60 9.1% 97.8%;
    --color-muted: 12 6.5% 15.1%;
    --color-muted-foreground: 24 5.4% 63.9%;
    --color-accent: 12 6.5% 15.1%;
    --color-accent-foreground: 60 9.1% 97.8%;
    --color-destructive: 0 62.8% 30.6%;
    --color-destructive-foreground: 60 9.1% 97.8%;
    --color-border: 12 6.5% 15.1%;
    --color-input: 12 6.5% 15.1%;
    --color-ring: 24 5.7% 82.9%;
  }
}
```