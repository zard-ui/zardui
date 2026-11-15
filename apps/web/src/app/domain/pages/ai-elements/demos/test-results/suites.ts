import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircleDashed, lucideFileCode, lucideFlaskConical, lucideX } from '@ng-icons/lucide';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface Test {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  error?: string;
}

const SUITES: { name: string; tests: Test[] }[] = [
  {
    name: 'auth.spec.ts',
    tests: [
      { name: 'logs in with valid credentials', status: 'passed' },
      { name: 'rejects an invalid password', status: 'passed' },
      { name: 'refreshes an expired token', status: 'passed' },
    ],
  },
  {
    name: 'user-api.spec.ts',
    tests: [
      { name: 'creates a user', status: 'passed' },
      {
        name: 'updates a user profile',
        status: 'failed',
        error: 'Expected status 200, received 500\n  at Object.<anonymous> (src/user-api.spec.ts:45:12)',
      },
      { name: 'deletes a user', status: 'skipped' },
    ],
  },
  {
    name: 'db.spec.ts',
    tests: [
      { name: 'connects to the database', status: 'passed' },
      {
        name: 'times out a slow query',
        status: 'failed',
        error: 'Exceeded timeout of 5000 ms for a test.\n  at Object.<anonymous> (src/db.spec.ts:22:3)',
      },
    ],
  },
];

/** "8 tests, 2 failed, 1 skipped". */
function formatCounts(tests: Test[]): string {
  const failed = tests.filter(test => test.status === 'failed').length;
  const skipped = tests.filter(test => test.status === 'skipped').length;
  return [`${tests.length} tests`, failed > 0 && `${failed} failed`, skipped > 0 && `${skipped} skipped`]
    .filter(Boolean)
    .join(', ');
}

const hasFailure = (tests: Test[]) => tests.some(test => test.status === 'failed');

@Component({
  selector: 'z-ai-elements-test-results-suites',
  imports: [NgIcon, NgTemplateOutlet, ...ZardCodeBlockImports, ...ZardTraceImports],
  template: `
    <ng-template #testRow let-test>
      @if (test.status === 'failed') {
        <z-trace-collapsible>
          <z-trace-collapsible-trigger>
            <z-trace-line zStatus="error">
              <z-trace-icon><ng-icon name="lucideX" /></z-trace-icon>
              <z-trace-title>{{ test.name }}</z-trace-title>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content>
            <z-code-block zSize="sm">
              <z-code-block-content zWrap class="max-h-64">{{ test.error }}</z-code-block-content>
            </z-code-block>
          </z-trace-collapsible-content>
        </z-trace-collapsible>
      } @else {
        <z-trace-line>
          <z-trace-icon>
            <ng-icon [name]="test.status === 'skipped' ? 'lucideCircleDashed' : 'lucideCheck'" />
          </z-trace-icon>
          <z-trace-title>{{ test.status === 'skipped' ? 'Skipped ' + test.name : test.name }}</z-trace-title>
        </z-trace-line>
      }
    </ng-template>

    <z-trace class="max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line [zStatus]="hasFailure(all) ? 'error' : undefined">
            <z-trace-icon><ng-icon name="lucideFlaskConical" /></z-trace-icon>
            <z-trace-title>Ran {{ formatCounts(all) }}</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace>
            <!-- Each suite is a row of its own. Open the ones with a failure. -->
            @for (suite of suites; track suite.name) {
              <z-trace-collapsible [zOpen]="hasFailure(suite.tests)">
                <z-trace-collapsible-trigger>
                  <z-trace-line [zStatus]="hasFailure(suite.tests) ? 'error' : undefined">
                    <z-trace-icon><ng-icon name="lucideFileCode" /></z-trace-icon>
                    <z-trace-title>{{ suite.name }}, {{ formatCounts(suite.tests) }}</z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content zKeepMounted>
                  <z-trace>
                    @for (test of suite.tests; track test.name) {
                      <ng-container *ngTemplateOutlet="testRow; context: { $implicit: test }" />
                    }
                  </z-trace>
                </z-trace-collapsible-content>
              </z-trace-collapsible>
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCheck, lucideCircleDashed, lucideFileCode, lucideFlaskConical, lucideX })],
})
export class ZardAiElementsTestResultsSuitesComponent {
  protected readonly suites = SUITES;
  protected readonly all = SUITES.flatMap(suite => suite.tests);
  protected readonly formatCounts = formatCounts;
  protected readonly hasFailure = hasFailure;
}
