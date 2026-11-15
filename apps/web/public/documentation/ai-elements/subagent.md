# Subagent

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
        <z-trace-title>Ran the research agent</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content class="flex flex-col gap-3">
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCircleCheck" /></z-trace-icon>
          <z-trace-title>Ran grep -rn cacheKey scripts</z-trace-title>
        </z-trace-line>
      </z-trace>
      <p>The cache is keyed on the commit SHA.</p>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```
