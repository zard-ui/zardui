import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle, lucideCircleCheck, lucideListChecks, lucideListTodo } from '@ng-icons/lucide';

import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface Todo {
  title: string;
  description?: string;
  done: boolean;
}

const TODOS: Todo[] = [
  { title: 'Write the migration guide', description: 'Cover the renamed inputs and the new data attributes.', done: true },
  { title: 'Add a changeset', done: true },
  {
    title: 'Fix the focus ring on the select trigger',
    description: 'It is clipped by overflow-hidden on the field.',
    done: false,
  },
  { title: 'Update the registry snapshots', done: false },
  { title: 'Add tests for the combobox', description: 'Typing, clearing and keyboard selection.', done: false },
];

@Component({
  selector: 'z-ai-elements-queue-descriptions',
  imports: [NgIcon, NgTemplateOutlet, ...ZardTraceImports],
  template: `
    <!-- A todo with a description opens to show it. A todo without one stays a line. -->
    <ng-template #todoRow let-todo>
      <ng-template #line>
        <z-trace-line>
          <z-trace-icon><ng-icon [name]="todo.done ? 'lucideCircleCheck' : 'lucideCircle'" /></z-trace-icon>
          <z-trace-title>{{ todo.title }}</z-trace-title>
        </z-trace-line>
      </ng-template>

      @if (todo.description) {
        <z-trace-collapsible>
          <z-trace-collapsible-trigger>
            <ng-container *ngTemplateOutlet="line" />
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content>{{ todo.description }}</z-trace-collapsible-content>
        </z-trace-collapsible>
      } @else {
        <ng-container *ngTemplateOutlet="line" />
      }
    </ng-template>

    <z-trace class="max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideListTodo" /></z-trace-icon>
            <z-trace-title>{{ pending.length }} to do</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace>
            @for (todo of pending; track todo.title) {
              <ng-container *ngTemplateOutlet="todoRow; context: { $implicit: todo }" />
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>

      <z-trace-collapsible>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideListChecks" /></z-trace-icon>
            <z-trace-title>{{ completed.length }} completed</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content zKeepMounted>
          <z-trace>
            @for (todo of completed; track todo.title) {
              <ng-container *ngTemplateOutlet="todoRow; context: { $implicit: todo }" />
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircle, lucideCircleCheck, lucideListChecks, lucideListTodo })],
})
export class ZardAiElementsQueueDescriptionsComponent {
  protected readonly pending = TODOS.filter(todo => !todo.done);
  protected readonly completed = TODOS.filter(todo => todo.done);
}
