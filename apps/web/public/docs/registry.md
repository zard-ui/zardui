---
title: Registry
description: The registry is how Zard UI ships components: a set of static JSON files that expose the full source code of every component, consumed by the CLI and the MCP server.
---

# Registry

The registry is how Zard UI ships components: a set of static JSON files that expose the full source code of every component, consumed by the CLI and the MCP server.

## What is the registry?

The registry is a set of static JSON files published at `https://zardui.com/r` . Every item carries the full source code of its files, so a client can download an item and write the files directly into a project.

That is the open code philosophy: the components you install are copied into your repository and you own them from that moment on. There is no Zard UI runtime dependency to keep in sync.

### Endpoints

- Index: `https://zardui.com/r/registry.json`
- Item: `https://zardui.com/r/<name>.json` — for example `https://zardui.com/r/button.json`
- Blocks index: `https://zardui.com/r/blocks-registry.json`
- Block: `https://zardui.com/r/blocks/<id>.json`

### Who consumes it

- The CLI `zard-cli` , which resolves items and writes their files into your project.
- The MCP server, which exposes components, their docs and their demos to AI assistants.
- Any other tool that can speak HTTP — the endpoints are public and require no authentication.

## How it works

The registry is not a service: it is the output of a build step that runs in this repository and is published together with the website. Four stages turn Angular source files into static JSON.

### Source

libs/zard/src/lib/shared/

Every component, service and utility lives in the monorepo as ordinary Angular source. Nothing in these files is registry-specific.

components/

core/

services/

utils/

### Manifest

packages/cli/src/core/registry/registry-data.ts

A single TypeScript array declares what ships. Each entry names the item, where it should land in the consumer project, and which files and dependencies it needs.

name

basePath

dependencies

devDependencies

registryDependencies

files

### Build

scripts/build-registry.cts

Running npm run build:registry reads each declared file from disk, inlines its full content and writes one JSON per item plus the index. When a component ships doc/overview.md, doc/api.md or demo files, they are folded into the docs and demos fields.

npm run build:registry

### Serve

apps/web/public/r/ → https://zardui.com/r

The generated files are plain static assets of this website. There is no API and no runtime: any HTTP client can read them.

registry.json

<name>.json

blocks/

### Caching and CORS

The two kinds of file change at different rates, so they are cached differently.

/r/*

public, max-age=31536000, immutable

An item file describes one published version of a component, so it never changes once written and is cached for a year.

/r/registry.json

public, max-age=3600, must-revalidate

The index is the only document that has to reflect new items and new versions, so it is cached for an hour and revalidated afterwards.

Both rules answer with `Access-Control-Allow-Origin: *` and `Content-Type: application/json; charset=utf-8` , so the registry can be read from a browser as easily as from a terminal.

## The index (registry.json)

`registry.json` lists every item the registry knows about. It is a summary: it carries the metadata needed to resolve an install, but never the source code, which only lives in the individual item files.

The excerpt below is the real index reduced to three items — `core` , `utils` and `button` . The published file contains every component of the library.

registry.json

```
{
  "$schema": "https://zardui.com/schema/registry.json",
  "schemaVersion": 1,
  "name": "@zard",
  "homepage": "https://zardui.com",
  "version": "1.0.0-beta.102",
  "items": [
    {
      "name": "core",
      "type": "registry:component",
      "files": [
        "directives/string-template-outlet/string-template-outlet.directive.ts",
        "directives/id.directive.ts",
        "provider/event-manager-plugins/zard-debounce-event-manager-plugin.ts",
        "provider/event-manager-plugins/zard-event-manager-plugin.ts",
        "provider/providezard.ts",
        "css/tailwind.css",
        "css/utilities.css",
        "index.ts"
      ],
      "icons": { "family": "lucide", "symbols": [], "tokens": [] }
    },
    {
      "name": "utils",
      "type": "registry:component",
      "basePath": "utils",
      "dependencies": ["tailwind-merge", "clsx"],
      "files": ["index.ts", "merge-classes.ts", "number.ts"],
      "icons": { "family": "lucide", "symbols": [], "tokens": [] }
    },
    {
      "name": "button",
      "type": "registry:component",
      "files": ["button.component.ts", "button.variants.ts", "index.ts"],
      "icons": { "family": "lucide", "symbols": ["lucideLoaderCircle"], "tokens": ["loader-circle"] }
    }
  ]
}
```

### Top-level fields

| Field | Type | Description |
| --- | --- | --- |
| `$schema` | `string` | Identifier of the registry format, always `https://zardui.com/schema/registry.json` . |
| `name` | `string` | Registry namespace — `@zard` . |
| `homepage` | `string` | `https://zardui.com` . |
| `schemaVersion` | `number` | The shape of the file — not the version of the package, which is the field below. It rises when a change breaks readers, so a client that only understands an older format can refuse the registry and say so instead of misreading it. A new optional field does not raise it. Absent means `1` , from before the field existed. |
| `version` | `string` | Version of the `zard-cli` package at the moment the registry was built. Informational — use `schemaVersion` to decide whether you can read it. |
| `items` | `array` | One summary per item, without the file contents. |

### Fields of an item summary

Each entry of `items` exposes `name` , `type` , `basePath` , `dependencies` , `devDependencies` , `registryDependencies` and `files` . Every field except `name` , `type` and `files` is optional and only emitted when the item declares it. In the index, `files` is only the list of file names — `string[]` — not the objects with content you find in an item file.

**Note:** the URL in `$schema` is only an identifier written by the build. There is no JSON Schema document published at that address today, so it does not give you editor validation or autocompletion.

## Item schema

Each item has its own file at `/r/<name>.json` . This is where the source code lives: every entry of `files` carries the complete content of one file. The example below is `button.json` with the contents truncated for readability.

button.json

```
{
  "name": "button",
  "type": "registry:component",
  "files": [
    {
      "name": "button.component.ts",
      "content": "import {\n  afterNextRender,\n  ChangeDetectionStrategy,\n  Component,\n..."
    },
    {
      "name": "button.variants.ts",
      "content": "import { cva, type VariantProps } from 'class-variance-authority';\n..."
    },
    {
      "name": "index.ts",
      "content": "export * from './button.component';\nexport * from './button.variants';\n"
    }
  ],
  "icons": {
    "family": "lucide",
    "symbols": ["lucideLoaderCircle"],
    "tokens": ["loader-circle"],
    "demos": {
      "symbols": ["lucideArchive", "lucideArrowLeft"],
      "tokens": ["archive", "arrow-left"]
    }
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Identifier of the item — what you pass to `zard-cli add` . |
| `type` | `string` | Always `registry:component` . |
| `basePath` | `string?` | Overrides the destination directory. |
| `files` | `{ name, content }[]` | Path of the file relative to the item directory, plus its full source code. |
| `dependencies` | `string[]?` | npm packages installed along with the item. |
| `devDependencies` | `string[]?` | npm dev dependencies of the item. |
| `registryDependencies` | `string[]?` | Other registry items this one requires. |
| `icons` | `{ family, symbols, tokens, demos }` | The icons the component draws and the set they are written in. `symbols` are the identifiers as the code writes them, `tokens` the same icons by the set-neutral key of `icons.json` , and `demos` the ones that only appear in the examples. Present on every item, with empty lists for a component that draws none. |

Documentation and examples are not in the item. They live in the page of each component, served as markdown at `/docs/components/<name>.md` — one document with installation, usage, examples and API reference, which is what the MCP server reads. Keeping them out of the item is also what makes installing one download the code and nothing else.

### Where the files land

The CLI resolves the destination directory from `basePath` and the aliases declared in your `components.json` :

- `basePath: 'core'` — or an item literally named `core` — resolves to `aliases.core` .
- `basePath: 'services'` resolves to `aliases.services` — this is how `dark-mode` is installed.
- `basePath: 'utils'` resolves to `aliases.utils` — this is how the `utils` item is installed.
- Anything else resolves to `aliases.components/<basePath ?? name>` .

The `-p, --path` flag overrides all of the above and resolves to `<cwd>/<path>/<basePath ?? name>` :

```
npx zard-cli add button --path src/app/ui
```

Whichever route is taken, the CLI checks that the resolved destination stays inside the project directory and refuses to write outside of it. Writing the files of an item is also transactional: if any file of an item fails to be written, every file already written for that same item is removed before the error is reported.

## Icon catalogue (icons.json)

`icons.json` declares the icon sets a registry supports and the table that translates between them. The CLI reads it at run time rather than relying on the copy it was built with, so a set added here works for the CLIs that are already installed.

icons.json

```
{
  "$schema": "https://zardui.com/schema/icons.json",
  "schemaVersion": 1,
  "families": {
    "lucide": {
      "value": "lucide",
      "label": "Lucide",
      "package": "@ng-icons/lucide",
      "prefix": "lucide"
    }
  },
  "icons": {
    "check": { "lucide": "lucideCheck" },
    "chevron-down": { "lucide": "lucideChevronDown" }
  }
}
```

`families` is keyed by the value that goes in `icons` in your components.json. Two things separate one set from another: the npm package the project needs and the prefix its symbols carry — everything else about installing a component is identical.

`icons` is one row per icon, keyed by what it means rather than by what any set calls it. Items are published in one set, and a client installing with another rewrites the symbols through this table. A row with no entry for the target set means that set has no equivalent — the symbol is left alone and reported, never guessed.

What makes the rewrite tractable is that the components write the symbol identically everywhere: the import, the `provideIcons` call and the `name` in the template are the same word, so replacing it is one substitution. Note that ng-icons also accepts the hyphenated form and converts it — a `name` of `lucide-arrow-left` resolves to the `lucideArrowLeft` you provided. Nothing published here uses that form, and a custom registry that does should expect the rewrite to leave it alone.

## Dependencies

An item can declare two kinds of dependency: npm packages and other registry items. They are resolved by different parts of the CLI.

### npm packages

`dependencies` is collected from every item selected for installation, deduplicated, and installed in a single call using the package manager declared in your `components.json` — `npm` , `yarn` , `pnpm` or `bun` . If that install fails, the CLI retries it once with `--legacy-peer-deps` .

```
{
  "name": "utils",
  "type": "registry:component",
  "basePath": "utils",
  "dependencies": ["tailwind-merge", "clsx"],
  "files": ["index.ts", "merge-classes.ts", "number.ts"]
}
```

`devDependencies` is part of the format and is carried from the manifest into the published JSON, but no item declares it today.

### Registry dependencies

`registryDependencies` points at other items of the same registry, and they are resolved recursively — a dependency that has its own dependencies pulls them in too. An item whose destination directory already exists and is not empty is skipped, unless you pass `-o, --overwrite` . With `-a, --all` the recursive walk is skipped altogether, because every item is already part of the install.

```
{
  "name": "sheet",
  "type": "registry:component",
  "registryDependencies": ["button"],
  "files": [
    "sheet.component.ts",
    "sheet.variants.ts",
    "sheet-ref.ts",
    "sheet.imports.ts",
    "sheet.service.ts",
    "index.ts"
  ]
}
```

### Import rewriting

The code stored in the registry is the code of this monorepo, so it uses the internal paths of the library. Before writing a file, the CLI rewrites those imports to the aliases configured in your project:

- `../../shared/utils/utils` becomes `<aliases.utils>/merge-classes` .
- `../../shared/utils/number` becomes `<aliases.utils>/number` .
- `../<something>` becomes `<aliases.components>/<something>` .
- `@/shared/<key>/<x>` becomes `<aliases[key]>/<x>` , for every alias you configured.
- `ClassValue` imported from `class-variance-authority` is re-pointed at `clsx` .

components.json

```
{
  "aliases": {
    "components": "@app/ui/components",
    "utils": "@app/ui/utils",
    "core": "@app/ui/core",
    "services": "@app/ui/services"
  }
}
```

Stored in the registry

```
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardButtonComponent } from '../button/button.component';
```

Written to your project

```
import { mergeClasses } from '@app/ui/utils/merge-classes';

import { ZardButtonComponent } from '@app/ui/components/button/button.component';
```

### Version compatibility

A few packages track the Angular major version. Those are installed as `<package>@^<major>.0.0` , where the major is read from the Angular version detected in your project. Today the only package on that list is `embla-carousel-angular` .

When the detected Angular version is a pre-release — `-rc` , `-next` or `-canary` — the CLI warns that some dependencies may have compatibility issues, and carries on.

## Consuming the registry

### With the CLI

The CLI is the intended client. It fetches the index, resolves the item and its dependencies, rewrites the imports and writes the files into your project.

```
npx zard-cli add button
```

- The index is cached in memory for 5 minutes within a single CLI run.
- HTTP requests time out after 30 seconds and are retried up to 3 times, with an exponential backoff starting at 1 second.
- A `429` response is honoured: the CLI waits for the number of seconds given in the `Retry-After` header before trying again.
- A response that looks like HTML is rejected with an explicit error instead of being parsed, which keeps proxy and error pages from being mistaken for registry data.

### From the MCP server

The MCP server reads the same endpoints, with its own 5 minute cache for the indexes and a 10 second request timeout. It is the consumer that surfaces the `docs` and `demos` fields of an item, so an AI assistant can read the documentation and the examples of a component alongside its source code.

### Over plain HTTP

Nothing about the registry is specific to the CLI. The files are public, static and served with permissive CORS, so any tool that can perform a GET request can read them.

```
curl https://zardui.com/r/registry.json

curl https://zardui.com/r/button.json
```

## Blocks registry

Blocks are larger compositions built on top of the components. They live in `libs/blocks/src/lib/<id>/` , and each one declares its `id` , `title` , `description` and `category` in a `block.ts` file.

The same build step that produces the component registry also emits `apps/web/public/r/blocks/<id>.json` and the index `apps/web/public/r/blocks-registry.json` .

### The blocks index

blocks-registry.json

```
{
  "blocks": [
    {
      "id": "login-01",
      "title": "Login form",
      "description": "A simple login form.",
      "category": "Login"
    },
    {
      "id": "login-02",
      "title": "Login with cover image",
      "description": "A two column login page with a cover image.",
      "category": "Login"
    },
    {
      "id": "signup-01",
      "title": "Signup form",
      "description": "A simple signup form.",
      "category": "Signup"
    }
  ]
}
```

### A block

blocks/login-01.json

```
{
  "id": "login-01",
  "title": "Login form",
  "description": "A simple login form.",
  "category": "Login",
  "files": [
    {
      "name": "login-01.component.html",
      "path": "src/components/login-01/login-01.component.html",
      "content": "<div class=\"flex min-h-svh w-full items-center justify-center p-6 md:p-10\">\n...",
      "language": "html"
    },
    {
      "name": "login-01.component.ts",
      "path": "src/components/login-01/login-01.component.ts",
      "content": "import { ChangeDetectionStrategy, Component, signal } from '@angular/core';\n...",
      "language": "typescript"
    }
  ]
}
```

Note that the file entries of a block are shaped differently from the ones of a component: besides `name` and `content` they also carry a `path` and a `language` .

## Pointing the CLI at another registry

The base URL the CLI reads from is embedded at build time. The published package carries `https://zardui.com/r` , and that value is what every command falls back to.

### The environment variable

`ZARD_REGISTRY_URL` takes precedence over the embedded default and is what actually redirects the CLI at another registry.

```
ZARD_REGISTRY_URL=https://my-registry.example.com/r npx zard-cli add button
```

### The components.json field

The configuration schema also accepts a `registryUrl` field, which is validated whenever the configuration is loaded.

components.json

```
{
  "registryUrl": "https://my-registry.example.com/r"
}
```

The helper that reads this field is not wired into the fetch path yet, so today the field is validated but not used to resolve the base URL. Use the environment variable when you need to switch registries.

### URL validation

A registry URL must use HTTPS. The only exception is `localhost` and `127.0.0.1` , which may be plain HTTP so that a local registry works during development. A malformed URL, or a remote one over HTTP, is rejected with a configuration error.

### Hosting a compatible registry

Any host that satisfies the following is a valid registry:

- Serve `GET <base>/registry.json` in the index format described above.
- Serve `GET <base>/<name>.json` in the item format for every item listed in the index.
- Respond with `Content-Type: application/json` .
- Send `Access-Control-Allow-Origin` if browsers are meant to read it.
- Use HTTPS, unless it is running on localhost.

## Running the registry locally

Working on a component means rebuilding the registry and serving it yourself. Three scripts cover that loop:

```
npm run build:registry
npm run serve:registry
npm run cli
```

- `build:registry` regenerates `apps/web/public/r/**` from the sources on disk.
- `serve:registry` serves those files at `http://localhost:4223/r` . If `apps/web/public/r` does not exist yet, it builds the registry first.
- `cli` chains the development build of the CLI and the local server, which is the usual entry point.

The port defaults to `4223` and can be changed with the `REGISTRY_PORT` environment variable:

```
REGISTRY_PORT=5000 npm run serve:registry
```

The local server only serves `.json` files, sends `Access-Control-Allow-Origin: *` on every response, and mirrors production caching: items are immutable, while `registry.json` must be revalidated.

### Using the published CLI against it

```
ZARD_REGISTRY_URL=http://localhost:4223/r npx zard-cli add button
```

The development build of the CLI already embeds `http://localhost:4223/r` as its default, while the production build embeds `https://zardui.com/r` . Both come from the same placeholder, replaced at build time.

## Adding a component to the registry

A component only reaches the registry once it is declared in the manifest. Writing the files is not enough — the build reads the manifest, not the directory listing.

1. Create the component under `libs/zard/src/lib/shared/components/<name>/` .
2. Register the item in `packages/cli/src/core/registry/registry-data.ts` , listing every file that should be copied into the user project and declaring `dependencies` or `registryDependencies` when the component needs them.
3. Run `npm run build:registry` and check the output in `apps/web/public/r/` .
4. Test the whole flow against the local registry before opening the pull request.

packages/cli/src/core/registry/registry-data.ts

```
{
  name: 'utils',
  basePath: 'utils',
  dependencies: ['tailwind-merge', 'clsx'],
  files: [
    {
      name: 'index.ts',
      content: '',
    },
    {
      name: 'merge-classes.ts',
      content: '',
    },
    {
      name: 'number.ts',
      content: '',
    },
  ],
},
```

```
npm run build:registry
npm run cli
```

For the rest of the workflow — branch naming, commit conventions and review — see the [CONTRIBUTING.md](https://github.com/zard-ui/zardui/blob/master/CONTRIBUTING.md) of the repository.
