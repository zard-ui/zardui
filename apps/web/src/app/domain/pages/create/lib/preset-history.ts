/**
 * The undo/redo stack of preset codes.
 *
 * It only observes: every code the page settles on is `observe`d, and a code that differs from the current entry
 * becomes a new one (dropping whatever was ahead of it). `undo`/`redo` move the cursor and remember the code they
 * are about to cause, so the `observe` that follows does not record it a second time.
 */
export class PresetHistory {
  private entries: string[];
  private cursor = 0;
  private expected: string | null = null;

  constructor(initial: string) {
    this.entries = [initial];
  }

  get current(): string {
    return this.entries[this.cursor] ?? '';
  }

  get canUndo(): boolean {
    return this.cursor > 0;
  }

  get canRedo(): boolean {
    return this.cursor < this.entries.length - 1;
  }

  /** Records `code` unless it is the one an undo/redo just asked for, or already the current entry. */
  observe(code: string): void {
    if (this.expected !== null) {
      const wasExpected = this.expected === code;
      this.expected = null;
      if (wasExpected) return;
    }

    if (code === this.current) return;

    this.entries = [...this.entries.slice(0, this.cursor + 1), code];
    this.cursor = this.entries.length - 1;
  }

  /** The code to go back to, or `null` at the start. */
  undo(): string | null {
    if (!this.canUndo) return null;
    this.cursor -= 1;
    this.expected = this.current;
    return this.current;
  }

  redo(): string | null {
    if (!this.canRedo) return null;
    this.cursor += 1;
    this.expected = this.current;
    return this.current;
  }
}
