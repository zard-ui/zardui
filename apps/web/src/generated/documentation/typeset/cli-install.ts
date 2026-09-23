import type { CodeTabData } from '@highlight/types';

export const TYPESET_CLI_INSTALL: CodeTabData = {
  "tabs": [
    {
      "label": "CLI",
      "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-cli@latest</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> add</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> typeset</span></span></code></pre>",
      "code": "npx zard-cli@latest add typeset",
      "language": "bash"
    },
    {
      "label": "Manual",
      "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">@import</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> 'tailwindcss'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">@import</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> './typeset.css'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span></code></pre>",
      "code": "@import 'tailwindcss';\n@import './typeset.css';",
      "language": "css"
    }
  ]
};
