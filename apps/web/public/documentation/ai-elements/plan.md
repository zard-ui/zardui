# Plan

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
      <z-trace-line zStatus="running">
        <z-trace-icon><ng-icon name="lucideRoute" /></z-trace-icon>
        <z-trace-title>Plan: migrate the dialogs</z-trace-title>
        <z-trace-description>1 of 3 done</z-trace-description>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Move the dialog state into a service</z-trace-title>
        </z-trace-line>
        <z-trace-line zStatus="running">
          <z-trace-icon><ng-icon name="lucideCircleDot" /></z-trace-icon>
          <z-trace-title>Replace the ViewContainerRef calls</z-trace-title>
        </z-trace-line>
        <z-trace-line zStatus="pending">
          <z-trace-icon><ng-icon name="lucideCircle" /></z-trace-icon>
          <z-trace-title>Run the type checker</z-trace-title>
        </z-trace-line>
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Streaming

```angular-ts showLineNumbers copyButton
interface PlanUpdate {
  title: string;
  steps: { title: string; status: 'done' | 'running' | 'pending' }[];
}

// Each update is the whole plan, so it replaces the last one instead of adding to it.
protected readonly plan = signal<PlanUpdate | null>(null);

constructor() {
  this.agent.updates$
    .pipe(
      filter(update => update.type === 'plan'),
      takeUntilDestroyed(),
    )
    .subscribe(update => this.plan.set(update.data));
}
```
