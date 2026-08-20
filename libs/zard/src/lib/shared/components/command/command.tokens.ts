import type { Signal, WritableSignal } from '@angular/core';

import type { ZardCommandOptionComponent } from './command-option.component';

/**
 * What a command's children may ask of it.
 *
 * The input and the options need the root at runtime, and the root needs both of
 * them for its content queries — injecting the concrete `ZardCommandComponent`
 * made that a real import cycle, and the module graph is evaluated in an order
 * where one of the two classes is still undefined. The children inject this
 * instead; `ZardCommandComponent` provides itself for the token.
 *
 * The reference to `ZardCommandOptionComponent` below is type-only, so it is
 * erased at compile time and adds no edge back.
 */
export abstract class ZardCommand {
  /** The current query, empty when nothing has been typed. */
  abstract readonly searchTerm: WritableSignal<string>;
  /** The options still visible for the current query, in document order. */
  abstract readonly filteredOptions: Signal<readonly ZardCommandOptionComponent[]>;

  abstract registerOption(option: ZardCommandOptionComponent): void;
  abstract unregisterOption(option: ZardCommandOptionComponent): void;

  /** Applies a new query. */
  abstract onSearch(searchTerm: string): void;
  /** Handles the arrow / enter / escape keys the input forwards. */
  abstract onKeyDown(event: KeyboardEvent): void;

  /** Moves the active highlight, by index into {@link filteredOptions}. */
  abstract setActiveByIndex(index: number): void;
  /** Commits a choice and emits it to the consumer. */
  abstract selectOption(option: ZardCommandOptionComponent): void;
}
