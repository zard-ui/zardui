import type { CodeBlockData } from '@highlight/types';

export const FORM_USAGE_IMPORT: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">import</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> { ZardFormImports } </span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">from</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> \'@/shared/components/form/form.imports\'</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">;</span></span></code></pre>',
  code: "import { ZardFormImports } from '@/shared/components/form/form.imports';",
  language: 'angular-ts',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};

export const FORM_USAGE_CODE: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-form-field</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  &#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-form-label</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">>Email&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-form-label</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  &#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-form-control</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">    &#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">input</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1"> z-input</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1"> placeholder</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">=</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62">"email@example.com"</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> /></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  &#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-form-control</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  &#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-form-message</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">>Enter your email address.&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-form-message</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-form-field</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span></code></pre>',
  code: '<z-form-field>\n  <z-form-label>Email</z-form-label>\n  <z-form-control>\n    <input z-input placeholder="email@example.com" />\n  </z-form-control>\n  <z-form-message>Enter your email address.</z-form-message>\n</z-form-field>',
  language: 'angular-html',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};
