import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle, lucideCircleCheck, lucideRoute } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

const STEPS = [
  { title: 'Add a dark variant to the theme tokens', done: true },
  { title: 'Read the theme from a cookie on the server', done: false },
  { title: 'Add a toggle to the settings page', done: false },
  { title: 'Check contrast on the charts', done: false },
];

@Component({
  selector: 'z-ai-elements-plan-description',
  imports: [NgIcon, ...ZardTraceImports],
  template: `
    <div class="w-full max-w-sm text-sm">
      <z-trace>
        <z-trace-collapsible zOpen>
          <z-trace-collapsible-trigger>
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideRoute" /></z-trace-icon>
              <z-trace-title>Plan: add dark mode</z-trace-title>
              <z-trace-description>1 of {{ steps.length }} done</z-trace-description>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content class="flex flex-col gap-3">
            <p>Store the theme in a cookie so the server renders the right one and the page does not flash on load.</p>
            <z-trace>
              @for (step of steps; track step.title) {
                <z-trace-line [zStatus]="step.done ? undefined : 'pending'">
                  <z-trace-icon>
                    <ng-icon [name]="step.done ? 'lucideCircleCheck' : 'lucideCircle'" />
                  </z-trace-icon>
                  <z-trace-title>{{ step.title }}</z-trace-title>
                </z-trace-line>
              }
            </z-trace>
          </z-trace-collapsible-content>
        </z-trace-collapsible>
      </z-trace>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircle, lucideCircleCheck, lucideRoute })],
  host: { class: 'contents' },
})
export class ZardAiElementsPlanDescriptionComponent {
  protected readonly steps = STEPS;
}
