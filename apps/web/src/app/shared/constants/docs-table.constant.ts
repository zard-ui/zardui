/**
 * Class the docs reference tables (API, map sections, utilities) pass to `z-table` through its
 * `class` input, so the component itself stays untouched. The spacing lives in `styles.css` as
 * one plain rule: arbitrary Tailwind variants would each add a rule to the global stylesheet,
 * which counts against the initial bundle budget.
 */
export const DOCS_TABLE_CLASS = 'docs-table';
