import type { CodeTabData } from '@highlight/types';

export const PROGRESS_BAR_CLI_ADD: CodeTabData = {
  tabs: [
    {
      label: 'npm',
      html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1">npx</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> zard-cli@latest</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> add</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> progress-bar</span></span></code></pre>',
      code: 'npx zard-cli@latest add progress-bar',
      language: 'bash',
    },
    {
      label: 'pnpm',
      html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1">pnpm</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> dlx</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> zard-cli@latest</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> add</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> progress-bar</span></span></code></pre>',
      code: 'pnpm dlx zard-cli@latest add progress-bar',
      language: 'bash',
    },
    {
      label: 'yarn',
      html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1">yarn</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> dlx</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> zard-cli@latest</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> add</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> progress-bar</span></span></code></pre>',
      code: 'yarn dlx zard-cli@latest add progress-bar',
      language: 'bash',
    },
    {
      label: 'bun',
      html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#B392F0;--shiki-light:#6F42C1">bunx</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> zard-cli@latest</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> add</span><span style="--shiki-dark:#9ECBFF;--shiki-light:#032F62"> progress-bar</span></span></code></pre>',
      code: 'bunx zard-cli@latest add progress-bar',
      language: 'bash',
    },
  ],
};
