# zard-mcp

The [Model Context Protocol](https://modelcontextprotocol.io) server for [zard/ui](https://www.zardui.com). It gives your AI assistant the real zard/ui components (the source code, the documentation and the CLI) instead of what it remembers about them.

<a alt="zard/ui" href="https://www.zardui.com/docs/mcp" target="_blank" rel="noreferrer">
  <img align="center" width="100%" src="https://www.zardui.com/images/github_banner.png" alt="zard/ui"/>
</a>

<p align="center">
  <a href="https://www.npmjs.com/package/zard-mcp"><img src="https://img.shields.io/npm/v/zard-mcp?label=zard-mcp" alt="npm version"/></a>
  <a href="https://github.com/zard-ui/zardui"><img src="https://img.shields.io/github/stars/zard-ui/zardui" alt="GitHub stars"/></a>
  <a href="https://github.com/zard-ui/zardui/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/zard-mcp" alt="license"/></a>
</p>

## Installation

The server runs over stdio: your client starts it on demand. It needs Node 20 or newer.

**One click:** [Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=zard-ui&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsInphcmQtbWNwIl19) · [Add to VS Code](https://vscode.dev/redirect/mcp/install?name=zard-ui&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22zard-mcp%22%5D%7D)

**From the command line:**

```bash
claude mcp add zard-ui -- npx -y zard-mcp
codex mcp add zard-ui -- npx -y zard-mcp
gemini mcp add zard-ui npx -y zard-mcp
```

**By configuration file.** Claude Code (`.mcp.json`), Cursor (`.cursor/mcp.json`) and Windsurf (`~/.codeium/windsurf/mcp_config.json`):

```json
{
  "mcpServers": {
    "zard-ui": {
      "command": "npx",
      "args": ["-y", "zard-mcp"]
    }
  }
}
```

VS Code (`.vscode/mcp.json`):

```json
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

Restart the client and look for `zard-ui` with ten tools. The [MCP guide](https://www.zardui.com/docs/mcp) covers Zed, Codex and how to check the connection in each client.

## Usage

Describe what you want, not which tool to call. Naming zard/ui in the prompt keeps the assistant from reaching for another library.

- _Which zard/ui components could I use for a settings page?_
- _Add a zard/ui dialog to my settings page, with a destructive confirm button. Read its docs first._
- _Show me the zard/ui login blocks, then add login-02 to /login with the components it needs._

## Tools

Nine tools read, and one writes to your project. A wrong name comes back with a suggestion, so asking for `toast` points the assistant to `sonner`.

| Tool                     | Input                    | Description                                                                                        |
| ------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------- |
| `list-components`        | —                        | Every component, with a one-line description and category                                          |
| `search-components`      | `query, limit?`          | Find components by name, purpose or the name other libraries use ("modal", "toast")                |
| `get-component`          | `name`                   | The full source code of a component                                                                |
| `get-component-docs`     | `name`                   | The documentation page: installation, usage, examples and API reference                            |
| `get-component-examples` | `name`                   | The usage examples, with the code of each one                                                      |
| `get-dependencies`       | `name`                   | Everything an install brings: registry components, npm packages and the tree                       |
| `get-docs`               | `topic?, section?`       | A guide on theming, dark mode, forms or setup                                                      |
| `install-component`      | `name, cwd?, overwrite?` | Installs a component into the project through [`zard-cli`](https://www.npmjs.com/package/zard-cli) |
| `list-blocks`            | `category?`              | Every available block, optionally filtered by category                                             |
| `get-block`              | `id`                     | The full source code of a block                                                                    |

## Configuration

Two optional environment variables, for teams serving their own components:

| Variable            | Default                | Description                                          |
| ------------------- | ---------------------- | ---------------------------------------------------- |
| `ZARD_REGISTRY_URL` | `https://zardui.com/r` | Where component source and metadata are read from    |
| `ZARD_DOCS_URL`     | `https://zardui.com`   | The site whose component pages are read, as markdown |

## Security

Only `install-component` writes to your project, so keep your client asking before it runs. It never builds a shell command: names are validated and passed as discrete arguments, and the project's own `zard-cli` is preferred over downloading one. Whatever the registry serves ends up in the model's context, so trust a custom registry as you would a dependency.

## Documentation

- [MCP guide](https://www.zardui.com/docs/mcp): every client, configuration and troubleshooting
- [Components](https://www.zardui.com/docs/components)
- [CLI](https://www.zardui.com/docs/cli)

## License

[MIT](https://github.com/zard-ui/zardui/blob/master/LICENSE.md)
