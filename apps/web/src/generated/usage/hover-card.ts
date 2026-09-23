import type { CodeBlockData } from '@highlight/types';

export const HOVER_CARD_USAGE_IMPORT: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">import</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\"> { ZardHoverCardComponent, ZardHoverCardDirective } </span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">from</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> '@/shared/components/hover-card/hover-card.component'</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">;</span></span></code></pre>",
  "code": "import { ZardHoverCardComponent, ZardHoverCardDirective } from '@/shared/components/hover-card/hover-card.component';",
  "language": "angular-ts",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false
};

export const HOVER_CARD_USAGE_CODE: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">button</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> [zHoverCard]</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"content\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  Hover Here</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;/</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">button</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">ng-template</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> #content</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  &#x3C;</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-hover-card</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    The React Framework - created and maintained by @vercel.</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  &#x3C;/</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">z-hover-card</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">&#x3C;/</span><span style=\"--shiki-dark:#85E89D;--shiki-light:#22863A\">ng-template</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">></span></span></code></pre>",
  "code": "<button [zHoverCard]=\"content\">\n  Hover Here\n</button>\n\n<ng-template #content>\n  <z-hover-card>\n    The React Framework - created and maintained by @vercel.\n  </z-hover-card>\n</ng-template>",
  "language": "angular-html",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false
};
