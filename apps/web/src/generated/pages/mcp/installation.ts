import type { CodeBlockData, CodeTabData } from '@highlight/types';

export const TABS_0: CodeTabData = {
  "tabs": [
    {
      "label": "Claude Code",
      "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">claude</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> mcp</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> add</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-ui</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> npx</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> -y</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-mcp</span></span></code></pre>",
      "code": "claude mcp add zard-ui -- npx -y zard-mcp",
      "language": "bash"
    },
    {
      "label": "Codex CLI",
      "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">codex</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> mcp</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> add</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-ui</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> --</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> npx</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> -y</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-mcp</span></span></code></pre>",
      "code": "codex mcp add zard-ui -- npx -y zard-mcp",
      "language": "bash"
    },
    {
      "label": "Gemini CLI",
      "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#B392F0;--shiki-light:#6F42C1\">gemini</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> mcp</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> add</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-ui</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> npx</span><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\"> -y</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\"> zard-mcp</span></span></code></pre>",
      "code": "gemini mcp add zard-ui npx -y zard-mcp",
      "language": "bash"
    }
  ]
};

export const BLOCK_1: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">{</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">  \"mcpServers\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">    \"zard-ui\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">      \"command\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"npx\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">      \"args\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: [</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"-y\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">, </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"zard-mcp\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    }</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  }</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">}</span></span></code></pre>",
  "code": "{\n  \"mcpServers\": {\n    \"zard-ui\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"zard-mcp\"]\n    }\n  }\n}",
  "language": "json",
  "title": ".mcp.json",
  "showLineNumbers": true,
  "copyButton": true,
  "expandable": false
};

export const BLOCK_2: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">{</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">  \"mcpServers\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">    \"zard-ui\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">      \"command\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"npx\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">      \"args\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: [</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"-y\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">, </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"zard-mcp\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    }</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  }</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">}</span></span></code></pre>",
  "code": "{\n  \"mcpServers\": {\n    \"zard-ui\": {\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"zard-mcp\"]\n    }\n  }\n}",
  "language": "json",
  "title": ".cursor/mcp.json",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const BLOCK_3: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">{</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">  \"servers\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">    \"zard-ui\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: {</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">      \"type\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"stdio\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">      \"command\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"npx\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#79B8FF;--shiki-light:#005CC5\">      \"args\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">: [</span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"-y\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">, </span><span style=\"--shiki-dark:#9ECBFF;--shiki-light:#032F62\">\"zard-mcp\"</span><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">    }</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">  }</span></span>\n<span class=\"line\"><span style=\"--shiki-dark:#E1E4E8;--shiki-light:#24292E\">}</span></span></code></pre>",
  "code": "{\n  \"servers\": {\n    \"zard-ui\": {\n      \"type\": \"stdio\",\n      \"command\": \"npx\",\n      \"args\": [\"-y\", \"zard-mcp\"]\n    }\n  }\n}",
  "language": "json",
  "title": ".vscode/mcp.json",
  "showLineNumbers": false,
  "copyButton": true,
  "expandable": false
};

export const BLOCK_4: CodeBlockData = {
  "html": "<pre class=\"shiki shiki-themes github-dark github-light\" style=\"--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff\" tabindex=\"0\"><code><span class=\"line\"><span>Add a Zard UI dialog to my settings page, with a destructive confirm button.</span></span></code></pre>",
  "code": "Add a Zard UI dialog to my settings page, with a destructive confirm button.",
  "language": "text",
  "title": "Prompt",
  "showLineNumbers": false,
  "copyButton": false,
  "expandable": false
};

