/**
 * Source of every prose code snippet on the `/docs/forms` guides.
 *
 * These files are the input of the `forms-writer` generator: it reads them at
 * build time, highlights each entry with Shiki and emits the `CodeBlockData`
 * the pages import from `@generated/forms/snippets/<approach>`. Nothing here
 * ships to the browser — the pages never import these files directly.
 */
export interface FormSnippet {
  /** Any language registered in the highlighter (`angular-ts`, `angular-html`, `bash`, ...). */
  language: string;
  /** File name header shown above the block. */
  title?: string;
  /** 1-based lines to emphasise, e.g. `[1, 3, 4, 5]`. */
  highlightLines?: number[];
  /** The snippet itself. */
  code: string;
}

export type FormSnippetMap = Record<string, FormSnippet>;
