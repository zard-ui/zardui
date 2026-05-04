import type { CodeBlockData } from '@highlight/types';

export const ITEM_USAGE_IMPORT: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">import</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> { ZardItemImports } </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> '@/shared/components/item/item.imports'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span></code></pre>",
  "code": "import { ZardItemImports } from '@/shared/components/item/item.imports';",
  "language": "angular-ts",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false
};

export const ITEM_USAGE_CODE: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-item</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> zVariant</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"outline\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  &#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-item-content</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    &#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-item-title</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">>Title&#x3C;/</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-item-title</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    &#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-item-description</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">>Description&#x3C;/</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-item-description</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  &#x3C;/</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-item-content</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;/</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-item</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span></code></pre>",
  "code": "<z-item zVariant=\"outline\">\n  <z-item-content>\n    <z-item-title>Title</z-item-title>\n    <z-item-description>Description</z-item-description>\n  </z-item-content>\n</z-item>",
  "language": "angular-html",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false
};
