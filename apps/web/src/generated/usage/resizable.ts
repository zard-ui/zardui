import type { CodeBlockData } from '@highlight/types';

export const RESIZABLE_USAGE_IMPORT: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">import</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> { ZardResizableImports } </span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">from</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> \'@/shared/components/resizable/resizable.imports\'</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">;</span></span></code></pre>',
  code: "import { ZardResizableImports } from '@/shared/components/resizable/resizable.imports';",
  language: 'angular-ts',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};

export const RESIZABLE_USAGE_CODE: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-resizable</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  &#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-resizable-panel</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">>Panel One&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-resizable-panel</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  &#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-resizable-handle</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> /></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  &#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-resizable-panel</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">>Panel Two&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-resizable-panel</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-resizable</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span></code></pre>',
  code: '<z-resizable>\n  <z-resizable-panel>Panel One</z-resizable-panel>\n  <z-resizable-handle />\n  <z-resizable-panel>Panel Two</z-resizable-panel>\n</z-resizable>',
  language: 'angular-html',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};
