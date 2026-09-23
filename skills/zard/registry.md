# Registry

Where the CLI reads components from. Three published files, three JSON Schemas, one optional configuration key.

Default base URL: `https://zardui.com/r`.

---

## The three files

| File               | What it is                                                                        |
| ------------------ | --------------------------------------------------------------------------------- |
| `/r/registry.json` | The index. Every item, with its dependencies and file names — **not** its source. |
| `/r/<name>.json`   | One item, with the contents of each file.                                         |
| `/r/icons.json`    | The icon catalogue: supported families and the translation table between them.    |

The index is fetched on every command, so it deliberately stays small. Source code only travels in the item files.

Schemas: `https://zardui.com/schema/registry.json`, `https://zardui.com/schema/registry-item.json`, `https://zardui.com/schema/icons.json`.

---

## `schemaVersion`

Both the index and the icon catalogue carry a `schemaVersion` integer. It describes **the shape of the file**, not the version of the library — that is `version`, and it is informational.

It rises when a change breaks readers: a field removed, a meaning changed. A new optional field does not raise it. A client that reads up to a lower version must refuse the registry and say so, rather than misread it. Absent means `1`, from before the field existed.

---

## Index

```json
{
  "$schema": "https://zardui.com/schema/registry.json",
  "schemaVersion": 1,
  "name": "@zard",
  "homepage": "https://zardui.com",
  "version": "1.0.0",
  "items": [
    {
      "name": "button",
      "type": "registry:component",
      "dependencies": ["class-variance-authority", "@ng-icons/core", "@ng-icons/lucide"],
      "registryDependencies": ["utils"],
      "icons": { "family": "lucide", "symbols": ["lucideLoaderCircle"], "tokens": ["loader-circle"] },
      "files": ["button.component.ts", "button.variants.ts", "index.ts"]
    }
  ]
}
```

Item fields: `name`, `type` and `files` are required. `basePath` sets the directory when it differs from the item name. `dependencies` / `devDependencies` are npm packages; `registryDependencies` are other items of the same registry, installed alongside.

---

## Item

```json
{
  "$schema": "https://zardui.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:component",
  "files": [{ "name": "button.component.ts", "content": "import { ... } from '@angular/core';\n..." }]
}
```

Same shape as the index entry, except `files` carries objects with `name` and `content`. Paths are relative to the item's directory in the target project.

The item's `icons` adds a `demos` object — the icons that appear only in the documentation examples. They install nothing, which is why the index leaves them out.

---

## Icon catalogue

```json
{
  "$schema": "https://zardui.com/schema/icons.json",
  "schemaVersion": 1,
  "families": {
    "lucide": { "value": "lucide", "label": "Lucide", "package": "@ng-icons/lucide", "prefix": "lucide" }
  },
  "icons": {
    "check": { "lucide": "lucideCheck" },
    "chevron-down": { "lucide": "lucideChevronDown" }
  }
}
```

`families` is keyed by the value that goes in `components.json` under `icons`. `icons` is the translation table: one row per icon, keyed by what it means, holding the symbol each family exports for it.

The catalogue is read at run time, not compiled into the CLI — that is what lets a family added to the registry work with a CLI that is already installed. It is also why `icons` in `components.json` is a plain string rather than a closed enum: an old CLI must not reject a new family.

A row with no entry for a family means that family has no equivalent. Leave the symbol alone and say so; do not substitute a lookalike.

---

## Pointing at your own registry

Two ways, and they answer different questions.

**`registryUrl` in `components.json`** — for a project that installs from a private registry:

```json
{
  "registryUrl": "https://registry.acme.dev/r"
}
```

**`ZARD_REGISTRY_URL` in the environment** — overrides the default when no `registryUrl` is set, and is how the [MCP server](./mcp.md) is pointed elsewhere.

The URL is validated when the configuration is read; an invalid one fails the command rather than falling back silently.

---

## Publishing your own

Serve the three files at the same base URL, with the same shapes. Minimum:

1. `registry.json` with `name`, `homepage`, `version`, `items`, and a `schemaVersion` you keep honest.
2. `<name>.json` per item, with the file contents.
3. `icons.json` if your items draw icons — at least the families they use and the rows for their symbols.

Validate against the published schemas before serving. A registry that lists an item the item file does not describe fails at install time, on the user's machine.
