# Trace snippets

Code fragments shown on the trace docs page: the composition trees and the `codeAfter` blocks.
Each fenced block is exported as `TRACE_SNIPPET_<ID>` via the snippet generator.

```text id="composition-line" copyButton
z-trace
└── z-trace-line
    ├── z-trace-icon
    ├── z-trace-title
    ├── z-trace-description
    └── z-trace-icon
```

```text id="composition-collapsible" copyButton
z-trace
└── z-trace-collapsible
    ├── z-trace-collapsible-trigger
    │   └── z-trace-line
    └── z-trace-collapsible-content
```

```angular-ts id="open-state" copyButton
// Undefined until the reader toggles the row, so it follows `running` until then.
protected readonly open = signal<boolean | undefined>(undefined);
```

```angular-html id="open-state-template" copyButton
<z-trace-collapsible [zOpen]="open() ?? running()" (zOpenChange)="open.set($event)">
  <z-trace-collapsible-trigger>
    <z-trace-line [zStatus]="running() ? 'running' : undefined">…</z-trace-line>
  </z-trace-collapsible-trigger>
  <z-trace-collapsible-content>{{ text() }}</z-trace-collapsible-content>
</z-trace-collapsible>
```

```angular-html id="link" copyButton
<a href="https://angular.dev/installation" target="_blank" rel="noreferrer">
  <z-trace-line>
    <z-trace-title>
      Install Angular
      <span class="sr-only">(opens in a new tab)</span>
    </z-trace-title>
    <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
  </z-trace-line>
</a>
```

```angular-html id="dialog" copyButton
<button type="button" (click)="open.set(true)">
  <z-trace-line>
    <z-trace-title>Searched the web for build cache settings</z-trace-title>
    <z-trace-icon><ng-icon name="lucideChevronRight" /></z-trace-icon>
  </z-trace-line>
</button>

<z-dialog [(zVisible)]="open">…</z-dialog>
```
