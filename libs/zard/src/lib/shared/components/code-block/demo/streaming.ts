import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRotateCcw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import type { ZardCodeBlockLineTypeVariants } from '@/shared/components/code-block/code-block.variants';

interface StreamedBlock {
  readonly title?: string;
  readonly language: string;
  readonly code: string;
  readonly lineNumbers?: boolean;
  readonly highlight?: readonly number[];
  /** Rows start with `+`, `-` or a space; the marker is not part of the code. */
  readonly diff?: boolean;
}

const BLOCKS: readonly StreamedBlock[] = [
  {
    title: 'src/app/shared/debounced.ts',
    language: 'typescript',
    lineNumbers: true,
    code: `export function debounced<T>(source: Signal<T>, delay = 300): Signal<T> {
  const value = signal(source());

  effect(onCleanup => {
    const next = source();
    const timeout = setTimeout(() => value.set(next), delay);
    onCleanup(() => clearTimeout(timeout));
  });

  return value.asReadonly();
}`,
  },
  {
    language: 'bash',
    code: 'npx zard-cli@latest add code-block',
  },
  {
    title: 'src/app/search/search.component.ts',
    language: 'typescript',
    lineNumbers: true,
    diff: true,
    code: ` export class SearchComponent {
   protected readonly query = signal('');
-  protected readonly results = injectSearch(this.query);
+  protected readonly debouncedQuery = debounced(this.query, 300);
+  protected readonly results = injectSearch(this.debouncedQuery);
 }`,
  },
  {
    title: 'src/app/chat/chat.service.ts',
    language: 'typescript',
    lineNumbers: true,
    highlight: [4, 5, 6, 7, 8],
    code: `@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  stream(messages: ChatMessage[]) {
    return this.http.post('/api/chat', { messages }, {
      observe: 'events',
      reportProgress: true,
    });
  }
}`,
  },
  {
    title: 'proxy.conf.json',
    language: 'json',
    code: `{ "/api": { "target": "http://localhost:3000" } }`,
  },
];

/** Where each block starts in the stream. */
const OFFSETS = BLOCKS.map((_, index) => BLOCKS.slice(0, index).reduce((total, block) => total + block.code.length, 0));
const TOTAL = BLOCKS.reduce((sum, block) => sum + block.code.length, 0);

@Component({
  selector: 'z-demo-code-block-streaming',
  imports: [NgIcon, ZardButtonComponent, ...ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4">
      @for (block of blocks; track $index) {
        @if (block.visible()) {
          <z-code-block>
            @if (block.title) {
              <z-code-block-header>
                <z-code-block-title>{{ block.title }}</z-code-block-title>
                <z-code-block-actions>
                  <!-- Copying is disabled until the block has arrived in full. -->
                  <z-code-block-copy-button [zValue]="block.source()" [zDisabled]="!block.complete()" />
                </z-code-block-actions>
              </z-code-block-header>
            }
            <z-code-block-content [zLineNumbers]="block.lineNumbers ?? false">
              @for (line of block.lines(); track $index) {
                <z-code-block-line [zTokens]="line" [zType]="block.lineType($index)" />
              }
            </z-code-block-content>
          </z-code-block>
        }
      }
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        class="self-start"
        [zDisabled]="length() < total"
        (click)="replay()"
      >
        <ng-icon name="lucideRotateCcw" />
        Replay
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideRotateCcw })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockStreamingComponent {
  protected readonly total = TOTAL;
  /** How many characters of the whole stream have arrived. The page opens on the finished blocks. */
  protected readonly length = signal(TOTAL);

  protected readonly blocks = BLOCKS.map((block, index) => {
    const code = computed(() => block.code.slice(0, Math.max(0, this.length() - OFFSETS[index])));
    const rows = computed(() => code().split('\n'));
    const source = computed(() =>
      block.diff
        ? rows()
            .map(row => row.slice(1))
            .join('\n')
        : code(),
    );

    return {
      ...block,
      visible: computed(() => this.length() > OFFSETS[index]),
      complete: computed(() => code().length === block.code.length),
      source,
      // Highlighted again as the code grows; the lines that did not change keep their colors.
      lines: injectHighlightedCode(source, block.language),
      lineType: (line: number): ZardCodeBlockLineTypeVariants => {
        if (block.diff) {
          const row = rows()[line] ?? '';
          return row.startsWith('+') ? 'added' : row.startsWith('-') ? 'removed' : 'default';
        }
        return block.highlight?.includes(line) ? 'highlighted' : 'default';
      },
    };
  });

  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected replay(): void {
    this.length.set(0);
    this.tick();
  }

  private tick(): void {
    if (this.length() >= TOTAL) {
      return;
    }

    this.timer = setTimeout(() => {
      this.length.update(length => Math.min(TOTAL, length + 3));
      this.tick();
    }, 16);
  }
}
