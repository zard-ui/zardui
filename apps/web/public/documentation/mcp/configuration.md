```json title=".mcp.json" showLineNumbers copyButton
{
  "mcpServers": {
    "zard-ui": {
      "command": "npx",
      "args": ["-y", "zard-mcp"],
      "env": {
        "ZARD_REGISTRY_URL": "https://registry.acme.dev/r",
        "ZARD_DOCS_URL": "https://design.acme.dev"
      }
    }
  }
}
```
