import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardColorPickerComponent } from '@zard/components/color-picker/color-picker.component';

import { CUSTOM_TOKEN_GROUPS, type CustomToken, type ThemeMode } from '../lib/custom-theme';
import { CreateStateService } from '../services/create-state.service';

/**
 * The Custom mode's color editor: every theme token, grouped as the CSS has them, each with a color picker.
 *
 * It edits the mode on screen (light or dark): switching the mode here switches the preview too, so what is being
 * edited is always what is being looked at. A drag paints the preview live; the color the user lets go of is the one
 * that reaches the URL and the history.
 */
@Component({
  selector: 'z-create-theme-editor',
  imports: [ZardButtonComponent, ZardColorPickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-w-0 flex-col gap-3', 'data-testid': 'theme-editor' },
  template: `
    <div class="flex items-center justify-between gap-2">
      <div class="bg-muted flex rounded-lg p-0.5" role="group" aria-label="Mode being edited">
        @for (option of modes; track option) {
          <button
            type="button"
            class="text-muted-foreground aria-pressed:bg-background aria-pressed:text-foreground focus-visible:ring-ring/50 h-7 rounded-md px-2.5 text-xs font-medium capitalize outline-none focus-visible:ring-2"
            [attr.aria-pressed]="mode() === option"
            [attr.data-mode]="option"
            (click)="setMode(option)"
          >
            {{ option }}
          </button>
        }
      </div>
      <button
        type="button"
        z-button
        zType="ghost"
        zSize="sm"
        class="h-7 px-2 text-xs"
        data-testid="reset-colors"
        [attr.aria-label]="'Reset the ' + mode() + ' colors'"
        [disabled]="!changed()"
        (click)="state.resetCustom(mode())"
      >
        Reset
      </button>
    </div>

    @for (group of groups; track group.id) {
      <fieldset class="flex min-w-0 flex-col gap-1" [attr.data-token-group]="group.id">
        <legend class="text-muted-foreground mb-1 text-xs font-medium">{{ group.label }}</legend>
        @for (token of group.tokens; track token) {
          <div class="flex min-w-0 items-center gap-2" [attr.data-token]="token">
            <label class="min-w-0 flex-1 truncate font-mono text-xs" [for]="'create-token-' + token">
              {{ token }}
              @if (isChanged(token)) {
                <span class="bg-primary ms-1 inline-block size-1.5 rounded-full align-middle" aria-hidden="true"></span>
                <span class="sr-only">(changed)</span>
              }
            </label>
            <z-color-picker
              zSize="sm"
              zFormat="oklch"
              zAlpha
              zAlign="end"
              [zId]="'create-token-' + token"
              [zShowFormatToggle]="false"
              [value]="valueOf(token)"
              (zColorChange)="state.previewCustomToken(mode(), token, $event)"
              (zColorCommit)="state.setCustomToken(mode(), token, $event)"
            />
          </div>
        }
      </fieldset>
    }
  `,
})
export class CreateThemeEditorComponent {
  protected readonly state = inject(CreateStateService);

  protected readonly groups = CUSTOM_TOKEN_GROUPS;
  protected readonly modes: readonly ThemeMode[] = ['light', 'dark'];

  protected readonly mode = computed<ThemeMode>(() => (this.state.dark() ? 'dark' : 'light'));
  protected readonly changed = computed(() => Object.keys(this.state.custom()?.[this.mode()] ?? {}).length > 0);

  protected valueOf(token: CustomToken): string {
    return this.state.tokens()[this.mode()][token] ?? '';
  }

  protected isChanged(token: CustomToken): boolean {
    return !!this.state.custom()?.[this.mode()][token];
  }

  protected setMode(mode: ThemeMode): void {
    if (mode !== this.mode()) this.state.toggleDark();
  }
}
