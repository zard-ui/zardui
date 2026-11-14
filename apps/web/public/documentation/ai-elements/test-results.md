# Test Results

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
  <z-trace-collapsible zOpen>
    <z-trace-collapsible-trigger>
      <z-trace-line zStatus="error">
        <z-trace-icon><ng-icon name="lucideFlaskConical" /></z-trace-icon>
        <z-trace-title>Ran 2 tests, 1 failed</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-trace>
        <z-trace-line>
          <z-trace-icon><ng-icon name="lucideCheck" /></z-trace-icon>
          <z-trace-title>creates a user</z-trace-title>
        </z-trace-line>
        <z-trace-collapsible>
          <z-trace-collapsible-trigger>
            <z-trace-line zStatus="error">
              <z-trace-icon><ng-icon name="lucideX" /></z-trace-icon>
              <z-trace-title>updates a user profile</z-trace-title>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content>
            <z-code-block zSize="sm">
              <z-code-block-content zWrap>Expected status 200, received 500</z-code-block-content>
            </z-code-block>
          </z-trace-collapsible-content>
        </z-trace-collapsible>
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Suites

```angular-html showLineNumbers copyButton
<z-trace-collapsible [zOpen]="hasFailure(suite.tests)">
  <z-trace-collapsible-trigger>
    <z-trace-line [zStatus]="hasFailure(suite.tests) ? 'error' : undefined">
      <z-trace-icon><ng-icon name="lucideFileCode" /></z-trace-icon>
      <z-trace-title>{{ suite.name }}, {{ formatCounts(suite.tests) }}</z-trace-title>
    </z-trace-line>
  </z-trace-collapsible-trigger>
  <z-trace-collapsible-content zKeepMounted>
    <z-trace>
      @for (test of suite.tests; track test.name) {
        <!-- a line for each test, as above -->
      }
    </z-trace>
  </z-trace-collapsible-content>
</z-trace-collapsible>
```

## Streaming

```angular-ts showLineNumbers copyButton
const tests = result.suites.flatMap(suite => suite.tests);
const failed = tests.filter(test => test.status === 'failed').length;
const title = `Ran ${tests.length} tests${failed > 0 ? `, ${failed} failed` : ''}`;
```
