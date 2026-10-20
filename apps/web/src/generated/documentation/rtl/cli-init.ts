import type { CodeBlockData } from '@highlight/types';

export const RTL_CLI_INIT: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># The project reads right to left</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-cli@latest</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> init</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --rtl</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># The project reads left to right (the default)</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-cli@latest</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> init</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --no-rtl</span></span></code></pre>",
  "code": "# The project reads right to left\nnpx zard-cli@latest init --rtl\n\n# The project reads left to right (the default)\nnpx zard-cli@latest init --no-rtl",
  "language": "bash",
  "title": "Terminal",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};
