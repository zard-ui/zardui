import type { CodeBlockData } from '@highlight/types';

export const SETUP_SHARED_POSTCSS: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">{</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">  \"plugins\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">    \"@tailwindcss/postcss\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: {}</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  }</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">}</span></span></code></pre>",
  "code": "{\n  \"plugins\": {\n    \"@tailwindcss/postcss\": {}\n  }\n}",
  "language": "json",
  "title": ".postcssrc.json",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};
