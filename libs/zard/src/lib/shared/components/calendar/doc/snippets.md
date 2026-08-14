# Calendar snippets

Illustrative code fragments used as `codeAfter` blocks on the calendar docs page.
Each fenced block is exported as `CALENDAR_SNIPPET_<ID>` via the snippet generator.

```angular-html id="custom-cell-size-spacing" copyButton
<!-- Scale every measurement with the Tailwind spacing scale. -->
<z-calendar class="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]" />
```

```angular-html id="custom-cell-size-fixed" copyButton
<!-- Or use fixed values. -->
<z-calendar class="rounded-lg border [--cell-size:2.75rem] md:[--cell-size:3rem]" />
```
