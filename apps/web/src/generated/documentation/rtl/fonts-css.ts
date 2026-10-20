import type { CodeBlockData } from '@highlight/types';

export const RTL_FONTS_CSS: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">@import</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> 'tailwindcss'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line highlighted\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">@import</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> '@fontsource-variable/noto-sans-arabic'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">@theme</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> inline {</span></span>\n<span class=\"line highlighted\"><span style=\"--shiki-dark:#FFAB70;--shiki-light:#E36209\">  --font-sans</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">'Noto Sans Arabic Variable'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">, </span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">sans-serif</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">}</span></span></code></pre>",
  "code": "@import 'tailwindcss';\n@import '@fontsource-variable/noto-sans-arabic';\n\n@theme inline {\n  --font-sans: 'Noto Sans Arabic Variable', sans-serif;\n}",
  "language": "css",
  "title": "src/styles.css",
  "showLineNumbers": true,
  "copyButton": false,
  "expandable": false,
  "highlightLines": [
    2,
    5
  ]
};
