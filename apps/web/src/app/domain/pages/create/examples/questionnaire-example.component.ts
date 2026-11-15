import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardQuestionnaireImports } from '@zard/components/questionnaire/questionnaire.imports';
import type { ZardQuestionnaireItem } from '@zard/components/questionnaire/questionnaire.types';

import { ExampleImports } from './example.component';

/** The questionnaire's demos, in zard: a single choice with free text, a multiple choice, and a card. */
@Component({
  selector: 'z-questionnaire-example',
  imports: [ExampleImports, ZardCardImports, ZardQuestionnaireImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Default">
        <z-questionnaire [zItems]="defaultItems" zShortcuts="letters">
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
      </z-example>

      <z-example zTitle="Card">
        <z-questionnaire class="mx-auto max-w-md" [zItems]="cardItems" zShortcuts="numbers">
          <z-card>
            <z-questionnaire-item zName="task" zRequired>
              <z-card-header>
                <z-questionnaire-title id="create-task-title">
                  <z-card-title zTitle="What should the agent work on?" />
                </z-questionnaire-title>
                <z-questionnaire-description>
                  <z-card-description zDescription="Choose the task that should be handled next." />
                </z-questionnaire-description>
                <z-card-action>
                  <z-questionnaire-progress />
                </z-card-action>
              </z-card-header>
              <z-card-content>
                <z-questionnaire-choices>
                  <z-questionnaire-choice zValue="fix">Fix the failing tests</z-questionnaire-choice>
                  <z-questionnaire-choice zValue="refactor">Refactor the data layer</z-questionnaire-choice>
                  <z-questionnaire-choice zValue="docs">Update the integration guide</z-questionnaire-choice>
                </z-questionnaire-choices>
                <z-questionnaire-error />
              </z-card-content>
            </z-questionnaire-item>

            <z-questionnaire-item zName="output" zRequired>
              <z-card-header>
                <z-questionnaire-title id="create-output-title">
                  <z-card-title zTitle="What should the final handoff include?" />
                </z-questionnaire-title>
                <z-questionnaire-description>
                  <z-card-description zDescription="Pick the level of detail needed for review." />
                </z-questionnaire-description>
                <z-card-action>
                  <z-questionnaire-progress />
                </z-card-action>
              </z-card-header>
              <z-card-content>
                <z-questionnaire-choices>
                  <z-questionnaire-choice zValue="summary">Summary only</z-questionnaire-choice>
                  <z-questionnaire-choice zValue="files">Summary and changed files</z-questionnaire-choice>
                  <z-questionnaire-choice zValue="review">Full review handoff</z-questionnaire-choice>
                </z-questionnaire-choices>
                <z-questionnaire-error />
              </z-card-content>
            </z-questionnaire-item>

            <z-card-footer>
              <z-questionnaire-actions class="w-full">
                <button type="button" z-questionnaire-previous>Previous</button>
                <button type="button" z-questionnaire-next>Next</button>
                <button type="submit" z-questionnaire-submit>Create task</button>
              </z-questionnaire-actions>
            </z-card-footer>
          </z-card>
        </z-questionnaire>
      </z-example>
    </z-example-wrapper>
  `,
})
export class QuestionnaireExampleComponent {
  protected readonly defaultItems: ZardQuestionnaireItem[] = [
    { name: 'goal', required: true },
    { name: 'updates', multiple: true },
    { name: 'start', required: true },
  ];

  protected readonly cardItems = [
    { choices: [{ value: 'fix' }, { value: 'refactor' }, { value: 'docs' }], name: 'task', required: true },
    { choices: [{ value: 'summary' }, { value: 'files' }, { value: 'review' }], name: 'output', required: true },
  ] as const satisfies readonly ZardQuestionnaireItem[];
}
