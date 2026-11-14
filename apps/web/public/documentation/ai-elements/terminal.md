# Terminal

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
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
```

```angular-html showLineNumbers copyButton
<z-trace>
  <z-trace-collapsible>
    <z-trace-collapsible-trigger>
      <z-trace-line>
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>Ran ng build</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-code-block zSize="sm">
        <z-code-block-content zWrap class="max-h-64">{{ output }}</z-code-block-content>
      </z-code-block>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Streaming

```angular-ts showLineNumbers copyButton
/** The output of each command, by the id of its tool call. It grows while the command runs. */
protected readonly outputs = signal<Record<string, string>>({});

constructor() {
  this.agent.terminalOutput$
    .pipe(takeUntilDestroyed())
    .subscribe(({ toolCallId, output }) => this.outputs.update(outputs => ({ ...outputs, [toolCallId]: output })));
}
```
