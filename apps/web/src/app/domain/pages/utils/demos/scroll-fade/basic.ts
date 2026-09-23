import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';

interface Activity {
  id: number;
  initials: string;
  name: string;
  action: string;
  time: string;
}

const ACTIVITY: Activity[] = [
  { id: 1, initials: 'AL', name: 'Ana Lima', action: 'opened a pull request', time: '2m' },
  { id: 2, initials: 'BR', name: 'Bruno Reis', action: 'approved a review', time: '9m' },
  { id: 3, initials: 'CM', name: 'Clara Matos', action: 'pushed 3 commits', time: '14m' },
  { id: 4, initials: 'DF', name: 'Diego Faria', action: 'closed an issue', time: '31m' },
  { id: 5, initials: 'EN', name: 'Elisa Nunes', action: 'left a comment', time: '48m' },
  { id: 6, initials: 'FS', name: 'Felipe Souza', action: 'merged a branch', time: '1h' },
  { id: 7, initials: 'GP', name: 'Gabriela Pinto', action: 'published a release', time: '2h' },
  { id: 8, initials: 'HC', name: 'Hugo Castro', action: 'requested changes', time: '3h' },
  { id: 9, initials: 'IM', name: 'Ines Moreira', action: 'reopened an issue', time: '5h' },
  { id: 10, initials: 'JT', name: 'Joao Teles', action: 'added a label', time: '8h' },
  { id: 11, initials: 'KV', name: 'Karina Vieira', action: 'renamed a branch', time: '11h' },
  { id: 12, initials: 'LB', name: 'Lucas Braga', action: 'deleted a stale tag', time: '1d' },
];

@Component({
  selector: 'z-utils-scroll-fade-basic',
  imports: [ZardAvatarComponent, ZardSeparatorComponent],
  template: `
    <div class="bg-card w-full max-w-sm rounded-xl border">
      <p class="border-b px-4 py-3 text-sm font-medium">Activity</p>

      <!-- scroll-fade only paints the mask; overflow-y-auto is what makes the list scroll. -->
      <div class="scroll-fade h-72 overflow-y-auto px-4">
        @for (item of activity; track item.id; let last = $last) {
          <div class="flex items-center gap-3 py-3">
            <z-avatar zSize="sm" [zFallback]="item.initials" />
            <p class="min-w-0 flex-1 truncate text-sm">
              <span class="font-medium">{{ item.name }}</span>
              {{ item.action }}
            </p>
            <span class="text-muted-foreground shrink-0 text-xs">{{ item.time }}</span>
          </div>
          @if (!last) {
            <z-separator />
          }
        }
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadeBasicComponent {
  protected readonly activity = ACTIVITY;
}
