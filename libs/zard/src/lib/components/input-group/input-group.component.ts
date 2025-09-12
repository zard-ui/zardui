import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { inputGroupAddonVariants, inputGroupAffixVariants, inputGroupInputVariants, inputGroupVariants, ZardInputGroupVariants } from './input-group.variants';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { generateId, mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-input-group',
  exportAs: 'zInputGroup',
  standalone: true,
  imports: [ZardStringTemplateOutletDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      [class]="wrapperClasses()"
      [attr.role]="'group'"
      [attr.aria-label]="zAriaLabel()"
      [attr.aria-labelledby]="zAriaLabelledBy()"
      [attr.aria-describedby]="zAriaDescribedBy()"
      [attr.aria-disabled]="zDisabled()"
      [attr.data-disabled]="zDisabled()"
    >
      @if (zAddOnBefore()) {
        <div [class]="addonBeforeClasses()" [id]="addonBeforeId()" [attr.aria-label]="zAddOnBeforeAriaLabel()" [attr.aria-disabled]="zDisabled()">
          <ng-container *zStringTemplateOutlet="zAddOnBefore()">{{ zAddOnBefore() }}</ng-container>
        </div>
      }

      <div [class]="inputWrapperClasses()">
        @if (zPrefix()) {
          <div [class]="prefixClasses()" [id]="prefixId()" [attr.aria-label]="zPrefixAriaLabel()" [attr.aria-hidden]="true">
            <ng-container *zStringTemplateOutlet="zPrefix()">{{ zPrefix() }}</ng-container>
          </div>
        }

        <ng-content select="input[z-input], textarea[z-input]"></ng-content>

        @if (zSuffix()) {
          <div [class]="suffixClasses()" [id]="suffixId()" [attr.aria-label]="zSuffixAriaLabel()" [attr.aria-hidden]="true">
            <ng-container *zStringTemplateOutlet="zSuffix()">{{ zSuffix() }}</ng-container>
          </div>
        }
      </div>

      @if (zAddOnAfter()) {
        <div [class]="addonAfterClasses()" [id]="addonAfterId()" [attr.aria-label]="zAddOnAfterAriaLabel()" [attr.aria-disabled]="zDisabled()">
          <ng-container *zStringTemplateOutlet="zAddOnAfter()">{{ zAddOnAfter() }}</ng-container>
        </div>
      }
    </div>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardInputGroupComponent {
  readonly zSize = input<ZardInputGroupVariants['zSize']>('default');
  readonly zAddOnBefore = input<string | TemplateRef<void>>();
  readonly zAddOnAfter = input<string | TemplateRef<void>>();
  readonly zPrefix = input<string | TemplateRef<void>>();
  readonly zSuffix = input<string | TemplateRef<void>>();
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zBorderless = input(false, { transform: booleanAttribute });
  readonly zAriaLabel = input<string>();
  readonly zAriaLabelledBy = input<string>();
  readonly zAriaDescribedBy = input<string>();
  readonly zAddOnBeforeAriaLabel = input<string>();
  readonly zAddOnAfterAriaLabel = input<string>();
  readonly zPrefixAriaLabel = input<string>();
  readonly zSuffixAriaLabel = input<string>();
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses('w-full', this.class()));

  private readonly uniqueId = generateId('input-group');
  protected readonly addonBeforeId = computed(() => `${this.uniqueId}-addon-before`);
  protected readonly addonAfterId = computed(() => `${this.uniqueId}-addon-after`);
  protected readonly prefixId = computed(() => `${this.uniqueId}-prefix`);
  protected readonly suffixId = computed(() => `${this.uniqueId}-suffix`);

  protected readonly wrapperClasses = computed(() =>
    inputGroupVariants({
      zSize: this.zSize(),
      zDisabled: this.zDisabled(),
    }),
  );

  protected readonly addonBeforeClasses = computed(() =>
    inputGroupAddonVariants({
      zSize: this.zSize(),
      zPosition: 'before',
      zDisabled: this.zDisabled(),
      zBorderless: this.zBorderless(),
    }),
  );

  protected readonly addonAfterClasses = computed(() =>
    inputGroupAddonVariants({
      zSize: this.zSize(),
      zPosition: 'after',
      zDisabled: this.zDisabled(),
      zBorderless: this.zBorderless(),
    }),
  );

  protected readonly prefixClasses = computed(() =>
    inputGroupAffixVariants({
      zSize: this.zSize(),
      zPosition: 'prefix',
    }),
  );

  protected readonly suffixClasses = computed(() =>
    inputGroupAffixVariants({
      zSize: this.zSize(),
      zPosition: 'suffix',
    }),
  );

  protected readonly inputWrapperClasses = computed(() => {
    return mergeClasses(
      inputGroupInputVariants({
        zSize: this.zSize(),
        zHasPrefix: Boolean(this.zPrefix()),
        zHasSuffix: Boolean(this.zSuffix()),
        zHasAddonBefore: Boolean(this.zAddOnBefore()),
        zHasAddonAfter: Boolean(this.zAddOnAfter()),
        zDisabled: this.zDisabled(),
        zBorderless: this.zBorderless(),
      }),
      'relative',
    );
  });
}
