import type { CodeBlockData, CodeTabData } from '@highlight/types';

export const TABS_0: CodeTabData = {
  "tabs": [
    {
      "label": "npm",
      "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-cli</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> add</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> button</span></span></code></pre>",
      "code": "npx zard-cli add button",
      "language": "bash"
    },
    {
      "label": "pnpm",
      "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">pnpm</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> dlx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-cli</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> add</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> button</span></span></code></pre>",
      "code": "pnpm dlx zard-cli add button",
      "language": "bash"
    },
    {
      "label": "yarn",
      "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">yarn</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> dlx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-cli</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> add</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> button</span></span></code></pre>",
      "code": "yarn dlx zard-cli add button",
      "language": "bash"
    },
    {
      "label": "bun",
      "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">bunx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-cli</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> add</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> button</span></span></code></pre>",
      "code": "bunx zard-cli add button",
      "language": "bash"
    }
  ]
};

export const BLOCK_1: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">import</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> { ZardButtonComponent } </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> '@/shared/components/button/button.component'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span></code></pre>",
  "code": "import { ZardButtonComponent } from '@/shared/components/button/button.component';",
  "language": "angular-ts",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false
};

export const BLOCK_2: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">div</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> class</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"scroll-fade-x flex gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none]\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">  @for</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> (</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">suggestion</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\"> of</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> suggestions; </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">track</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> suggestion) {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    &#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">button</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> type</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"button\"</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> z-button</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> zType</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"outline\"</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> zSize</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"sm\"</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> class</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"shrink-0\"</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> (click)</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"send(suggestion)\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">      {{ suggestion }}</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    &#x3C;/</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">button</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  }</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;/</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">div</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span></code></pre>",
  "code": "<div class=\"scroll-fade-x flex gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none]\">\n  @for (suggestion of suggestions; track suggestion) {\n    <button type=\"button\" z-button zType=\"outline\" zSize=\"sm\" class=\"shrink-0\" (click)=\"send(suggestion)\">\n      {{ suggestion }}\n    </button>\n  }\n</div>",
  "language": "angular-html",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false
};

export const BLOCK_3: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">protected </span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">send</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">(suggestion: string): </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">void</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">  this</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">.chat.</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">send</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">({ text: suggestion });</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">}</span></span></code></pre>",
  "code": "protected send(suggestion: string): void {\n  this.chat.send({ text: suggestion });\n}",
  "language": "angular-ts",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false
};

