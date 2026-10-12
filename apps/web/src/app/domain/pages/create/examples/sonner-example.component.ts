import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardSonnerComponent, ZardSonnerService } from '@zard/components/sonner';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { ExampleImports } from './example.component';

/** shadcn/ui's `sonner-example`, in zard. */
@Component({
  selector: 'z-sonner-example',
  imports: [ExampleImports, ZardButtonComponent, ZardSonnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic" zClass="items-center justify-center">
        <button type="button" z-button zType="outline" class="w-fit" (click)="showBasic()">Show Toast</button>
      </z-example>

      <z-example zTitle="With Description" zClass="items-center justify-center">
        <button type="button" z-button zType="outline" class="w-fit" (click)="showWithDescription()">Show Toast</button>
      </z-example>
    </z-example-wrapper>
    <!-- The preview page has no toaster of its own; shadcn's sits bottom-right. -->
    <z-sonner position="bottom-right" [theme]="darkMode.themeMode()" />
  `,
})
export class SonnerExampleComponent {
  private readonly sonner = inject(ZardSonnerService);
  protected readonly darkMode = inject(ZardDarkMode);

  protected showBasic(): void {
    this.sonner.show('Event has been created');
  }

  protected showWithDescription(): void {
    this.sonner.show('Event has been created', { description: 'Monday, January 3rd at 6:00pm' });
  }
}
