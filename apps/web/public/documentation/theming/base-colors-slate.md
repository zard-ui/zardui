```css
@import "tailwindcss";

@theme {
  /* Slate Theme */
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 84% 4.9%;
  --color-card: 0 0% 100%;
  --color-card-foreground: 222.2 84% 4.9%;
  --color-popover: 0 0% 100%;
  --color-popover-foreground: 222.2 84% 4.9%;
  --color-primary: 222.2 47.4% 11.2%;
  --color-primary-foreground: 210 40% 98%;
  --color-secondary: 210 40% 96%;
  --color-secondary-foreground: 222.2 84% 4.9%;
  --color-muted: 210 40% 96%;
  --color-muted-foreground: 215.4 16.3% 46.9%;
  --color-accent: 210 40% 96%;
  --color-accent-foreground: 222.2 84% 4.9%;
  --color-destructive: 0 84.2% 60.2%;
  --color-destructive-foreground: 210 40% 98%;
  --color-border: 214.3 31.8% 91.4%;
  --color-input: 214.3 31.8% 91.4%;
  --color-ring: 222.2 47.4% 11.2%;
  --radius: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: 222.2 84% 4.9%;
    --color-foreground: 210 40% 98%;
    --color-card: 222.2 84% 4.9%;
    --color-card-foreground: 210 40% 98%;
    --color-popover: 222.2 84% 4.9%;
    --color-popover-foreground: 210 40% 98%;
    --color-primary: 210 40% 98%;
    --color-primary-foreground: 222.2 47.4% 11.2%;
    --color-secondary: 217.2 32.6% 17.5%;
    --color-secondary-foreground: 210 40% 98%;
    --color-muted: 217.2 32.6% 17.5%;
    --color-muted-foreground: 215 20.2% 65.1%;
    --color-accent: 217.2 32.6% 17.5%;
    --color-accent-foreground: 210 40% 98%;
    --color-destructive: 0 62.8% 30.6%;
    --color-destructive-foreground: 210 40% 98%;
    --color-border: 217.2 32.6% 17.5%;
    --color-input: 217.2 32.6% 17.5%;
    --color-ring: 212.7 26.8% 83.9%;
  }
}
```