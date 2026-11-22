/** How long a pause ends a type-ahead search. */
const TYPEAHEAD_RESET_MS = 1000;

/**
 * The keyboard of a menu, as Radix does it: arrows wrap, Home and End jump, typing a few letters moves to the item
 * that starts with them (the same letter again cycles), and Tab closes the menu.
 */
export class MenuKeyboard {
  private search = '';
  private timer?: ReturnType<typeof setTimeout>;

  constructor(
    /** The element holding focus right now. */
    private readonly active: () => Element | null,
    private readonly close: () => void,
  ) {}

  /** Handles `event` against the enabled `items` of the menu. Returns whether the key was consumed. */
  handle(event: KeyboardEvent, items: readonly HTMLElement[]): boolean {
    const current = items.indexOf(this.active() as HTMLElement);
    const last = items.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[current < 0 ? 0 : (current + 1) % items.length]?.focus();
        return true;
      case 'ArrowUp':
        event.preventDefault();
        items[current < 0 ? last : (current - 1 + items.length) % items.length]?.focus();
        return true;
      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        return true;
      case 'End':
        event.preventDefault();
        items[last]?.focus();
        return true;
      case 'Tab':
        // The menu lives at the end of `body`: tabbing on from there would leave the page's order. Close instead.
        event.preventDefault();
        this.close();
        return true;
    }

    const typed = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    if (!typed || (event.key === ' ' && this.search === '')) return false;

    event.preventDefault();
    this.typeAhead(event.key, items, current);
    return true;
  }

  dispose(): void {
    clearTimeout(this.timer);
  }

  private typeAhead(char: string, items: readonly HTMLElement[], current: number): void {
    clearTimeout(this.timer);
    this.search += char.toLowerCase();
    this.timer = setTimeout(() => (this.search = ''), TYPEAHEAD_RESET_MS);

    // "mm" cycles through the items starting with "m" instead of searching for the text "mm".
    const repeated = this.search.length > 1 && [...this.search].every(c => c === this.search[0]);
    const needle = repeated ? this.search[0] : this.search;

    const start = Math.max(current, 0);
    let ordered = [...items.slice(start), ...items.slice(0, start)];
    // One letter moves on from the current item rather than staying on it.
    if (needle.length === 1 && current >= 0) ordered = ordered.filter(item => item !== items[current]);

    ordered.find(item => (item.textContent ?? '').trim().toLowerCase().startsWith(needle))?.focus();
  }
}
