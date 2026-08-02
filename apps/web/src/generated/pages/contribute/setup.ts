import type { CodeBlockData } from '@highlight/types';

export const BLOCK_0: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">node</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --version</span><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\">   # must be >= 20.19.0</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npm</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --version</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">git</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --version</span></span></code></pre>",
  "code": "node --version   # must be >= 20.19.0\nnpm --version\ngit --version",
  "language": "bash",
  "title": "Check your toolchain",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const BLOCK_1: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">git</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> clone</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> https://github.com/</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">&#x3C;</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">your-usernam</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">e</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">></span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">/zardui.git</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">cd</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zardui</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npm</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> install</span></span></code></pre>",
  "code": "git clone https://github.com/<your-username>/zardui.git\ncd zardui\nnpm install",
  "language": "bash",
  "title": "Fork, clone and install",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const BLOCK_2: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npm</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> start</span></span></code></pre>",
  "code": "npm start",
  "language": "bash",
  "title": "Start the docs site",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const BLOCK_3: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">PORT</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">4222</span></span></code></pre>",
  "code": "PORT=4222",
  "language": "bash",
  "title": ".env",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const BLOCK_4: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># Port already taken — pick another one</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">PORT</span><span style=\"--shiki-dark:#F97583;--shiki-light:#D73A49\">=</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">4300</span><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\"> npm</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> start</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># Stale Nx cache or an unexplained build failure</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> nx</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> reset</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># Broken dependency tree</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">rm</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> -rf</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> node_modules</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> package-lock.json</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npm</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> install</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-dark:#6A737D;--shiki-light:#6A737D\"># Code blocks look empty or outdated</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">npm</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> run</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> generate:highlight</span></span></code></pre>",
  "code": "# Port already taken — pick another one\nPORT=4300 npm start\n\n# Stale Nx cache or an unexplained build failure\nnpx nx reset\n\n# Broken dependency tree\nrm -rf node_modules package-lock.json\nnpm install\n\n# Code blocks look empty or outdated\nnpm run generate:highlight",
  "language": "bash",
  "title": "Troubleshooting",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

