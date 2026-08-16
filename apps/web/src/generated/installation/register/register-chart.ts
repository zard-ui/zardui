import type { CodeBlockData } from '@highlight/types';

export const CHART_REGISTER: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">import</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> { ApplicationConfig } </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> '@angular/core'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line highlighted\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">import</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> { provideZardCharts } </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> '@/shared/components/chart/chart-echarts.provider'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">export</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\"> const</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> appConfig</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">:</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> ApplicationConfig</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\"> =</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  providers: [</span></span>\n<span class=\"line highlighted\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">    provideZardCharts</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">(),</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  ],</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">};</span></span></code></pre>",
  "code": "import { ApplicationConfig } from '@angular/core';\nimport { provideZardCharts } from '@/shared/components/chart/chart-echarts.provider';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideZardCharts(),\n  ],\n};",
  "language": "angular-ts",
  "title": "app.config.ts",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false,
  "highlightLines": [
    2,
    6
  ]
};
