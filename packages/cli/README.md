# zard-cli

The command line for [zard/ui](https://www.zardui.com): add beautiful, accessible Angular components to your project with a single command. The source lands in your codebase, so every component is yours to read and change.

<a alt="zard/ui" href="https://www.zardui.com/docs/cli" target="_blank" rel="noreferrer">
  <img align="center" width="100%" src="https://www.zardui.com/images/github_banner.png" alt="zard/ui"/>
</a>

<p align="center">
  <a href="https://www.npmjs.com/package/zard-cli"><img src="https://img.shields.io/npm/v/zard-cli?label=zard-cli" alt="npm version"/></a>
  <a href="https://github.com/zard-ui/zardui"><img src="https://img.shields.io/github/stars/zard-ui/zardui" alt="GitHub stars"/></a>
  <a href="https://github.com/zard-ui/zardui/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/zard-cli" alt="license"/></a>
</p>

## Quick start

```bash
# 1. Set up zard/ui in your project
npx zard-cli@latest init

# 2. Add components; whatever they depend on comes along
npx zard-cli@latest add button card dialog
```

```ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'app-root',
  imports: [ZardButtonComponent],
  template: `
    <z-button>Click me</z-button>
  `,
})
export class AppComponent {}
```

Requires Node 20 or newer and an Angular project with Tailwind CSS v4 (`init` installs and wires Tailwind for you).

## Commands

### `init`

Sets up your project: installs the dependencies, writes the theme tokens, maps the `@/` import alias, registers `provideZard()` and wires Tailwind into the build. The first question is the kind of project, and everything after it follows from that answer.

```bash
npx zard-cli init
```

| Option                 | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| `-y, --yes`            | Skip the confirmation prompt                                               |
| `-c, --cwd <cwd>`      | Working directory, defaults to the current one                             |
| `-t, --type <type>`    | Project type: `angular`, `angular-library`, `nx`, `nx-library` or `analog` |
| `-p, --project <name>` | Which workspace project to configure, when more than one is compatible     |

Outside a terminal (CI, pipes) pass `--yes`, and `--type` to answer the first question:

```bash
npx zard-cli init --yes --type nx --project web
```

### `add`

Adds components, blocks and utilities, resolving their dependencies.

```bash
npx zard-cli add [components...]
```

| Option              | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `-y, --yes`         | Skip the confirmation prompt                                   |
| `-o, --overwrite`   | Overwrite existing files                                       |
| `-c, --cwd <cwd>`   | Working directory, defaults to the current one                 |
| `-a, --all`         | Add every available component                                  |
| `-p, --path <path>` | Write the components somewhere other than the configured alias |

```bash
npx zard-cli add dialog            # one component
npx zard-cli add button card input # several at once
npx zard-cli add sidebar-07        # a block, with the components it needs
npx zard-cli add --all             # everything
```

## Project types

The project type decides where the components live and what `init` configures. The paths below are the usual defaults: `init` derives the real ones from the project you pick, so an app outside the workspace root, or an Angular workspace that keeps its paths in `tsconfig.base.json`, gets those instead. Each path is also shown as an editable suggestion before anything is written.

| Type              | Tailwind                               | TypeScript paths     | Providers                          |
| ----------------- | -------------------------------------- | -------------------- | ---------------------------------- |
| `angular`         | `.postcssrc.json` at the root          | `tsconfig.json`      | `src/app/app.config.ts`            |
| `angular-library` | none: the consuming app owns the build | `tsconfig.json`      | none                               |
| `nx`              | `.postcssrc.json` inside the app       | `tsconfig.base.json` | `apps/<app>/src/app/app.config.ts` |
| `nx-library`      | none: the consuming app owns the build | `tsconfig.base.json` | none                               |
| `analog`          | plugin in `vite.config.ts`             | `tsconfig.json`      | `src/app/app.config.ts`            |

## Custom registry

The CLI installs from `https://zardui.com/r`. Point it at your own registry with an environment variable:

```bash
ZARD_REGISTRY_URL=https://registry.acme.dev/r npx zard-cli add button
```

## Documentation

- [CLI guide](https://www.zardui.com/docs/cli): every option, the non-interactive mode and troubleshooting
- [Components](https://www.zardui.com/docs/components)
- [MCP server](https://www.zardui.com/docs/mcp): let your AI assistant install components through this CLI

## License

[MIT](https://github.com/zard-ui/zardui/blob/master/LICENSE.md)
