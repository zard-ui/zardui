import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardComboboxImports } from '@/shared/components/combobox';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type {
  ZardQuestionnaireAnswers,
  ZardQuestionnaireItem,
  ZardQuestionnaireShortcutMode,
} from '../questionnaire.types';

@Component({
  selector: 'z-demo-questionnaire-shortcuts',
  imports: [ZardQuestionnaireImports, ZardComboboxImports],
  template: `
    <div class="flex min-h-[415px] w-full flex-col justify-between">
      <z-combobox class="w-32 self-end" [searchable]="false" [(zValue)]="value">
        <z-combobox-input />
        <z-combobox-content>
          <z-combobox-list>
            <z-combobox-item zValue="letters">Letters</z-combobox-item>
            <z-combobox-item zValue="numbers">Numbers</z-combobox-item>
            <z-combobox-item zValue="none">None</z-combobox-item>
          </z-combobox-list>
        </z-combobox-content>
      </z-combobox>

      <z-questionnaire [zItems]="items" [zShortcuts]="shortcutMode()" (zSubmit)="save($event)">
        <z-questionnaire-item zName="next" zRequired>
          <z-questionnaire-title>What should the agent do next?</z-questionnaire-title>
          <z-questionnaire-description class="-mt-4 -mb-1">
            Use the displayed shortcut or navigate with the keyboard.
          </z-questionnaire-description>

          <z-questionnaire-choices>
            <z-questionnaire-choice zValue="inspect">Inspect the implementation</z-questionnaire-choice>
            <z-questionnaire-choice zValue="test">Run the relevant tests</z-questionnaire-choice>
            <z-questionnaire-choice zValue="patch">Prepare the patch</z-questionnaire-choice>
          </z-questionnaire-choices>

          <z-questionnaire-error />
        </z-questionnaire-item>

        <z-questionnaire-actions>
          <button type="submit" z-questionnaire-submit>Confirm action</button>
        </z-questionnaire-actions>
      </z-questionnaire>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireShortcutsComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: readonly ZardQuestionnaireItem[] = [{ name: 'next', required: true }];
  readonly value = signal<string | string[] | null>('letters');
  readonly shortcutMode = computed<ZardQuestionnaireShortcutMode>(() => {
    const value = this.value();
    return value === 'letters' || value === 'numbers' ? value : 'none';
  });

  save(answers: ZardQuestionnaireAnswers): void {
    const action = answers['next'];

    this.sonner.show('Action confirmed', {
      description: `Next: ${Array.isArray(action) ? action.join(', ') : action}`,
    });
  }
}
