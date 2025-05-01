export interface ZardCommandOption {
  value: any;
  label: string;
  icon?: string;
  command?: string;
  selected?: boolean;
  shortcut?: string;
  disabled?: boolean;
}

export interface ZardCommandGroup {
  label: string;
  options: ZardCommandOption[];
}
