import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswer, ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

const DIRECTION_LABELS: Record<string, string> = {
  'tool-calls': 'tool call timeline',
  approvals: 'approval checkpoints',
  handoffs: 'sub-agent handoffs',
};

const UPDATE_LABELS: Record<string, string> = {
  progress: 'progress',
  decisions: 'decisions',
  risks: 'risks',
  'next-step': 'next step',
};

const TIMING_LABELS: Record<string, string> = {
  now: 'now',
  'next-cycle': 'next development cycle',
  backlog: 'backlog',
};

@Component({
  selector: 'z-demo-questionnaire-default',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire [zItems]="items" zShortcuts="letters" (zSubmit)="save($event)">
      <z-questionnaire-progress />

      <z-questionnaire-item zName="goal" zRequired>
        <z-questionnaire-title>What should the agent build next?</z-questionnaire-title>
        <z-questionnaire-description>Choose a direction or describe another task.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="tool-calls">
            <span class="font-medium">Tool call timeline</span>
            <z-questionnaire-choice-description>
              Show what the agent ran and what came back.
            </z-questionnaire-choice-description>
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="approvals">
            <span class="font-medium">Approval checkpoints</span>
            <z-questionnaire-choice-description>
              Ask before sensitive or destructive actions.
            </z-questionnaire-choice-description>
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="handoffs">
            <span class="font-medium">Sub-agent handoffs</span>
            <z-questionnaire-choice-description>
              Make delegated work and results easier to follow.
            </z-questionnaire-choice-description>
          </z-questionnaire-choice>
          <z-questionnaire-input placeholder="Describe another feature..." aria-label="Describe another feature" />
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="updates" zMultiple>
        <z-questionnaire-title>What should every progress update include?</z-questionnaire-title>
        <z-questionnaire-description>Select all that apply, or skip this question.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="progress">Progress made</z-questionnaire-choice>
          <z-questionnaire-choice zValue="decisions">Decisions taken</z-questionnaire-choice>
          <z-questionnaire-choice zValue="risks">Risks or blockers</z-questionnaire-choice>
          <z-questionnaire-choice zValue="next-step">Next step</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="start" zRequired>
        <z-questionnaire-title>When should work begin?</z-questionnaire-title>
        <z-questionnaire-description>Choose one option.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="now">Start now</z-questionnaire-choice>
          <z-questionnaire-choice zValue="next-cycle">Next development cycle</z-questionnaire-choice>
          <z-questionnaire-choice zValue="backlog">Add it to the backlog</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Back</button>
        <button type="button" z-questionnaire-skip>Skip</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Finish</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireDefaultComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'goal', required: true },
    { name: 'updates', multiple: true },
    { name: 'start', required: true },
  ];

  save(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Agent plan saved', {
      description: [
        `Direction: ${this.formatDirection(answers['goal'])}`,
        `Progress signals: ${this.formatUpdates(answers['updates'])}`,
        `Timing: ${this.formatTiming(answers['start'])}`,
      ].join(' · '),
    });
  }

  private formatDirection(answer: ZardQuestionnaireAnswer | undefined): string {
    const value = this.singleValue(answer);
    return value ? (DIRECTION_LABELS[value] ?? value) : 'None';
  }

  private formatUpdates(answer: ZardQuestionnaireAnswer | undefined): string {
    const values = Array.isArray(answer) ? answer : answer ? [answer] : [];
    return values.length ? values.map(value => UPDATE_LABELS[value] ?? value).join(', ') : 'None';
  }

  private formatTiming(answer: ZardQuestionnaireAnswer | undefined): string {
    const value = this.singleValue(answer);
    return value ? (TIMING_LABELS[value] ?? value) : 'None';
  }

  private singleValue(answer: ZardQuestionnaireAnswer | undefined): string | undefined {
    return Array.isArray(answer) ? answer[0] : answer;
  }
}
