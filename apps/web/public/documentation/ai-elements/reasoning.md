# Reasoning

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
  <z-trace-collapsible>
    <z-trace-collapsible-trigger>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
        <z-trace-title>Thought</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content class="whitespace-pre-wrap">{{ text }}</z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Duration

```angular-html showLineNumbers copyButton
<z-trace-line>
  <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
  <z-trace-title>Thought</z-trace-title>
  <z-trace-description>{{ seconds }}s</z-trace-description>
</z-trace-line>
```

## Streaming

```angular-html showLineNumbers copyButton
<ng-template #line>
  <z-trace-line [zStatus]="running() ? 'running' : undefined">
    <z-trace-title>{{ running() ? 'Thinking' : 'Thought' }}</z-trace-title>
  </z-trace-line>
</ng-template>

@if (text()) {
  <z-trace-collapsible [zOpen]="open() ?? running()" (zOpenChange)="open.set($event)">
    <z-trace-collapsible-trigger>
      <ng-container *ngTemplateOutlet="line" />
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content class="whitespace-pre-wrap">{{ text() }}</z-trace-collapsible-content>
  </z-trace-collapsible>
} @else {
  <ng-container *ngTemplateOutlet="line" />
}
```

```angular-ts showLineNumbers copyButton
readonly text = input.required<string>();
readonly running = input(false);

/** The reader's choice. `undefined` until they toggle the row, so it follows the stream until then. */
protected readonly open = signal<boolean | undefined>(undefined);
```
