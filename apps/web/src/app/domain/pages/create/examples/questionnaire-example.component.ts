import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardDialogImports } from '@zard/components/dialog/dialog.imports';
import { ZardQuestionnaireImports } from '@zard/components/questionnaire/questionnaire.imports';
import type { ZardQuestionnaireItem } from '@zard/components/questionnaire/questionnaire.types';

import { ExampleImports } from './example.component';

/**
 * shadcn/ui's `questionnaire-example`, in zard: the same three questions standalone, one card per question and in a
 * dialog, then a question without description and one with a disabled choice. The markup repeats on purpose: the
 * items and buttons must be real content children of their questionnaire. In the card, the title and description carry
 * the card's markers too, as shadcn's `render={<CardTitle />}` merges both looks on one element.
 */
@Component({
  selector: 'z-questionnaire-example',
  imports: [ExampleImports, ZardButtonComponent, ZardCardImports, ZardDialogImports, ZardQuestionnaireImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Standalone" zContainerClass="md:col-span-2">
        <z-questionnaire class="mx-auto max-w-lg" [zItems]="items" zActive="direction" zShortcuts="letters">
          <z-questionnaire-progress />
          <z-questionnaire-item zName="direction" zRequired>
            <z-questionnaire-title>What should we prototype next?</z-questionnaire-title>
            <z-questionnaire-description>Choose one direction or write another answer.</z-questionnaire-description>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="delegation">
                <span class="font-medium">Sub-agent delegation</span>
                <z-questionnaire-choice-description>
                  Show when work is delegated and what comes back.
                </z-questionnaire-choice-description>
              </z-questionnaire-choice>
              <z-questionnaire-choice zValue="questions">
                <span class="font-medium">Question prompts</span>
                <z-questionnaire-choice-description>
                  Show choices while the agent waits for input.
                </z-questionnaire-choice-description>
              </z-questionnaire-choice>
              <z-questionnaire-choice zValue="both">
                <span class="font-medium">Both together</span>
                <z-questionnaire-choice-description>
                  Explore one unified interaction pattern.
                </z-questionnaire-choice-description>
              </z-questionnaire-choice>
              <z-questionnaire-input placeholder="Type another direction…" aria-label="Another direction" />
            </z-questionnaire-choices>
            <z-questionnaire-error />
          </z-questionnaire-item>

          <z-questionnaire-item zName="signals" zMultiple>
            <z-questionnaire-title>What should every progress update include?</z-questionnaire-title>
            <z-questionnaire-description>Select all that apply, or skip this question.</z-questionnaire-description>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="progress">Progress</z-questionnaire-choice>
              <z-questionnaire-choice zValue="decisions">Decisions</z-questionnaire-choice>
              <z-questionnaire-choice zValue="risks">Risks</z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error />
          </z-questionnaire-item>

          <z-questionnaire-item zName="timing" zRequired>
            <z-questionnaire-title>When should this be revisited?</z-questionnaire-title>
            <z-questionnaire-description>Choose when this should be revisited.</z-questionnaire-description>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="week">This week</z-questionnaire-choice>
              <z-questionnaire-choice zValue="cycle">Next cycle</z-questionnaire-choice>
              <z-questionnaire-choice zValue="later">Revisit later</z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error />
          </z-questionnaire-item>
          <z-questionnaire-actions class="w-full">
            <button type="button" z-questionnaire-previous>Previous</button>
            <button type="button" z-questionnaire-skip>Skip</button>
            <button type="button" z-questionnaire-next>Next</button>
            <button type="submit" z-questionnaire-submit>Save answers</button>
          </z-questionnaire-actions>
        </z-questionnaire>
      </z-example>

      <z-example zTitle="Card" zContainerClass="md:col-span-2">
        <z-questionnaire class="max-w-none" [zItems]="items" zActive="direction" zShortcuts="numbers">
          <z-questionnaire-item zName="direction" zRequired>
            <z-card class="mx-auto w-full max-w-lg">
              <z-card-header>
                <z-questionnaire-title id="create-direction-title" class="cn-card-title">
                  What should we prototype next?
                </z-questionnaire-title>
                <z-questionnaire-description class="cn-card-description">
                  Choose one direction or write another answer.
                </z-questionnaire-description>
                <z-card-action>
                  <z-questionnaire-progress />
                </z-card-action>
              </z-card-header>
              <z-card-content>
                <z-questionnaire-choices>
                  <z-questionnaire-choice zValue="delegation">
                    <span class="font-medium">Sub-agent delegation</span>
                    <z-questionnaire-choice-description>
                      Show when work is delegated and what comes back.
                    </z-questionnaire-choice-description>
                  </z-questionnaire-choice>
                  <z-questionnaire-choice zValue="questions">
                    <span class="font-medium">Question prompts</span>
                    <z-questionnaire-choice-description>
                      Show choices while the agent waits for input.
                    </z-questionnaire-choice-description>
                  </z-questionnaire-choice>
                  <z-questionnaire-choice zValue="both">
                    <span class="font-medium">Both together</span>
                    <z-questionnaire-choice-description>
                      Explore one unified interaction pattern.
                    </z-questionnaire-choice-description>
                  </z-questionnaire-choice>
                  <z-questionnaire-input placeholder="Type another direction…" aria-label="Another direction" />
                </z-questionnaire-choices>
                <z-questionnaire-error />
              </z-card-content>
              <z-card-footer>
                <z-questionnaire-actions class="w-full">
                  <button type="button" z-questionnaire-previous>Previous</button>
                  <button type="button" z-questionnaire-skip>Skip</button>
                  <button type="button" z-questionnaire-next>Next</button>
                  <button type="submit" z-questionnaire-submit>Save answers</button>
                </z-questionnaire-actions>
              </z-card-footer>
            </z-card>
          </z-questionnaire-item>

          <z-questionnaire-item zName="signals" zMultiple>
            <z-card class="mx-auto w-full max-w-lg">
              <z-card-header>
                <z-questionnaire-title id="create-signals-title" class="cn-card-title">
                  What should every progress update include?
                </z-questionnaire-title>
                <z-questionnaire-description class="cn-card-description">
                  Select all that apply, or skip this question.
                </z-questionnaire-description>
                <z-card-action>
                  <z-questionnaire-progress />
                </z-card-action>
              </z-card-header>
              <z-card-content>
                <z-questionnaire-choices>
                  <z-questionnaire-choice zValue="progress">Progress</z-questionnaire-choice>
                  <z-questionnaire-choice zValue="decisions">Decisions</z-questionnaire-choice>
                  <z-questionnaire-choice zValue="risks">Risks</z-questionnaire-choice>
                </z-questionnaire-choices>
                <z-questionnaire-error />
              </z-card-content>
              <z-card-footer>
                <z-questionnaire-actions class="w-full">
                  <button type="button" z-questionnaire-previous>Previous</button>
                  <button type="button" z-questionnaire-skip>Skip</button>
                  <button type="button" z-questionnaire-next>Next</button>
                  <button type="submit" z-questionnaire-submit>Save answers</button>
                </z-questionnaire-actions>
              </z-card-footer>
            </z-card>
          </z-questionnaire-item>

          <z-questionnaire-item zName="timing" zRequired>
            <z-card class="mx-auto w-full max-w-lg">
              <z-card-header>
                <z-questionnaire-title id="create-timing-title" class="cn-card-title">
                  When should this be revisited?
                </z-questionnaire-title>
                <z-questionnaire-description class="cn-card-description">
                  Choose when this should be revisited.
                </z-questionnaire-description>
                <z-card-action>
                  <z-questionnaire-progress />
                </z-card-action>
              </z-card-header>
              <z-card-content>
                <z-questionnaire-choices>
                  <z-questionnaire-choice zValue="week">This week</z-questionnaire-choice>
                  <z-questionnaire-choice zValue="cycle">Next cycle</z-questionnaire-choice>
                  <z-questionnaire-choice zValue="later">Revisit later</z-questionnaire-choice>
                </z-questionnaire-choices>
                <z-questionnaire-error />
              </z-card-content>
              <z-card-footer>
                <z-questionnaire-actions class="w-full">
                  <button type="button" z-questionnaire-previous>Previous</button>
                  <button type="button" z-questionnaire-skip>Skip</button>
                  <button type="button" z-questionnaire-next>Next</button>
                  <button type="submit" z-questionnaire-submit>Save answers</button>
                </z-questionnaire-actions>
              </z-card-footer>
            </z-card>
          </z-questionnaire-item>
        </z-questionnaire>
      </z-example>

      <z-example zTitle="Dialog" zClass="items-center justify-center" zContainerClass="md:col-span-2">
        <button type="button" z-button zType="outline" (click)="dialogOpen.set(true)">Open questionnaire</button>

        <z-dialog [(zVisible)]="dialogOpen">
          <z-questionnaire [zItems]="items" zActive="direction">
            <z-dialog-header>
              <z-dialog-title class="sr-only">Plan an agent interface</z-dialog-title>
              <z-dialog-description class="sr-only">
                Answer three questions to shape the next prototype.
              </z-dialog-description>
              <z-questionnaire-progress class="text-foreground font-semibold tracking-widest uppercase" />
            </z-dialog-header>
            <z-questionnaire-item zName="direction" zRequired>
              <z-questionnaire-title>What should we prototype next?</z-questionnaire-title>
              <z-questionnaire-description>Choose one direction or write another answer.</z-questionnaire-description>
              <z-questionnaire-choices>
                <z-questionnaire-choice zValue="delegation">
                  <span class="font-medium">Sub-agent delegation</span>
                  <z-questionnaire-choice-description>
                    Show when work is delegated and what comes back.
                  </z-questionnaire-choice-description>
                </z-questionnaire-choice>
                <z-questionnaire-choice zValue="questions">
                  <span class="font-medium">Question prompts</span>
                  <z-questionnaire-choice-description>
                    Show choices while the agent waits for input.
                  </z-questionnaire-choice-description>
                </z-questionnaire-choice>
                <z-questionnaire-choice zValue="both">
                  <span class="font-medium">Both together</span>
                  <z-questionnaire-choice-description>
                    Explore one unified interaction pattern.
                  </z-questionnaire-choice-description>
                </z-questionnaire-choice>
                <z-questionnaire-input placeholder="Type another direction…" aria-label="Another direction" />
              </z-questionnaire-choices>
              <z-questionnaire-error />
            </z-questionnaire-item>

            <z-questionnaire-item zName="signals" zMultiple>
              <z-questionnaire-title>What should every progress update include?</z-questionnaire-title>
              <z-questionnaire-description>Select all that apply, or skip this question.</z-questionnaire-description>
              <z-questionnaire-choices>
                <z-questionnaire-choice zValue="progress">Progress</z-questionnaire-choice>
                <z-questionnaire-choice zValue="decisions">Decisions</z-questionnaire-choice>
                <z-questionnaire-choice zValue="risks">Risks</z-questionnaire-choice>
              </z-questionnaire-choices>
              <z-questionnaire-error />
            </z-questionnaire-item>

            <z-questionnaire-item zName="timing" zRequired>
              <z-questionnaire-title>When should this be revisited?</z-questionnaire-title>
              <z-questionnaire-description>Choose when this should be revisited.</z-questionnaire-description>
              <z-questionnaire-choices>
                <z-questionnaire-choice zValue="week">This week</z-questionnaire-choice>
                <z-questionnaire-choice zValue="cycle">Next cycle</z-questionnaire-choice>
                <z-questionnaire-choice zValue="later">Revisit later</z-questionnaire-choice>
              </z-questionnaire-choices>
              <z-questionnaire-error />
            </z-questionnaire-item>
            <z-dialog-footer>
              <z-questionnaire-actions class="w-full">
                <button type="button" z-questionnaire-previous>Previous</button>
                <button type="button" z-questionnaire-skip>Skip</button>
                <button type="button" z-questionnaire-next>Next</button>
                <button type="submit" z-questionnaire-submit>Save answers</button>
              </z-questionnaire-actions>
            </z-dialog-footer>
          </z-questionnaire>
        </z-dialog>
      </z-example>

      <z-example zTitle="No description" zContainerClass="md:col-span-2">
        <z-questionnaire class="mx-auto max-w-lg" [zItems]="taskItems" zActive="task" zShortcuts="letters">
          <z-questionnaire-progress />
          <z-questionnaire-item zName="task" zRequired>
            <z-questionnaire-title>What should the agent do next?</z-questionnaire-title>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="inspect">Inspect the codebase</z-questionnaire-choice>
              <z-questionnaire-choice zValue="implement">Implement the change</z-questionnaire-choice>
              <z-questionnaire-choice zValue="review">Review the result</z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error />
          </z-questionnaire-item>
          <z-questionnaire-actions class="w-full">
            <button type="button" z-questionnaire-previous>Previous</button>
            <button type="button" z-questionnaire-skip>Skip</button>
            <button type="button" z-questionnaire-next>Next</button>
            <button type="submit" z-questionnaire-submit>Save answers</button>
          </z-questionnaire-actions>
        </z-questionnaire>
      </z-example>

      <z-example zTitle="Disabled" zContainerClass="md:col-span-2">
        <z-questionnaire class="mx-auto max-w-lg" [zItems]="planItems" zActive="plan">
          <z-questionnaire-item zName="plan" zRequired>
            <z-questionnaire-title>Choose a plan</z-questionnaire-title>
            <z-questionnaire-description>Enterprise is not available on your account.</z-questionnaire-description>
            <z-questionnaire-choices>
              <z-questionnaire-choice zValue="plus">
                <span class="font-medium">Plus</span>
                <z-questionnaire-choice-description>For individuals and small teams</z-questionnaire-choice-description>
              </z-questionnaire-choice>
              <z-questionnaire-choice zValue="pro">
                <span class="font-medium">Pro</span>
                <z-questionnaire-choice-description>For growing businesses</z-questionnaire-choice-description>
              </z-questionnaire-choice>
              <z-questionnaire-choice zValue="enterprise" zDisabled>
                <span class="font-medium">Enterprise</span>
                <z-questionnaire-choice-description>For large teams and enterprises</z-questionnaire-choice-description>
              </z-questionnaire-choice>
            </z-questionnaire-choices>
            <z-questionnaire-error />
          </z-questionnaire-item>
          <z-questionnaire-actions class="w-full">
            <button type="button" z-questionnaire-previous>Previous</button>
            <button type="button" z-questionnaire-skip>Skip</button>
            <button type="button" z-questionnaire-next>Next</button>
            <button type="submit" z-questionnaire-submit>Save answers</button>
          </z-questionnaire-actions>
        </z-questionnaire>
      </z-example>
    </z-example-wrapper>
  `,
})
export class QuestionnaireExampleComponent {
  protected readonly dialogOpen = signal(false);

  protected readonly items = [
    {
      choices: [{ value: 'delegation' }, { value: 'questions' }, { value: 'both' }],
      name: 'direction',
      required: true,
    },
    { choices: [{ value: 'progress' }, { value: 'decisions' }, { value: 'risks' }], multiple: true, name: 'signals' },
    { choices: [{ value: 'week' }, { value: 'cycle' }, { value: 'later' }], name: 'timing', required: true },
  ] as const satisfies readonly ZardQuestionnaireItem[];

  protected readonly taskItems = [
    { choices: [{ value: 'inspect' }, { value: 'implement' }, { value: 'review' }], name: 'task', required: true },
  ] as const satisfies readonly ZardQuestionnaireItem[];

  protected readonly planItems = [
    {
      choices: [{ value: 'plus' }, { value: 'pro' }, { value: 'enterprise', disabled: true }],
      name: 'plan',
      required: true,
    },
  ] as const satisfies readonly ZardQuestionnaireItem[];
}
