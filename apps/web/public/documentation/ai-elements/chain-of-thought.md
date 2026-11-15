# Chain of Thought

```bash tab="npm" copyButton
npx zard-cli add trace code-block badge
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add trace code-block badge
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add trace code-block badge
```

```bash tab="bun" copyButton
bunx zard-cli add trace code-block badge
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
        <z-trace-title>Researched in 3 steps</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content zKeepMounted>
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Read the build log for dpl_8Kx2</z-trace-title>
        </z-trace-line>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Searched the web for angular image cache key</z-trace-title>
        </z-trace-line>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Searched the code for cacheKey</z-trace-title>
        </z-trace-line>
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Search Results

```angular-html showLineNumbers copyButton
<z-trace-collapsible-content class="flex flex-wrap gap-1.5">
  @for (result of results; track result.url) {
    <z-badge zType="secondary">{{ hostname(result.url) }}</z-badge>
  }
</z-trace-collapsible-content>
```

## Streaming

```angular-html showLineNumbers copyButton
<z-trace-collapsible [zOpen]="open() ?? running()" (zOpenChange)="open.set($event)">
  <z-trace-collapsible-trigger>
    <z-trace-line [zStatus]="running() ? 'running' : failed() > 0 ? 'error' : undefined">
      <z-trace-title>{{ running() ? 'Researching' : 'Researched in ' + steps().length + ' steps' }}</z-trace-title>
    </z-trace-line>
  </z-trace-collapsible-trigger>
  <z-trace-collapsible-content zKeepMounted>
    <z-trace>
      @for (step of steps(); track step.id) {
        <!-- a line for each tool call, as in Tool -->
      }
    </z-trace>
  </z-trace-collapsible-content>
</z-trace-collapsible>
```
