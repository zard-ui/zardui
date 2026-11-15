# Stack Trace

```bash tab="npm" copyButton
npx zard-cli add trace code-block
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add trace code-block
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add trace code-block
```

```bash tab="bun" copyButton
bunx zard-cli add trace code-block
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';
```

```angular-ts showLineNumbers copyButton
const [error, ...frames] = stack.split('\n').map(line => line.trim());
```

```angular-html showLineNumbers copyButton
<z-trace>
  <z-trace-collapsible>
    <z-trace-collapsible-trigger>
      <z-trace-line zStatus="error">
        <z-trace-icon><ng-icon name="lucideCircleX" /></z-trace-icon>
        <z-trace-title>Failed: {{ error }}</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <div class="bg-muted flex flex-col gap-2 rounded-md p-3 font-mono text-xs">
        <p class="text-destructive">{{ error }}</p>
        <ol>
          @for (frame of frames; track $index) {
            <li [class.text-foreground]="!frame.includes('node_modules')">{{ frame }}</li>
          }
        </ol>
      </div>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Streaming

```angular-ts showLineNumbers copyButton
// A stack shows file paths from your server, so only send it in development.
const errorText = isDevMode() && error instanceof Error ? (error.stack ?? error.message) : String(error);
```
