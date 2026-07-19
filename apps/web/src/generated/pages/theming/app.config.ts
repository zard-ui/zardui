import type { CodeBlockData } from '@highlight/types';

export const BLOCK_0: CodeBlockData = {
  html: '<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code><span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">import { </span><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5">ApplicationConfig</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> } from \'</span><span style="--shiki-dark:#F97583;--shiki-light:#D73A49">@angular</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">/core\';</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">import { </span><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5">provideZard</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E"> } from \'@/shared/components/core/provider/providezard\';</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">export const appConfig: ApplicationConfig = {</span></span>\n<span class="line"><span style="--shiki-dark:#79B8FF;--shiki-light:#005CC5">  providers</span><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">: [</span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">    ...</span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">    provideZard(),</span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">  ]</span></span>\n<span class="line"><span style="--shiki-dark:#E1E4E8;--shiki-light:#24292E">};</span></span></code></pre>',
  code: "import { ApplicationConfig } from '@angular/core';\n\nimport { provideZard } from '@/shared/components/core/provider/providezard';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    ...\n    provideZard(),\n  ]\n};",
  language: 'css',
  title: 'src/app/app.config.ts',
  showLineNumbers: false,
  copyButton: true,
  expandable: true,
};
