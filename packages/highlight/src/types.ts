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
  /** When the block is a manual-install step, the heading it gets instead of "Add <title>". */
  step?: { title: string; subtitle?: string };
}

export interface ComponentUsageData {
  importBlock: CodeBlockData;
  codeBlock: CodeBlockData;
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
