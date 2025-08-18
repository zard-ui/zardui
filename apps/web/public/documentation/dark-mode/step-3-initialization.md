# Step 3: Initialize in Your App

Initialize the DarkMode service in your main application component:

## In App Component

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { DarkModeService } from './services/darkmode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private darkModeService = inject(DarkModeService);

  ngOnInit(): void {
    // Initialize theme on app startup
    this.darkModeService.initTheme();
  }
}
```

## Alternative: In main.ts (Standalone App)

For standalone applications, you can initialize in `main.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DarkModeService } from './app/services/darkmode.service';

bootstrapApplication(AppComponent, {
  providers: [
    // other providers
  ]
}).then(() => {
  // Initialize theme after app bootstrap
  const darkModeService = new DarkModeService();
  darkModeService.initTheme();
});
```

## What happens during initialization

1. **Checks localStorage**: Looks for saved user preference
2. **Falls back to system**: Uses system preference if no saved preference
3. **Applies theme**: Adds/removes `.dark` class from `<html>`
4. **Ready to use**: Theme system is now active

## Verification

After initialization, check your browser's developer tools:
- Light mode: `<html>` has no `.dark` class
- Dark mode: `<html class="dark">` has the dark class