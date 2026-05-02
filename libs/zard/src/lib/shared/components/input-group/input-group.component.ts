import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
  type TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import {
  isTemplateRef,
  ZardStringTemplateOutletDirective,
} from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  inputGroupAddonVariants,
  inputGroupInputVariants,
  inputGroupVariants,
  type ZardInputGroupAddonAlignVariants,
  type ZardInputGroupAddonPositionVariants,
  type ZardInputGroupSizeVariants,
} from './input-group.variants';
import { ZardInputComponent } from '../input/input.component';
import { ZardLoaderComponent } from '../loader/loader.component';
import { ZardTextareaDirective } from '../textarea/textarea.component';

@Component({
  selector: 'z-input-group',
  imports: [ZardStringTemplateOutletDirective, ZardLoaderComponent, ZardIdDirective],
  template: `
    <ng-container zardId="input-group" #z="zardId">
      @let addonBefore = zAddonBefore();
      @if (addonBefore) {
        <div [class]="addonBeforeClasses()" [id]="addonBeforeId()" [attr.aria-disabled]="zDisabled() || zLoading()">
          <ng-container *zStringTemplateOutlet="addonBefore">{{ addonBefore }}</ng-container>
        </div>
      }

      <div [class]="inputWrapperClasses()">
        <ng-content select="input[z-input], textarea[z-textarea]" />

        @if (zLoading()) {
          <z-loader zSize="sm" />
        }
      </div>

      @let addonAfter = zAddonAfter();
      @if (addonAfter) {
        <div [class]="addonAfterClasses()" [id]="addonAfterId()" [attr.aria-disabled]="zDisabled() || zLoading()">
          <ng-container *zStringTemplateOutlet="addonAfter">{{ addonAfter }}</ng-container>
        </div>
      }
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.aria-disabled]': 'zDisabled() || zLoading()',
    '[attr.data-disabled]': 'zDisabled() || zLoading()',
    '[attr.aria-busy]': 'zLoading()',
    'data-slot': 'input-group',
    role: 'group',
  },
})
export class ZardInputGroupComponent {
  readonly class = input<ClassValue>('');
  readonly zAddonAfter = input<string | TemplateRef<void>>('');
  readonly zAddonAlign = input<ZardInputGroupAddonAlignVariants>('inline');
  readonly zAddonBefore = input<string | TemplateRef<void>>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zLoading = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardInputGroupSizeVariants>('default');

  private readonly contentInput = contentChild<ZardInputComponent>(ZardInputComponent);
  private readonly contentTextarea = contentChild<ZardTextareaDirective>(ZardTextareaDirective);
  private readonly contentControl = computed(() => this.contentTextarea() ?? this.contentInput());
  private readonly uniqueId = viewChild<ZardIdDirective>('z');

  protected readonly addonBeforeId = computed(() => `${this.uniqueId()?.id() ?? 'input-group'}-addon-before`);
  protected readonly addonAfterId = computed(() => `${this.uniqueId()?.id() ?? 'input-group'}-addon-after`);
  protected readonly isAddonBeforeTemplate = computed(() => isTemplateRef(this.zAddonBefore()));
  protected readonly classes = computed(() => {
    const isTextarea = this.contentTextarea() != null;
    return mergeClasses(
      'w-full',
      inputGroupVariants({
        zSize: this.zSize(),
        zDisabled: this.zDisabled() || this.zLoading(),
      }),
      !isTextarea && !this.zAddonBefore() ? 'pl-2.5' : '',
      !isTextarea && !this.zAddonAfter() ? 'pr-2.5' : '',
      this.class(),
    );
  });

  protected readonly inputWrapperClasses = computed(() =>
    mergeClasses(
      inputGroupInputVariants({
        zSize: this.zSize(),
        zHasAddonBefore: Boolean(this.zAddonBefore()),
        zHasAddonAfter: Boolean(this.zAddonAfter()),
        zDisabled: this.zDisabled() || this.zLoading(),
      }),
      'relative',
    ),
  );

  protected readonly addonAfterClasses = computed(() => this.addonClasses('after'));
  protected readonly addonBeforeClasses = computed(() =>
    mergeClasses(this.addonClasses('before'), this.isAddonBeforeTemplate() ? 'pr-0.5' : ''),
  );

  constructor() {
    effect(() => {
      const inputDirective = this.contentInput();
      const textareaDirective = this.contentTextarea();
      const disabled = this.zDisabled();

      inputDirective?.disable(disabled);
      inputDirective?.setDataSlot('input-group-control');
      textareaDirective?.disable(disabled);
      textareaDirective?.setDataSlot('input-group-control');
    });
  }

  private addonClasses(position: ZardInputGroupAddonPositionVariants): string {
    return mergeClasses(
      inputGroupAddonVariants({
        zAlign: this.zAddonAlign(),
        zDisabled: this.zDisabled() || this.zLoading(),
        zPosition: position,
        zSize: this.zSize(),
        zType: this.contentTextarea() != null ? 'textarea' : 'default',
      }),
    );
  }
}
