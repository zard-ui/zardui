---
title: MCP Server
description: Connect your AI assistant to the ZardUI registry — browse, read and install components without leaving the editor.
---

# MCP Server

Connect your AI assistant to the ZardUI registry — browse, read and install components without leaving the editor.

The `zard-mcp` server implements the [Model Context Protocol](https://modelcontextprotocol.io) , the open standard that lets AI assistants talk to external tools. Once connected, your assistant reads the ZardUI registry directly instead of guessing an API from memory.

It exposes nine tools to list, search, read and install components and blocks — always against the same registry the CLI uses, so the code your assistant writes matches the version you actually install.

#### Why connect your assistant?

Without the MCP server, an assistant writes ZardUI code from whatever it memorized. With it, the assistant reads the **real source, API and demos** of every component before writing a single line.

Discover

List every component and block in the registry, or search them by name.

Read

Fetch the full source code, the API reference and the demos of any component.

Resolve

Walk the complete dependency tree — npm packages plus internal registry dependencies.

Install

Run the ZardUI CLI in your project to add a component without leaving the conversation.

## Installation

There is nothing to install globally. Every client below runs the server on demand with `npx` , so you always get the latest published version.

#### Requirements

Node.js 20 or newer, and an MCP-capable client. The `install-component` tool also requires the ZardUI CLI to be initialized in the target project.

### Claude Code

Register the server with a single command:

Terminal

```
claude mcp add zard-ui -- npx -y zard-mcp
```

Prefer to commit the configuration with your project? Create a `.mcp.json` file at the repository root instead — everyone on the team gets the server automatically.

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

### Claude Desktop

Open **Settings → Developer → Edit Config** and add the server to `claude_desktop_config.json` .

claude_desktop_config.json

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

### Cursor

Add the server to `.cursor/mcp.json` for a single project, or to `~/.cursor/mcp.json` to enable it everywhere.

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

### VS Code

GitHub Copilot reads MCP servers from `.vscode/mcp.json` . Note the `servers` key and the explicit transport type.

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

### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json` and add the server under `mcpServers` .

mcp_config.json

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

### Verify the connection

Restart your client — MCP servers are only loaded at startup. In Claude Code you can confirm the server is reachable with:

Terminal

```
claude mcp list
```

In the other clients, open the MCP panel and check that `zard-ui` lists nine tools.

## Tools

The server exposes nine tools. You never call them by hand — describe what you want and the assistant picks the right ones.

| Tool | Parameters | Description |
| --- | --- | --- |
| `list-components` | — | Lists every component in the registry with its type, file count and dependencies. |
| `search-components` | query | Searches components by name using fuzzy matching. |
| `get-component` | name | Returns the complete source code of a component and its dependencies. |
| `get-component-docs` | name | Returns the overview and the API reference of a component. |
| `get-component-examples` | name | Returns the demo code used on the documentation site. |
| `get-dependencies` | name | Resolves the full dependency tree: npm packages plus internal registry dependencies. |
| `install-component` | name, cwd? | Installs a component into the current project through the ZardUI CLI. |
| `list-blocks` | — | Lists every available block — pre-built compositions such as login or dashboard screens. |
| `get-block` | id | Returns the complete source code of a block. |

Read operations hit the public registry at `https://zardui.com/r` and are cached for five minutes. `install-component` is the only tool that writes to your project — it shells out to `npx zard-cli add <name> --yes` .

## Usage

Talk to your assistant in plain language. It chains the tools on its own — searching, reading the API, then writing or installing the code.

“Which ZardUI components can I use to build a data table with pagination?”

“Show me the API of the ZardUI dialog component before we use it.”

“Add a ZardUI button with a loading state to my signup form.”

“Install the ZardUI carousel in this project and show me a basic example.”

### A typical flow

1

Discovery

The assistant calls search-components or list-components to find what matches your request.

2

Reading

It calls get-component-docs and get-component-examples to learn the real inputs, outputs and usage.

3

Dependencies

get-dependencies reveals everything the component needs before anything is written to disk.

4

Installation

install-component runs the CLI in your project, then the assistant writes the integration code.

## Configuration

The server works with zero configuration. A single environment variable lets you point it somewhere else.

| Variable | Description | Default |
| --- | --- | --- |
| `ZARD_REGISTRY_URL` | Base URL of the registry the server reads from. Point it to a private registry or to a local one during development. | `https://zardui.com/r` |

Declare it in the `env` block of your client configuration:

.mcp.json

```
{
  "mcpServers": {
    "zard-ui": {
      "command": "npx",
      "args": ["-y", "zard-mcp"],
      "env": {
        "ZARD_REGISTRY_URL": "https://registry.example.com/r"
      }
    }
  }
}
```

## Troubleshooting

Most issues come from the client not reloading its configuration, or from the CLI not being initialized in the target project.

The tools do not show up in the assistant

MCP servers are started when the client boots. Fully restart Claude Code, Claude Desktop, Cursor, VS Code or Windsurf after editing the configuration file.

The server fails to start

zard-mcp requires Node.js 20 or newer. Check your version with node -v and make sure npx can reach the npm registry from your network.

Registry requests time out

Every request to the registry has a 10 second timeout. Behind a corporate proxy, expose it through HTTPS_PROXY or point ZARD_REGISTRY_URL to an internal mirror.

install-component fails

The tool runs the ZardUI CLI, which needs a components.json file. Run npx zard-cli init in the project first, and pass the cwd parameter if the assistant is working outside the project root.

A component looks outdated

The registry response is cached in memory for five minutes. Restart the client to force a fresh fetch.
