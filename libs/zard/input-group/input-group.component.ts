import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  inputGroupAddonVariants,
  inputGroupInputVariants,
  inputGroupVariants,
  type ZardInputGroupAddonAlignVariants,
  type ZardInputGroupAddonPositionVariants,
} from './input-group.variants';
import {
  isTemplateRef,
  ZardStringTemplateOutletDirective,
} from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { generateId, mergeClasses } from '../core/shared/utils/utils';
import { ZardInputDirective } from '../input/input.directive';
import type { ZardInputSizeVariants } from '../input/input.variants';
import { ZardLoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'z-input-group',
  imports: [ZardStringTemplateOutletDirective, ZardLoaderComponent],
  template: `
    @let addonBefore = zAddonBefore();
    @if (addonBefore) {
      <div [class]="addonBeforeClasses()" [id]="addonBeforeId" [attr.aria-disabled]="zDisabled() || zLoading()">
        <ng-container *zStringTemplateOutlet="addonBefore">{{ addonBefore }}</ng-container>
      </div>
    }

    <div [class]="inputWrapperClasses()">
      <ng-content select="input[z-input], textarea[z-input]" />

      @if (zLoading()) {
        <z-loader zSize="sm" />
      }
    </div>

    @let addonAfter = zAddonAfter();
    @if (addonAfter) {
      <div [class]="addonAfterClasses()" [id]="addonAfterId" [attr.aria-disabled]="zDisabled() || zLoading()">
        <ng-container *zStringTemplateOutlet="addonAfter">{{ addonAfter }}</ng-container>
      </div>
    }
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
  readonly zSize = input<ZardInputSizeVariants>('default');

  private readonly contentInput = contentChild<ZardInputDirective>(ZardInputDirective);
  private readonly uniqueId = generateId('input-group');

  protected readonly addonBeforeId = `${this.uniqueId}-addon-before`;
  protected readonly addonAfterId = `${this.uniqueId}-addon-after`;
  protected readonly isAddonBeforeTemplate = computed(() => isTemplateRef(this.zAddonBefore()));
  protected readonly classes = computed(() =>
    mergeClasses(
      'w-full',
      inputGroupVariants({
        zSize: this.zSize(),
        zDisabled: this.zDisabled() || this.zLoading(),
      }),
      this.class(),
    ),
  );

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
      const contentInput = this.contentInput();
      const disabled = this.zDisabled();
      const size = this.zSize();

      if (size) {
        contentInput?.size.set(size);
      }
      contentInput?.disable(disabled);
      contentInput?.setDataSlot('input-group-control');
    });
  }

  private addonClasses(position: ZardInputGroupAddonPositionVariants): string {
    return mergeClasses(
      inputGroupAddonVariants({
        zAlign: this.zAddonAlign(),
        zDisabled: this.zDisabled() || this.zLoading(),
        zPosition: position,
        zSize: this.zSize(),
        zType: this.contentInput()?.getType() ?? 'default',
      }),
    );
  }
}
