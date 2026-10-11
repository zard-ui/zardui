export interface PickerOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

/** One radio group of a picker's popup. Most pickers have one; the menu picker has two (color, appearance). */
export interface PickerSection {
  readonly id: string;
  readonly label?: string;
  /** The selected option. */
  readonly value: string;
  readonly options: readonly PickerOption[];
  /** Draws a separator after the section. */
  readonly separatorAfter?: boolean;
}

export interface PickerEvent {
  readonly section: string;
  readonly value: string;
}
