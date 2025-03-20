import { Component, input } from '@angular/core';

@Component({
  selector: 'z-banner',
  standalone: true,
  template: `
    <aside [class]="'w-full text-center py-2 ' + (isDevMode() ? 'bg-red-400' : 'bg-primary')">
      <h1 [class]="isDevMode() ? 'text-foreground' : 'text-primary-foreground'">
        <ng-content></ng-content>
      </h1>
    </aside>
  `,
})
export class BannerComponent {
  readonly isDevMode = input(false);
}
