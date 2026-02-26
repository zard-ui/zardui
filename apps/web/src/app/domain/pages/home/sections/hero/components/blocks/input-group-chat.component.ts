import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardInputGroupComponent } from '@zard/components/input-group/input-group.component';
import { ZardTooltipDirective } from '@zard/components/tooltip';

@Component({
  selector: 'z-block-input-group-chat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardButtonGroupComponent,
    ZardInputGroupComponent,
    ZardInputDirective,
    ZardIconComponent,
    ZardTooltipDirective,
  ],
  template: `
    <z-button-group class="w-full [--radius:9999rem]">
      <z-button-group>
        <button z-button zType="outline" zShape="circle" aria-label="Add">
          <z-icon zType="plus" />
        </button>
      </z-button-group>
      <z-button-group class="flex-1">
        <z-input-group [zAddonAfter]="voiceButton">
          <input
            z-input
            [placeholder]="voiceEnabled() ? 'Record and send audio...' : 'Send a message...'"
            [disabled]="voiceEnabled()"
          />
        </z-input-group>
        <ng-template #voiceButton>
          <button
            z-button
            zTooltip="Voice Mode"
            zType="ghost"
            zSize="sm"
            zShape="circle"
            class="size-6!"
            [class.bg-primary]="voiceEnabled()"
            [class.text-primary-foreground]="voiceEnabled()"
            [attr.aria-pressed]="voiceEnabled()"
            [attr.data-active]="voiceEnabled()"
            aria-label="Voice Mode"
            (click)="toggleVoice()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-audio-lines-icon lucide-audio-lines"
            >
              <path d="M2 10v3" />
              <path d="M6 6v11" />
              <path d="M10 3v18" />
              <path d="M14 8v7" />
              <path d="M18 5v13" />
              <path d="M22 10v3" />
            </svg>
          </button>
        </ng-template>
      </z-button-group>
    </z-button-group>
  `,
})
export class BlockInputGroupChatComponent {
  readonly voiceEnabled = signal(false);

  toggleVoice(): void {
    this.voiceEnabled.update(v => !v);
  }
}
