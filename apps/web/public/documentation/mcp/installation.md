```bash tab="Claude Code" copyButton
claude mcp add zard-ui -- npx -y zard-mcp
```

```bash tab="Codex CLI" copyButton
codex mcp add zard-ui -- npx -y zard-mcp
```

```bash tab="Gemini CLI" copyButton
gemini mcp add zard-ui npx -y zard-mcp
```

```json title=".mcp.json" showLineNumbers copyButton
{
  "mcpServers": {
    "zard-ui": {
      "command": "npx",
      "args": ["-y", "zard-mcp"]
    }
  }
}
```

```json title=".cursor/mcp.json" copyButton
{
  "mcpServers": {
    "zard-ui": {
      "command": "npx",
      "args": ["-y", "zard-mcp"]
    }
  }
}
```

```json title=".vscode/mcp.json" copyButton
{
  "servers": {
    "zard-ui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "zard-mcp"]
    }
  }
}
```

```text title="Prompt"
Add a Zard UI dialog to my settings page, with a destructive confirm button.
```
