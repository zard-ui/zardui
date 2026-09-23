---
title: MCP Server
description: Give your AI assistant the real zard/ui components: the source code, the docs and the CLI, instead of what it remembers about them.
---

# MCP Server

Give your AI assistant the real zard/ui components: the source code, the docs and the CLI, instead of what it remembers about them.

## What it is

An assistant asked for a zard/ui component works from whatever it memorised about the library, which is how you end up with inputs that do not exist and imports that never resolve. The server gives it the same [registry](/docs/registry) the CLI installs from and each component's documentation page, and installs through the [CLI](/docs/cli) itself.

It works with any client that speaks the Model Context Protocol, and is versioned apart from the library.

## Installation

The server is published as `zard-mcp` and runs over stdio: your client starts it on demand, and it needs Node 20 or newer. Cursor and VS Code install it in one click.

[Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=zard-ui&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsInphcmQtbWNwIl19) · [Add to VS Code](https://vscode.dev/redirect/mcp/install?name=zard-ui&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22zard-mcp%22%5D%7D)

### From the command line

```
claude mcp add zard-ui -- npx -y zard-mcp
codex mcp add zard-ui -- npx -y zard-mcp
gemini mcp add zard-ui npx -y zard-mcp
```

### By configuration file

Commit the project file and everyone on the repository gets the server.

- Claude Code `.mcp.json`
- Cursor `.cursor/mcp.json`
- VS Code `.vscode/mcp.json`
- Windsurf `~/.codeium/windsurf/mcp_config.json`
- Zed `settings.json`
- Codex `~/.codex/config.toml`

.mcp.json · .cursor/mcp.json · Windsurf

```
{
  "mcpServers": {
    "zard-ui": {
      "command": "npx",
      "args": ["-y", "zard-mcp"]
    }
  }
}
```

.vscode/mcp.json

```
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

Zed settings.json

```
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

~/.codex/config.toml

```
[mcp_servers.zard-ui]
command = "npx"
args = ["-y", "zard-mcp"]
```

### Check that it works

Restart the client and look for `zard-ui` with ten tools. In Claude Code or Codex run `/mcp` to list servers; in Cursor and Windsurf open Settings → MCP; in VS Code press Start above the server in `mcp.json` to connect it.

## Usage

Describe what you want, not which tool to call. Naming zard/ui in the prompt keeps the assistant from reaching for another library.

- Which zard/ui components could I use for a settings page?
- Add a zard/ui dialog to my settings page, with a destructive confirm button. Read its docs first.
- Show me the zard/ui login blocks, then add login-02 to /login with the components it needs.
- What does installing the zard/ui date-picker bring into my project, npm packages included?

## Tools

Ten tools, in two groups: nine that read, and one that writes to your project. A wrong name comes back with a suggestion, so asking for `toast` points the assistant to `sonner` without a second search.

| Tool | Input | Description |
| --- | --- | --- |
| `list-components` | — | Every component, with a one-line description and category. |
| `search-components` | `query, limit?` | Find components by name, purpose or the name other libraries use ("modal", "toast"). |
| `get-component` | `name` | The full source code of a component. |
| `get-component-docs` | `name` | The documentation page: installation, usage, examples and API reference. |
| `get-component-examples` | `name` | The usage examples, with the code of each one. |
| `get-dependencies` | `name` | Everything an install brings: registry components in install order, npm packages, and the tree. |
| `get-docs` | `topic?, section?` | A guide on theming, dark mode, forms or setup, whole or one section. Without a topic, the list of guides. |
| `install-component` | `name, cwd?, overwrite?` | Installs a component into the project, via CLI. Existing files are kept unless overwrite. |
| `list-blocks` | `category?` | Every available block, optionally filtered by category. |
| `get-block` | `id` | The full source code of a block. |

### Where the answers come from

Source code comes from the registry, the same files the CLI installs. Documentation and examples come from the markdown of each component's page, API reference included.

## Configuration

Two environment variables, both optional, for teams serving their own components.

| Variable | Default | Description |
| --- | --- | --- |
| `ZARD_REGISTRY_URL` | `https://zardui.com/r` | Where component source and metadata are read from. See the [registry page](/docs/registry) for the format a custom one has to publish. |
| `ZARD_DOCS_URL` | `https://zardui.com` | The site whose component pages are read, as markdown. Separate from the registry because a custom registry serves files, not pages. |

.mcp.json

```
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

## Security

Nine tools only read published files. Only `install-component` writes to your project, so keep your client asking before it runs. It never builds a shell command: names are validated and passed as discrete arguments, and the project's own `zard-cli` is preferred over downloading one.

Whatever the registry serves ends up in the model's context, so trust a custom registry as you would a dependency. Teams can pin the server to a version:

.mcp.json

```
{
  "mcpServers": {
    "zard-ui": {
      "command": "npx",
      "args": ["-y", "zard-mcp@1.0.0"]
    }
  }
}
```

## Troubleshooting

**The server shows no tools, or fails to start.** Check that `node --version` is 20 or newer, then delete the npx cache in `~/.npm/_npx` and restart the client. On Windows, some clients need the command as `cmd /c npx -y zard-mcp` instead.

**The assistant invents an API instead of using the server.** Name zard/ui in the prompt, or ask it to read the component docs first. If it still guesses, check that the server shows as connected.

**Installing fails with "Configuration not found".** The project has not been set up yet. Run `npx zard-cli init` at its root, then try again.

**Components land in the wrong project.** The server process does not always start in your project, so the assistant must pass its root as `cwd` for the install. Ask it to install into the absolute path.
