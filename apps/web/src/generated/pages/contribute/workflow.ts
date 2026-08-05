import type { CodeBlockData } from '@highlight/types';

export const BLOCK_0: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">git</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> checkout</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> master</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">git</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> pull</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> origin</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> master</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">git</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> checkout</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> -b</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> feat/#123-button-loading</span></span></code></pre>",
  "code": "git checkout master\ngit pull origin master\ngit checkout -b feat/#123-button-loading",
  "language": "bash",
  "title": "Start from an issue",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const BLOCK_1: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> nx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> run-many</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --target=lint</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --p=zard,blocks</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --parallel</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npm</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> test</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npm</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> run</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> build</span></span></code></pre>",
  "code": "npx nx run-many --target=lint --p=zard,blocks --parallel\nnpm test\nnpm run build",
  "language": "bash",
  "title": "Before you push",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const BLOCK_2: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">git</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> add</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> .</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">git</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> commit</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> -m</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> \"✨ feat(button): add loading state\"</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># Valid</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># ✨ feat(button): add loading state</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># 🐛 fix(input): resolve focus bug on Safari</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># 📝 docs(contribute): document the block generator</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># ✨ feat(button)!: redesign the button API   &#x3C;- breaking change, major bump</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># Rejected by commitlint</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># feat(button): add loading state             &#x3C;- no emoji</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># ✨ feat(button): fix                        &#x3C;- subject shorter than 10 chars</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># ✨ feat(button): add loading state.          &#x3C;- trailing period</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># ✨ Feat(button): add loading state          &#x3C;- type must be lower-case</span></span></code></pre>",
  "code": "git add .\ngit commit -m \"✨ feat(button): add loading state\"\n\n# Valid\n# ✨ feat(button): add loading state\n# 🐛 fix(input): resolve focus bug on Safari\n# 📝 docs(contribute): document the block generator\n# ✨ feat(button)!: redesign the button API   <- breaking change, major bump\n\n# Rejected by commitlint\n# feat(button): add loading state             <- no emoji\n# ✨ feat(button): fix                        <- subject shorter than 10 chars\n# ✨ feat(button): add loading state.          <- trailing period\n# ✨ Feat(button): add loading state          <- type must be lower-case",
  "language": "bash",
  "title": "Commit — the emoji is mandatory",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

