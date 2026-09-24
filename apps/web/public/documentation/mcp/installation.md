```bash tab="Claude Code" copyButton
claude mcp add zard-ui -- npx -y zard-mcp
```

```bash tab="Codex CLI" copyButton
codex mcp add zard-ui -- npx -y zard-mcp
```

```bash tab="Gemini CLI" copyButton
gemini mcp add zard-ui npx -y zard-mcp
```

<!-- config files -->

```json tab=".mcp.json" copyButton
{
  "mcpServers": {
    "zard-ui": {
      "command": "npx",
      "args": ["-y", "zard-mcp"]
    }
  }
}
```

```json tab="Cursor" copyButton
{
  "mcpServers": {
    "zard-ui": {
      "command": "npx",
      "args": ["-y", "zard-mcp"]
    }
  }
}
```

```json tab="VS Code" copyButton
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

```json tab="Windsurf" copyButton
{
  "mcpServers": {
    "zard-ui": {
      "command": "npx",
      "args": ["-y", "zard-mcp"]
    }
  }
}
```

```json tab="Zed" copyButton
{
  "context_servers": {
    "zard-ui": {
      "source": "custom",
      "command": "npx",
      "args": ["-y", "zard-mcp"]
    }
  }
}
```

```toml tab="Codex" copyButton
[mcp_servers.zard-ui]
command = "npx"
args = ["-y", "zard-mcp"]
```

```json title=".mcp.json" copyButton
{
  "mcpServers": {
    "zard-ui": {
      "command": "npx",
      "args": ["-y", "zard-mcp@1.0.0"]
    }
  }
}
```
