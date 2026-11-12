import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFilePen, lucideFilePlus, lucideGitCommitHorizontal } from '@ng-icons/lucide';

import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface ChangedFile {
  readonly path: string;
  readonly added: boolean;
  readonly additions: number;
  readonly deletions: number;
  readonly diff: string;
}

type DiffKind = 'hunk' | 'added' | 'removed' | 'context';

@Component({
  selector: 'z-demo-trace-commit',
  imports: [NgIcon, ...ZardSheetImports, ...ZardTraceImports],
  template: `
    <z-trace class="max-w-sm">
      <z-trace-collapsible zOpen>
        <z-trace-collapsible-trigger>
          <z-trace-line>
            <z-trace-icon><ng-icon name="lucideGitCommitHorizontal" /></z-trace-icon>
            <z-trace-title>Committed a1b2c3: Fix the login redirect</z-trace-title>
          </z-trace-line>
        </z-trace-collapsible-trigger>
        <z-trace-collapsible-content>
          <z-trace>
            @for (file of files; track file.path) {
              <button type="button" (click)="show(file)">
                <z-trace-line>
                  <z-trace-icon><ng-icon [name]="file.added ? 'lucideFilePlus' : 'lucideFilePen'" /></z-trace-icon>
                  <z-trace-title>{{ file.added ? 'Added' : 'Edited' }} {{ file.path }}</z-trace-title>
                  <z-trace-description class="font-mono">
                    +{{ file.additions }} −{{ file.deletions }}
                  </z-trace-description>
                  <z-trace-icon><ng-icon name="lucideChevronRight" class="rtl:-scale-x-100" /></z-trace-icon>
                </z-trace-line>
              </button>
            }
          </z-trace>
        </z-trace-collapsible-content>
      </z-trace-collapsible>
    </z-trace>

    <z-sheet [(zVisible)]="open">
      <z-sheet-header>
        <z-sheet-title class="font-mono">{{ selected().path }}</z-sheet-title>
        <z-sheet-description>
          {{ selected().additions }} additions, {{ selected().deletions }} deletions
        </z-sheet-description>
      </z-sheet-header>
      <pre
        class="bg-muted/50 mx-6 mb-6 overflow-auto rounded-lg border py-3 font-mono text-xs leading-relaxed"
      ><code>@for (line of lines(); track $index) {<span class="block px-3" [class]="lineClass[line.kind]">{{ line.text }}</span>}</code></pre>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFilePen, lucideFilePlus, lucideGitCommitHorizontal })],
  host: { class: 'contents' },
})
export class ZardDemoTraceCommitComponent {
  protected readonly files: readonly ChangedFile[] = [
    {
      path: 'app/login/page.tsx',
      added: false,
      additions: 2,
      deletions: 2,
      diff: `@@ -14,7 +14,7 @@ export default async function LoginPage({
   searchParams,
 }) {
   const { next } = await searchParams
-  const redirectTo =
-    next && next.startsWith("/") ? next : "/"
+  const redirectTo = safeRedirect(next)
+
   return <LoginForm redirectTo={redirectTo} />
 }`,
    },
    {
      path: 'lib/auth/redirect.ts',
      added: true,
      additions: 7,
      deletions: 0,
      diff: `@@ -0,0 +1,7 @@
+export function safeRedirect(next: string | undefined) {
+  if (!next || !next.startsWith("/") || next.startsWith("//")) {
+    return "/"
+  }
+
+  return next
+}`,
    },
  ];

  protected readonly open = signal(false);
  protected readonly selected = signal<ChangedFile>(this.files[0]);

  protected readonly lineClass: Record<DiffKind, string> = {
    hunk: 'text-muted-foreground',
    added: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    removed: 'bg-red-500/10 text-red-700 dark:text-red-400',
    context: 'text-foreground',
  };

  /** One entry per diff line, without the leading `+`, `-` or space. */
  protected readonly lines = computed(() =>
    this.selected()
      .diff.split('\n')
      .map(line => {
        if (line.startsWith('@@')) return { kind: 'hunk' as DiffKind, text: line };
        const kind: DiffKind = line.startsWith('+') ? 'added' : line.startsWith('-') ? 'removed' : 'context';
        return { kind, text: line.slice(1) || ' ' };
      }),
  );

  protected show(file: ChangedFile): void {
    this.selected.set(file);
    this.open.set(true);
  }
}
