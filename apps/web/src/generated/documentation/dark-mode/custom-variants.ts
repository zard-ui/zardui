import type { CodeBlockData } from '@highlight/types';

export const DARK_MODE_CUSTOM_VARIANTS: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">@theme</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> {</span></span>\n<span class="line"><span style="--shiki-dark:#6A737D;--shiki-light:#6A737D">  /* Your existing theme configuration */</span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">}</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-dark:#6A737D;--shiki-light:#6A737D">/* Dark mode custom variant */</span></span>\n<span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">@custom-variant</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> dark (&#x26;:is(.dark *));</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-dark:#6A737D;--shiki-light:#6A737D">/* This enables dark: prefix for all utilities */</span></span>\n<span class="line"><span style="--shiki-dark:#6A737D;--shiki-light:#6A737D">/* Example: dark:bg-gray-900, dark:text-white */</span></span></code></pre>',
  code: '@theme {\n  /* Your existing theme configuration */\n}\n\n/* Dark mode custom variant */\n@custom-variant dark (&:is(.dark *));\n\n/* This enables dark: prefix for all utilities */\n/* Example: dark:bg-gray-900, dark:text-white */',
  language: 'css',
  showLineNumbers: false,
  copyButton: false,
  expandable: false,
};
