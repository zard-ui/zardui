# Tool

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
        <z-trace-title>Ran git status --short</z-trace-title>
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

## States

```angular-html showLineNumbers copyButton
@if (call.state === 'running') {
  <z-trace-line [zStatus]="streaming() ? 'running' : 'error'">
    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
    <z-trace-title>{{ streaming() ? 'Running' : 'Failed to run' }} {{ call.command }}</z-trace-title>
  </z-trace-line>
} @else if (call.state === 'denied') {
  <z-trace-line>
    <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
    <z-trace-title>Denied {{ call.command }}</z-trace-title>
  </z-trace-line>
} @else {
  <z-trace-collapsible>
    <z-trace-collapsible-trigger>
      <z-trace-line [zStatus]="call.state === 'error' ? 'error' : undefined">
        <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
        <z-trace-title>{{ call.state === 'error' ? 'Failed to run' : 'Ran' }} {{ call.command }}</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-code-block zSize="sm">
        <z-code-block-content zWrap class="max-h-64">{{ call.output }}</z-code-block-content>
      </z-code-block>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
}
```
