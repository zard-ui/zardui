import type { CodeBlockData } from '@highlight/types';

export const BADGE_USAGE_IMPORT: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">import</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> { ZardBadgeComponent } </span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">from</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> \'@/shared/components/badge/badge.component\'</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">;</span></span></code></pre>',
  code: "import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';",
  language: 'angular-ts',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};

export const BADGE_USAGE_CODE: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-badge</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">>Badge&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-badge</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span></code></pre>',
  code: '<z-badge>Badge</z-badge>',
  language: 'angular-html',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};
