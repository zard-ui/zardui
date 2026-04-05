import type { CodeBlockData } from '@highlight/types';

export const TABS_USAGE_IMPORT: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">import</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> { ZardTabComponent } </span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">from</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> \'@/shared/components/tabs/tab.component\'</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">;</span></span>\n<span class="line"><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">import</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> { ZardTabGroupComponent } </span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">from</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> \'@/shared/components/tabs/tabs.component\'</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">;</span></span></code></pre>',
  code: "import { ZardTabComponent } from '@/shared/components/tabs/tab.component';\nimport { ZardTabGroupComponent } from '@/shared/components/tabs/tabs.component';",
  language: 'angular-ts',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};

export const TABS_USAGE_CODE: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-tab-group</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  &#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-tab</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1"> label</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">=</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62">"Account"</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">>Account content here.&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-tab</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  &#x3C;</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-tab</span><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1"> label</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">=</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62">"Password"</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">>Password content here.&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-tab</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">&#x3C;/</span><span style="--shiki-dark:#85E89D;--shiki-light:#22863A">z-tab-group</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">></span></span></code></pre>',
  code: '<z-tab-group>\n  <z-tab label="Account">Account content here.</z-tab>\n  <z-tab label="Password">Password content here.</z-tab>\n</z-tab-group>',
  language: 'angular-html',
  showLineNumbers: true,
  copyButton: true,
  expandable: false,
};
