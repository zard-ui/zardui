import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CopyButtonComponent } from '@highlight/components/copy-button/copy-button.component';
import type { CodeBlockData } from '@highlight/types';

import { injectSheetData } from '@zard/components/sheet/sheet.service';

export interface ChartCodeSheetData {
  codeData: CodeBlockData;
  fileName: string;
}

/** The body of the "View Code" sheet: a file bar over the demo's source. */
@Component({
  selector: 'z-chart-code-sheet',
  imports: [CodeBlockComponent, CopyButtonComponent],
  template: `
    <div class="flex min-h-0 flex-1 flex-col px-4 pb-4">
      <div class="bg-muted/50 flex items-center gap-2 rounded-t-lg border border-b-0 px-3 py-2">
        <span class="text-muted-foreground truncate font-mono text-xs">{{ data.fileName }}</span>
        <z-copy-button
          [code]="codeData.code"
          class="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring ml-auto flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>
      <div class="min-h-0 flex-1 overflow-auto rounded-b-lg border">
        <z-code-block [data]="codeData" [embedded]="true" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The portal drops this host into the sheet's flex column; without a height of its own the
  // code area has nothing to shrink against and the panel grows past the viewport.
  host: { class: 'flex min-h-0 flex-1 flex-col' },
})
export class ChartCodeSheetComponent {
  protected readonly data = injectSheetData<ChartCodeSheetData>();

  // The copy button lives in the file bar, so the block must not float one over the first line.
  protected readonly codeData: CodeBlockData = { ...this.data.codeData, expandable: false, copyButton: false };
}
