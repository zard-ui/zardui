import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import {
  BlockAppearanceSettingsComponent,
  BlockButtonGroupNestedComponent,
  BlockButtonGroupPopoverComponent,
  BlockButtonGroupToolbarComponent,
  BlockEmptyAvatarGroupComponent,
  BlockFieldCheckboxComponent,
  BlockFieldHearComponent,
  BlockFieldSeparatorComponent,
  BlockFieldSliderComponent,
  BlockInputGroupChatComponent,
  BlockInputGroupSecureComponent,
  BlockInputGroupStackComponent,
  BlockItemTwoFactorComponent,
  BlockItemVerifiedComponent,
  BlockNotionPromptFormComponent,
  BlockPaymentFormComponent,
  BlockSpinnerBadgesComponent,
  BlockSpinnerEmptyComponent,
} from '../../home/components/blocks';
import { CreateBuilderService } from '../services/create-builder.service';

/**
 * O canvas: componentes reais, com os tokens do preset aplicados no container.
 *
 * São os mesmos blocos da home — os mesmos componentes da biblioteca —, então o
 * preview é honesto por construção: não existe uma versão "de demonstração" que
 * possa divergir do que o `add` instala.
 *
 * O mosaico é deliberadamente **cortado** nas bordas direita e inferior. A
 * tentação é encolhê-lo até caber, e isso mataria o efeito: são os cards saindo
 * pela borda que comunicam "tem mais coisa aqui" em vez de "isto é tudo".
 */
@Component({
  selector: 'z-create-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPaymentFormComponent,
    BlockEmptyAvatarGroupComponent,
    BlockSpinnerBadgesComponent,
    BlockInputGroupChatComponent,
    BlockFieldSliderComponent,
    BlockInputGroupStackComponent,
    BlockInputGroupSecureComponent,
    BlockItemTwoFactorComponent,
    BlockItemVerifiedComponent,
    BlockFieldSeparatorComponent,
    BlockAppearanceSettingsComponent,
    BlockNotionPromptFormComponent,
    BlockButtonGroupToolbarComponent,
    BlockFieldCheckboxComponent,
    BlockButtonGroupNestedComponent,
    BlockButtonGroupPopoverComponent,
    BlockFieldHearComponent,
    BlockSpinnerEmptyComponent,
  ],
  host: { class: 'relative block h-full overflow-hidden rounded-[18px]' },
  template: `
    <div
      class="bg-muted text-foreground h-full overflow-hidden"
      [class.dark]="builder.previewDark()"
      [style]="builder.scopedStyles()"
      [attr.dir]="builder.preset().rtl ? 'rtl' : 'ltr'"
    >
      <!-- Colunas que terminam onde o conteúdo termina, sem altura imposta: o que
           passa da borda é cortado pelo container, e é esse corte que comunica
           "tem mais coisa aqui". -->
      <div class="grid grid-cols-1 items-start gap-6 p-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        @if (page() === 1) {
          <div class="flex flex-col gap-6 *:w-full">
            <z-block-payment-form />
            <z-block-spinner-badges />
            <z-block-field-checkbox />
          </div>
          <div class="hidden flex-col gap-6 *:w-full md:flex">
            <z-block-empty-avatar-group />
            <z-block-input-group-chat />
            <z-block-field-slider />
            <z-block-input-group-stack />
            <z-block-item-verified />
            <z-block-spinner-empty />
          </div>
          <div class="hidden flex-col gap-6 *:w-full xl:flex">
            <z-block-input-group-secure />
            <z-block-item-two-factor />
            <z-block-field-separator>Appearance Settings</z-block-field-separator>
            <z-block-appearance-settings />
            <z-block-field-hear />
          </div>
          <div class="hidden flex-col gap-6 *:w-full 2xl:flex">
            <z-block-notion-prompt-form />
            <z-block-button-group-toolbar />
            <div class="flex justify-between gap-4">
              <z-block-button-group-nested />
              <z-block-button-group-popover />
            </div>
            <z-block-field-checkbox />
            <z-block-item-verified />
            <z-block-field-slider />
            <z-block-empty-avatar-group />
          </div>
        } @else {
          <div class="flex flex-col gap-6 *:w-full">
            <z-block-appearance-settings />
            <z-block-field-checkbox />
            <z-block-field-hear />
            <z-block-spinner-badges />
          </div>
          <div class="hidden flex-col gap-6 *:w-full md:flex">
            <z-block-notion-prompt-form />
            <z-block-button-group-toolbar />
            <div class="flex justify-between gap-4">
              <z-block-button-group-nested />
              <z-block-button-group-popover />
            </div>
            <z-block-spinner-empty />
            <z-block-input-group-chat />
            <z-block-item-two-factor />
          </div>
          <div class="hidden flex-col gap-6 *:w-full xl:flex">
            <z-block-item-verified />
            <z-block-field-slider />
            <z-block-input-group-secure />
            <z-block-empty-avatar-group />
            <z-block-input-group-stack />
          </div>
          <div class="hidden flex-col gap-6 *:w-full 2xl:flex">
            <z-block-payment-form />
            <z-block-field-separator>Appearance Settings</z-block-field-separator>
            <z-block-appearance-settings />
            <z-block-spinner-badges />
          </div>
        }
      </div>
    </div>

    <nav class="absolute right-4 bottom-4 flex gap-1.5" aria-label="Canvas pages">
      @for (item of pages; track item) {
        <button
          type="button"
          class="grid h-7 w-9 place-items-center rounded-full text-[11px] font-medium transition-colors"
          [class]="
            page() === item
              ? 'bg-foreground text-background'
              : 'bg-background/70 text-muted-foreground ring-border hover:text-foreground ring-1'
          "
          [attr.aria-current]="page() === item ? 'true' : null"
          [attr.aria-label]="'Canvas page ' + item"
          (click)="page.set(item)"
        >
          {{ item.toString().padStart(2, '0') }}
        </button>
      }
    </nav>
  `,
})
export class CreateCanvasComponent {
  readonly builder = inject(CreateBuilderService);

  readonly pages = [1, 2] as const;
  readonly page = signal<(typeof this.pages)[number]>(1);
}
