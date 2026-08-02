import type { CodeBlockData } from '@highlight/types';

export const SETUP_NX_LIBRARY_TSCONFIG: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">{</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">  \"compilerOptions\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">    \"paths\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">      \"@/*\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: [</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"./libs/ui/src/lib/*\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    }</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  }</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">}</span></span></code></pre>",
  "code": "{\n  \"compilerOptions\": {\n    \"paths\": {\n      \"@/*\": [\"./libs/ui/src/lib/*\"]\n    }\n  }\n}",
  "language": "json",
  "title": "tsconfig.base.json",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false
};
