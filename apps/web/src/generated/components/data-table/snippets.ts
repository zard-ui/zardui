import type { CodeBlockData } from '@highlight/types';

export const DATA_TABLE_SNIPPET_PROJECT_STRUCTURE: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span>src/app/payments</span></span>\n<span class=\"line\"><span>├── payments.ts        # the Payment type and the data</span></span>\n<span class=\"line\"><span>├── features.ts        # tableFeatures(): what the table can do</span></span>\n<span class=\"line\"><span>├── columns.ts         # the column definitions</span></span>\n<span class=\"line\"><span>└── payments-table.ts  # the component: injectTable() + &#x3C;z-data-table></span></span></code></pre>",
  "code": "src/app/payments\n├── payments.ts        # the Payment type and the data\n├── features.ts        # tableFeatures(): what the table can do\n├── columns.ts         # the column definitions\n└── payments-table.ts  # the component: injectTable() + <z-data-table>",
  "language": "text",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const DATA_TABLE_SNIPPET_COLUMN_HEADER: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">columnHelper.</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">accessor</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">(</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">'email'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">, {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">  header</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: () </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">=></span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> flexRenderComponent</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">'Email'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> } }),</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">}),</span></span></code></pre>",
  "code": "columnHelper.accessor('email', {\n  header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Email' } }),\n}),",
  "language": "angular-ts",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const DATA_TABLE_SNIPPET_PAGINATION: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-data-table</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> [zTable]</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"table\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-data-table-pagination</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> [zTable]</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"table\"</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> [zPageSizeOptions]</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"[10, 20, 50]\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> /></span></span></code></pre>",
  "code": "<z-data-table [zTable]=\"table\" />\n<z-data-table-pagination [zTable]=\"table\" [zPageSizeOptions]=\"[10, 20, 50]\" />",
  "language": "angular-html",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const DATA_TABLE_SNIPPET_VIEW_OPTIONS: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">div</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> class</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"flex items-center py-4\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  &#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-data-table-view-options</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> [zTable]</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"table\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;/</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">div</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span></code></pre>",
  "code": "<div class=\"flex items-center py-4\">\n  <z-data-table-view-options [zTable]=\"table\" />\n</div>",
  "language": "angular-html",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const DATA_TABLE_SNIPPET_COLUMN_META: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">const</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> features</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\"> =</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> tableFeatures</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">({</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\">  // …</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  columnMeta: {} </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">as</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> ZardDataTableColumnMeta</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">});</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">columnHelper.</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">accessor</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">(</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">'amount'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">, {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  header: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">'Amount'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  meta: { headerClass: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">'text-end'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">, cellClass: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">'text-end font-medium'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">}),</span></span></code></pre>",
  "code": "const features = tableFeatures({\n  // …\n  columnMeta: {} as ZardDataTableColumnMeta,\n});\n\ncolumnHelper.accessor('amount', {\n  header: 'Amount',\n  meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },\n}),",
  "language": "angular-ts",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

