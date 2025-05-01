import { Component, computed, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-command-option',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm outline-none"
      [class.opacity-50]="zDisabled()"
      [class.cursor-not-allowed]="zDisabled()"
      [class.hover:bg-slate-100]="!zDisabled()"
      [class.dark:hover:bg-slate-700]="!zDisabled()"
      [class.bg-slate-100]="zSelected() && !zDisabled()"
      [class.dark:bg-slate-700]="zSelected() && !zDisabled()"
    >
      <ng-container *ngIf="zIcon()">
        <i *ngIf="isStringIcon()" [class]="zIcon()" class="mr-2"></i>
        <ng-container *ngIf="!isStringIcon()">
          <ng-container *ngTemplateOutlet="zIcon()"></ng-container>
        </ng-container>
      </ng-container>

      <span class="flex-1">
        <ng-container *ngIf="isStringLabel(); else templateLabel">
          {{ zLabel() }}
        </ng-container>
        <ng-template #templateLabel>
          <ng-container *ngTemplateOutlet="zLabel()"></ng-container>
        </ng-template>
      </span>

      <span *ngIf="zCommand()" class="text-xs text-slate-500">{{ zCommand() }}</span>
      <kbd *ngIf="zShortcut()" class="ml-2 text-xs">{{ zShortcut() }}</kbd>
    </div>
  `,
})
export class ZardCommandOptionComponent {
  readonly zValue = model.required<any>();
  readonly zLabel = model.required<any>();
  readonly zIcon = model<any>();
  readonly zCommand = model<string>();
  readonly zShortcut = model<string>();
  readonly zDisabled = model<boolean>(false);
  readonly zSelected = model<boolean>(false);

  protected readonly isStringLabel = computed(() => typeof this.zLabel() === 'string');
  protected readonly isStringIcon = computed(() => typeof this.zIcon() === 'string');
}
