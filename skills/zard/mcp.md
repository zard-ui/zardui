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

Sixteen, in three groups: eight that read the registry, six that build CLI commands without running them, and one that writes.

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

The command tools work offline and run nothing. Each returns a command that ends in `--no-interactive`, so it never stops at a prompt, and you run it yourself.

| Tool                  | Input                                                                 | Returns                                                                                                                                                                                               |
| --------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `get-design-options`  | —                                                                     | The styles, colors, fonts, icon libraries and radii `create` accepts.                                                                                                                                 |
| `get-create-command`  | `name`, `template`, `preset?` or `design?`, `packageManager?`, `rtl?` | The `create` command for a new app, and the preset code the design becomes.                                                                                                                           |
| `get-init-command`    | `type`, `project?`, `preset?` or `design?`, `baseColor?`              | The `init` command for an existing project.                                                                                                                                                           |
| `get-apply-command`   | `preset` or `design`, `only?`, `pointer?`                             | The `apply` command that changes the design of a project already set up. Installed components keep their look until re-added with `--overwrite`: run the line `apply` prints for that, with approval. |
| `get-add-command`     | `items`, `overwrite?`                                                 | The `add` command for several components or blocks at once.                                                                                                                                           |
| `get-audit-checklist` | —                                                                     | What to check after adding components or writing code with them, before calling the work done.                                                                                                        |

`preset` takes the code from zardui.com/create or the whole command the page gives. A `design` is rebuilt the same way the page does it, and the reply says which choices the design rules changed.

Everything except `install-component` only fetches published files or builds a command. That one runs the CLI in a working directory and writes into the project, so it is the one worth approving deliberately.

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
