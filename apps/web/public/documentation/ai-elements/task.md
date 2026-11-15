# Task

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
        <z-trace-title>Found the project files</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content zKeepMounted>
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideSearch" /></z-trace-icon>
          <z-trace-title>Searched for the Meta service</z-trace-title>
        </z-trace-line>
        <a routerLink="/files/src/app/home/home.ts">
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideFileText" /></z-trace-icon>
            <z-trace-title>Read src/app/home/home.ts</z-trace-title>
          </z-trace-line>
        </a>
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Streaming

```angular-ts showLineNumbers copyButton
interface Task {
  id: string;
  title: string;
  steps: { title: string; status: 'done' | 'running' | 'error' }[];
}

protected readonly tasks = signal<Task[]>([]);

/** A task the agent sends again replaces the one with the same `id`, so it updates in place. */
private upsert(task: Task): void {
  this.tasks.update(tasks =>
    tasks.some(other => other.id === task.id)
      ? tasks.map(other => (other.id === task.id ? task : other))
      : [...tasks, task],
  );
}
```
