import type { CodeBlockData } from '@highlight/types';

export const JSON_TAILWIND_CSS_EXAMPLE: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">{</span></span>\n<span class="line"><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5">  "tailwind"</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">: {</span></span>\n<span class="line"><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5">    "css"</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">: </span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62">"src/styles.css"</span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  }</span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">}</span></span></code></pre>',
  code: '{\n  "tailwind": {\n    "css": "src/styles.css"\n  }\n}',
  language: 'json',
  showLineNumbers: false,
  copyButton: false,
  expandable: false,
};
