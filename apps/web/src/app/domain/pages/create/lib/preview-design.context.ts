import { Injectable, signal } from '@angular/core';

import { DEFAULT_DESIGN, fontById, STYLES } from '@zard/design';
import type { DesignConfig } from '@zard/design';

/** The design the preview iframe is currently showing, for the cards that print it (the specimen, the swatches). */
@Injectable({ providedIn: 'root' })
export class PreviewDesignContext {
  readonly design = signal<DesignConfig>({ ...DEFAULT_DESIGN });

  styleLabel(): string {
    const style = this.design().style;
    return STYLES.find(option => option.value === style)?.label ?? style;
  }

  fontLabel(): string {
    const id = this.design().font;
    return fontById(id)?.label ?? id;
  }
}
