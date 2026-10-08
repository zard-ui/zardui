import type { CodeBlockData } from '@highlight/types';

export const CALENDAR_SNIPPET_CUSTOM_CELL_SIZE_SPACING: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\">&#x3C;!-- Scale every measurement with the Tailwind spacing scale. --></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-calendar</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> class</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> /></span></span></code></pre>",
  "code": "<!-- Scale every measurement with the Tailwind spacing scale. -->\n<z-calendar class=\"rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]\" />",
  "language": "angular-html",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const CALENDAR_SNIPPET_CUSTOM_CELL_SIZE_FIXED: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\">&#x3C;!-- Or use fixed values. --></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-calendar</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> class</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"rounded-lg border [--cell-size:2.75rem] md:[--cell-size:3rem]\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> /></span></span></code></pre>",
  "code": "<!-- Or use fixed values. -->\n<z-calendar class=\"rounded-lg border [--cell-size:2.75rem] md:[--cell-size:3rem]\" />",
  "language": "angular-html",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const CALENDAR_SNIPPET_I18N_APP_CONFIG: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">import</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> { ApplicationConfig } </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> '@angular/core'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">import</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> { provideZardI18n } </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> '@/shared/core/i18n'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">export</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\"> const</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> appConfig</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">:</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> ApplicationConfig</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\"> =</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  providers: [</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">    provideZardI18n</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">(</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">'pt-BR'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">),</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  ],</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">};</span></span></code></pre>",
  "code": "import { ApplicationConfig } from '@angular/core';\nimport { provideZardI18n } from '@/shared/core/i18n';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideZardI18n('pt-BR'),\n  ],\n};",
  "language": "angular-ts",
  "title": "app.config.ts",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

