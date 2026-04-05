import type { CodeBlockData } from '@highlight/types';

export const DIALOG_USAGE_IMPORT: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">import</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> { ZardDialogImports } </span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">from</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> \'@/shared/components/dialog/dialog.imports\'</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">;</span></span></code></pre>',
  code: "import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';",
  language: 'angular-ts',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};

export const DIALOG_USAGE_CODE: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-dialog</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1"> zTitle</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">=</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62">"Edit profile"</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1"> zDescription</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">=</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62">"Make changes to your profile here."</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  &#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">p</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">>Dialog content goes here.&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">p</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-dialog</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span></code></pre>',
  code: '<z-dialog zTitle="Edit profile" zDescription="Make changes to your profile here.">\n  <p>Dialog content goes here.</p>\n</z-dialog>',
  language: 'angular-html',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};
