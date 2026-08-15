---
title: MCP Server
description: Give your AI assistant the real zard/ui components: the source code, the docs and the CLI, instead of what it remembers about them.
---

# MCP Server

Give your AI assistant the real zard/ui components: the source code, the docs and the CLI, instead of what it remembers about them.

## What it is

An assistant asked for a zard/ui component has to work from whatever it happened to memorise about the library — which is how you end up with inputs that do not exist and imports that never resolve. The MCP server replaces the guess with the source: it gives the assistant the same [registry](/docs/registry) the CLI installs from, plus the documentation page of each component.

In practice that means it can list what exists, search by name, read the actual code of a component, resolve what that component depends on, and install it for you — with the same result as running the [CLI](/docs/cli) yourself, because it is the CLI doing the work.

It works with any client that speaks the Model Context Protocol — Claude Code, Cursor, VS Code, and the others — and it is versioned separately from the component library, so updating one does not force the other.

## Installation

The server is published as `zard-mcp` and speaks over stdio, so there is nothing to run or keep alive: your client starts it when it needs it. If your tool has a command for adding MCP servers, that is the shortest way in.

```
claude mcp add zard-ui -- npx -y zard-mcp
```

### By configuration file

Clients that read a project file use the same shape. Committing it to the repository is what makes the server available to everyone working on the project, rather than to whoever set it up.

.mcp.json

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

Cursor reads its own file:

.cursor/mcp.json

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

VS Code uses a different key and asks for the transport explicitly:

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

### Check that it works

Ask for something that only the registry can answer. If the assistant comes back with real component code instead of an invented API, the server is connected.

Prompt

```
Add a Zard UI dialog to my settings page, with a destructive confirm button.
```

## Tools

Nine tools, in two groups: eight that read the registry, and one that writes to your project. The assistant picks them on its own — you describe what you want, not which tool to call.

| Tool | Input | Description |
| --- | --- | --- |
| `list-components` | — | Every available component, with its metadata. |
| `search-components` | `query` | Find components by name. |
| `get-component` | `name` | The full source code of a component. |
| `get-component-docs` | `name` | The documentation page: installation, usage, examples and API reference. |
| `get-component-examples` | `name` | The usage examples, with the code of each one. |
| `get-dependencies` | `name` | The dependency tree of a component — npm packages and other registry items. |
| `install-component` | `name, cwd?` | Installs a component into the project, via CLI. |
| `list-blocks` | — | Every available block — pre-built compositions. |
| `get-block` | `id` | The full source code of a block. |

### Reading versus writing

Everything except `install-component` only fetches published files. That one runs the CLI in a working directory and writes components into your project, so it is the one worth approving deliberately if your client asks before running tools.

It never builds a shell command: the component name is validated and passed as a discrete argument, so nothing in it can start a second command. The working directory must exist, because it decides which `zard-cli` runs — the copy installed in the project is preferred over downloading one.

### Where the answers come from

Source code comes from the registry, the same files the CLI installs. Documentation and examples come from the markdown of each component's page — one document with installation, usage, examples and the API reference, which is why an assistant using this server writes code against the real API instead of guessing at one.

## Configuration

Two environment variables, both optional, for teams serving their own components.

| Variable | Default | Description |
| --- | --- | --- |
| `ZARD_REGISTRY_URL` | `https://zardui.com/r` | Where component source and metadata are read from. See the [registry page](/docs/registry) for the format a custom one has to publish. |
| `ZARD_DOCS_URL` | `https://zardui.com` | The site the documentation pages are read from, as `/docs/components/<name>.md` . Separate from the registry because a custom registry serves files, not pages. |

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
