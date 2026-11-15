# Sources

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
        <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
        <z-trace-title>Used {{ sources.length }} sources</z-trace-title>
      </z-trace-line>
    </z-trace-collapsible-trigger>
    <z-trace-collapsible-content>
      <z-trace>
        @for (source of sources; track source.url) {
          <a [href]="source.url" target="_blank" rel="noreferrer">
            <z-trace-line>
              <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
              <z-trace-title>
                {{ source.title ?? hostname(source.url) }}
                <span class="sr-only">(opens in a new tab)</span>
              </z-trace-title>
              <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
            </z-trace-line>
          </a>
        }
      </z-trace>
    </z-trace-collapsible-content>
  </z-trace-collapsible>
</z-trace>
```

## Streaming

```angular-ts showLineNumbers copyButton
protected readonly cited = signal<Source[]>([]);

/** The agent can cite a page more than once: list each URL once. */
protected readonly sources = computed(() =>
  this.cited().filter((source, index, all) => all.findIndex(other => other.url === source.url) === index),
);
```
