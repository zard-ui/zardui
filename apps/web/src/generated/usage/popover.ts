import type { CodeBlockData } from '@highlight/types';

export const POPOVER_USAGE_IMPORT: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">import</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> { ZardPopoverDirective } </span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">from</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> \'@/shared/components/popover/popover.component\'</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">;</span></span></code></pre>',
  code: "import { ZardPopoverDirective } from '@/shared/components/popover/popover.component';",
  language: 'angular-ts',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};

export const POPOVER_USAGE_CODE: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">button</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1"> z-button</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1"> [zPopover]</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">=</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62">"popoverContent"</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">>Open popover&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">button</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">ng-template</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1"> #popoverContent</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  &#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">p</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">>Place content for the popover here.&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">p</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">ng-template</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span></code></pre>',
  code: '<button z-button [zPopover]="popoverContent">Open popover</button>\n<ng-template #popoverContent>\n  <p>Place content for the popover here.</p>\n</ng-template>',
  language: 'angular-html',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};
