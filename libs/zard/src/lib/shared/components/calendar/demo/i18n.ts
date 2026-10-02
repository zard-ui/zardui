import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardI18nService } from '@/shared/core/i18n';

import { ZardCalendarI18nService } from '../calendar-i18n.service';
import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-i18n',
  imports: [ZardCalendarComponent, ZardButtonComponent],
  template: `
    <div class="flex flex-col items-center gap-4">
      <div class="flex flex-wrap justify-center gap-2">
        @for (loc of locales; track loc.code) {
          <button
            z-button
            type="button"
            [zType]="currentLocale() === loc.code ? 'default' : 'outline'"
            zSize="sm"
            (click)="setLocale(loc.code)"
          >
            {{ loc.label }}
          </button>
        }
      </div>

      <z-calendar zMode="single" class="rounded-lg border" />
    </div>
  `,
  providers: [ZardI18nService, ZardCalendarI18nService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarI18nComponent {
  private readonly i18n = inject(ZardI18nService);

  readonly locales = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'fr-FR', label: 'Français' },
    { code: 'de-DE', label: 'Deutsch' },
    { code: 'es-ES', label: 'Español' },
    { code: 'it-IT', label: 'Italiano' },
    { code: 'pt-BR', label: 'Português' },
  ];

  readonly currentLocale = this.i18n.locale;

  setLocale(code: string): void {
    this.i18n.setLocale(code);
  }
}
