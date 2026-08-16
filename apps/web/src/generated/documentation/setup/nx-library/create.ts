import type { CodeBlockData } from '@highlight/types';

export const SETUP_NX_LIBRARY_CREATE: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> nx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> g</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> @nx/angular:library</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --name=ui</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --directory=libs/ui</span></span></code></pre>",
  "code": "npx nx g @nx/angular:library --name=ui --directory=libs/ui",
  "language": "bash",
  "title": "Terminal",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};
