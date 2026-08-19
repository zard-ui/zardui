import { Component, ChangeDetectionStrategy } from '@angular/core';

import {
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
} from './blocks';

/**
 * A parede de componentes da home.
 *
 * Cinco colunas com gap de 40px, e cada uma mais alta que o recorte de 1414px
 * que a envolve — é essa sobra que faz o grid ser cortado no meio de um card em
 * vez de terminar no vazio. Um componente aparecer em mais de uma coluna é
 * deliberado: o que se está mostrando é a densidade da biblioteca, não um
 * inventário onde cada item aparece uma vez.
 */
@Component({
  selector: 'z-hero-default-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Sem `display`, um custom element é inline — e um inline escapa do
  // `overflow: hidden` do recorte: o grid era cortado na tela mas continuava
  // esticando a barra de rolagem, deixando meia tela em branco sob o rodapé.
  host: { class: 'block' },
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
  template: `
    <div
      class="theme-container mx-auto grid items-start gap-10 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    >
      <div class="flex flex-col gap-6 *:w-full *:max-w-full">
        <z-block-payment-form />
        <z-block-spinner-badges />
        <z-block-field-checkbox />
        <z-block-item-verified />
        <z-block-field-hear />
        <z-block-input-group-chat />
        <z-block-item-two-factor />
        <z-block-appearance-settings />
      </div>
      <div class="flex flex-col gap-6 *:w-full *:max-w-full">
        <z-block-empty-avatar-group />
        <z-block-spinner-badges />
        <z-block-input-group-chat />
        <z-block-field-slider />
        <z-block-input-group-stack />
        <z-block-item-two-factor />
        <z-block-spinner-empty />
        <z-block-field-checkbox />
        <z-block-appearance-settings />
        <z-block-input-group-secure />
      </div>
      <div class="flex flex-col gap-6 *:w-full *:max-w-full">
        <z-block-input-group-secure />
        <z-block-item-two-factor />
        <z-block-item-verified />
        <z-block-field-separator>Appearance Settings</z-block-field-separator>
        <z-block-appearance-settings />
        <z-block-field-slider />
        <z-block-input-group-chat />
        <z-block-empty-avatar-group />
        <z-block-spinner-empty />
        <z-block-field-checkbox />
        <z-block-payment-form />
      </div>
      <div class="order-first flex flex-col gap-6 *:w-full *:max-w-full lg:hidden xl:order-last xl:flex">
        <z-block-notion-prompt-form />
        <z-block-button-group-toolbar />
        <z-block-field-checkbox />
        <div class="flex justify-between gap-4">
          <z-block-button-group-nested />
          <z-block-button-group-popover />
        </div>
        <z-block-field-hear />
        <z-block-spinner-empty />
        <z-block-input-group-secure />
        <z-block-item-verified />
        <z-block-payment-form />
      </div>
      <div class="hidden flex-col gap-6 *:w-full *:max-w-full 2xl:flex">
        <z-block-item-two-factor />
        <z-block-field-slider />
        <z-block-input-group-secure />
        <z-block-spinner-badges />
        <z-block-empty-avatar-group />
        <z-block-item-verified />
        <z-block-appearance-settings />
        <z-block-input-group-stack />
        <z-block-button-group-toolbar />
      </div>
    </div>
  `,
})
export class HeroDefaultContentComponent {}
