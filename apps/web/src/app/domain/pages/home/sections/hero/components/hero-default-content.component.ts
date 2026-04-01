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

@Component({
  selector: 'z-hero-default-content',
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
  template: `
    <div
      class="theme-container mx-auto grid gap-8 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8"
    >
      <div class="flex flex-col gap-6 *:w-full *:max-w-full">
        <z-block-payment-form />
      </div>
      <div class="flex flex-col gap-6 *:w-full *:max-w-full">
        <z-block-empty-avatar-group />
        <z-block-spinner-badges />
        <z-block-input-group-chat />
        <z-block-field-slider />
        <z-block-input-group-stack />
      </div>
      <div class="flex flex-col gap-6 *:w-full *:max-w-full">
        <z-block-input-group-secure />
        <z-block-item-two-factor />
        <z-block-item-verified />
        <z-block-field-separator>Appearance Settings</z-block-field-separator>
        <z-block-appearance-settings />
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
      </div>
    </div>
  `,
})
export class HeroDefaultContentComponent {}
