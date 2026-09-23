# zard-mcp

An MCP server that gives an assistant the real components — the source the CLI installs and the documentation page of each one — instead of whatever it remembers about the library.

Published as `zard-mcp`, speaks over stdio. There is nothing to run or keep alive: the client starts it when it needs it. Versioned separately from the component library.

---

## Connecting

```bash
claude mcp add zard-ui -- npx -y zard-mcp
codex mcp add zard-ui -- npx -y zard-mcp
gemini mcp add zard-ui npx -y zard-mcp
```

By configuration file:

```json
// .mcp.json — committed, so it works for everyone on the project
{
  "mcpServers": {
    "zard-ui": { "command": "npx", "args": ["-y", "zard-mcp"] }
  }
}
```

```json
// .cursor/mcp.json — same shape
{
  "mcpServers": {
    "zard-ui": { "command": "npx", "args": ["-y", "zard-mcp"] }
  }
}
```

```json
// .vscode/mcp.json — different key, transport stated explicitly
{
  "servers": {
    "zard-ui": { "type": "stdio", "command": "npx", "args": ["-y", "zard-mcp"] }
  }
}
```

---

## Tools

Nine, in two groups: eight that read, one that writes.

| Tool                     | Input          | Returns                                                               |
| ------------------------ | -------------- | --------------------------------------------------------------------- |
| `list-components`        | —              | Every available component, with its metadata.                         |
| `search-components`      | `query`        | Components matching the name, fuzzily.                                |
| `get-component`          | `name`         | The full source code of a component.                                  |
| `get-component-docs`     | `name`         | The documentation page: installation, usage, examples, API reference. |
| `get-component-examples` | `name`         | The usage examples, with the code of each.                            |
| `get-dependencies`       | `name`         | The dependency tree — npm packages and other registry items.          |
| `install-component`      | `name`, `cwd?` | Installs a component into the project, via the CLI.                   |
| `list-blocks`            | —              | Every available block — pre-built compositions.                       |
| `get-block`              | `id`           | The full source code of a block (`login-01`, `signup-01`, …).         |

Everything except `install-component` only fetches published files. That one runs the CLI in a working directory and writes into the project, so it is the one worth approving deliberately.

It never builds a shell command: the name is validated and passed as a discrete argument, so nothing in it can start a second one. The working directory must exist, because it decides which `zard-cli` runs — a copy installed in the project is preferred over downloading one.

Source comes from the registry, the same files the CLI installs. Documentation and examples come from the Markdown of each component's page.

---

## Configuration

Two environment variables, both optional, for teams serving their own components.

| Variable            | Default                | Purpose                                                                              |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------------ |
| `ZARD_REGISTRY_URL` | `https://zardui.com/r` | Where component source and metadata are read from. See [registry.md](./registry.md). |
| `ZARD_DOCS_URL`     | `https://zardui.com`   | Where documentation pages are read from, as `/docs/components/<name>.md`.            |

They are separate because a custom registry serves files, not pages.

```json
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

---

## When to use it

`get-component-docs` before writing code against a component you have not read this session. That is the whole point of the server: an invented input costs a debugging round-trip, and the real API is one call away.

The server does not read `components.json` — there is no project-context tool. Read that file yourself; see [SKILL.md](./SKILL.md).
