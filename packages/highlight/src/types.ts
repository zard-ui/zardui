export interface CodeBlockData {
  html: string;
  code: string;
  language: string;
  title?: string;
  showLineNumbers: boolean;
  copyButton: boolean;
  expandable: boolean;
  expandableTitle?: string;
  highlightLines?: number[];
}

export interface CodeTabData {
  tabs: CodeTabItem[];
}

export interface CodeTabItem {
  label: string;
  html: string;
  code: string;
  language: string;
}
