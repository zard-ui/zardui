# Conditional Logic Based on Theme

Use the DarkMode service for conditional logic in your Angular components:

## Basic Theme Detection

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>Current theme: {{ currentTheme }}</p>
      <p>Is dark mode: {{ isDarkMode }}</p>
      
      <!-- Conditional content based on theme -->
      @if (isDarkMode) {
        <img src="/logo-dark.svg" alt="Dark logo">
      } @else {
        <img src="/logo-light.svg" alt="Light logo">
      }
    </div>
  `
})
export class ExampleComponent implements OnInit {
  private darkModeService = inject(DarkModeService);
  
  currentTheme: 'light' | 'dark' = 'light';
  isDarkMode = false;

  ngOnInit(): void {
    this.updateThemeState();
    
    // Optional: Listen for theme changes
    // You might want to implement an observable in the service for this
  }

  private updateThemeState(): void {
    this.currentTheme = this.darkModeService.getCurrentTheme();
    this.isDarkMode = this.currentTheme === 'dark';
  }
}
```

## Reactive Theme Detection with Signals

```typescript
import { Component, inject, signal, effect } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-reactive-example',
  template: `
    <div>
      <p>Current theme: {{ currentTheme() }}</p>
      
      <!-- Reactive conditional rendering -->
      @if (currentTheme() === 'dark') {
        <div class="dark-specific-content">
          <h2>Dark Mode Content</h2>
          <p>This content only shows in dark mode</p>
        </div>
      } @else {
        <div class="light-specific-content">
          <h2>Light Mode Content</h2>
          <p>This content only shows in light mode</p>
        </div>
      }
    </div>
  `
})
export class ReactiveExampleComponent {
  private darkModeService = inject(DarkModeService);
  
  currentTheme = signal<'light' | 'dark'>('light');

  constructor() {
    // Update signal when theme changes
    effect(() => {
      this.currentTheme.set(this.darkModeService.getCurrentTheme());
    });
  }
}
```

## Dynamic Styling Based on Theme

```typescript
import { Component, inject, computed } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-dynamic-styling',
  template: `
    <div [style]="dynamicStyles()">
      <h1>Dynamically styled content</h1>
      <p>Background color changes based on theme</p>
    </div>
  `
})
export class DynamicStylingComponent {
  private darkModeService = inject(DarkModeService);

  dynamicStyles = computed(() => {
    const isDark = this.darkModeService.getCurrentTheme() === 'dark';
    
    return {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#ffffff' : '#1f2937',
      padding: '2rem',
      borderRadius: '0.5rem',
      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
    };
  });
}
```

## Theme-Specific API Calls

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-api-example',
  template: `
    <div>
      <img [src]="logoUrl" alt="Logo">
      <div [innerHTML]="styledContent"></div>
    </div>
  `
})
export class ApiExampleComponent implements OnInit {
  private http = inject(HttpClient);
  private darkModeService = inject(DarkModeService);
  
  logoUrl = '';
  styledContent = '';

  ngOnInit(): void {
    this.loadThemeSpecificContent();
  }

  private loadThemeSpecificContent(): void {
    const theme = this.darkModeService.getCurrentTheme();
    
    // Load different assets based on theme
    this.logoUrl = `/assets/logo-${theme}.svg`;
    
    // Make API calls with theme context
    this.http.get<{content: string}>(`/api/content?theme=${theme}`)
      .subscribe(response => {
        this.styledContent = response.content;
      });
  }
}
```

## Theme-Aware Charts/Graphics

```typescript
import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DarkModeService } from '../services/darkmode.service';

@Component({
  selector: 'app-chart-example',
  template: `
    <canvas #chartCanvas width="400" height="200"></canvas>
  `
})
export class ChartExampleComponent implements OnInit {
  @ViewChild('chartCanvas', { static: true }) 
  canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private darkModeService = inject(DarkModeService);

  ngOnInit(): void {
    this.drawChart();
  }

  private drawChart(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const isDark = this.darkModeService.getCurrentTheme() === 'dark';

    // Theme-aware colors
    const colors = {
      background: isDark ? '#1f2937' : '#ffffff',
      text: isDark ? '#ffffff' : '#1f2937',
      primary: isDark ? '#60a5fa' : '#3b82f6',
      secondary: isDark ? '#34d399' : '#10b981'
    };

    // Clear canvas with theme background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw chart elements with theme colors
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(150, 100);
    ctx.lineTo(250, 120);
    ctx.lineTo(350, 80);
    ctx.stroke();

    // Add labels with theme text color
    ctx.fillStyle = colors.text;
    ctx.font = '14px Arial';
    ctx.fillText('Sample Chart', 160, 30);
  }
}
```

## Common Use Cases

1. **Logo swapping**: Different logos for light/dark themes
2. **Image variants**: Different images optimized for each theme
3. **Chart colors**: Adjust chart colors for better visibility
4. **API parameters**: Send theme preference to backend APIs
5. **Animation tweaks**: Different animation styles per theme
6. **Content visibility**: Show/hide content based on theme