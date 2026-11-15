# Queue

```bash tab="npm" copyButton
npx zard-cli add trace
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add trace
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add trace
```

```bash tab="bun" copyButton
bunx zard-cli add trace
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';
```

```angular-html showLineNumbers copyButton
<z-trace>
  <z-trace-collapsible zOpen>
    <z-trace-collapsible-trigger>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideListTodo" /></z-trace-icon>
        <z-trace-title>2 to do</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircle" /></z-trace-icon>
          <z-trace-title>Update the registry snapshots</z-trace-title>
        </z-trace-line>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircle" /></z-trace-icon>
          <z-trace-title>Add tests for the combobox</z-trace-title>
        </z-trace-line>
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
  <z-trace-collapsible>
    <z-trace-collapsible-trigger>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideListChecks" /></z-trace-icon>
        <z-trace-title>1 completed</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Add a changeset</z-trace-title>
        </z-trace-line>
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Descriptions

```angular-html showLineNumbers copyButton
<z-trace-collapsible>
  <z-trace-collapsible-trigger>
    <z-trace-line>
      <z-trace-icon><ng-icon name="lucideCircle" /></z-trace-icon>
      <z-trace-title>Fix the focus ring on the select trigger</z-trace-title>
    </z-trace-line>
  </z-trace-collapsible-trigger>
  <z-trace-collapsible-content>It is clipped by overflow-hidden on the field.</z-trace-collapsible-content>
</z-trace-collapsible>
```

## Streaming

```angular-ts showLineNumbers copyButton
interface Todo {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
}

// Each call of the agent's todo tool sends the whole list, so set it, don't append.
protected readonly todos = signal<Todo[]>([]);

protected readonly pending = computed(() => this.todos().filter(todo => todo.status !== 'completed'));
protected readonly completed = computed(() => this.todos().filter(todo => todo.status === 'completed'));
```
