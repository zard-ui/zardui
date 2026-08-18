# zard-cli

Two commands: `init` sets a project up, `add` installs components into it. Both draw a full-screen wizard when there is a terminal to draw on, and fall back to a plain sequential run when there is not.

The package is `zard-cli`. Run it with the project's own runner:

```bash
npx zard-cli <command>
pnpm dlx zard-cli <command>
yarn zard-cli <command>
bunx zard-cli <command>
```

---

## Global options

| Flag            | Purpose                                                          |
| --------------- | ---------------------------------------------------------------- |
| `-v, --version` | Print the version.                                               |
| `--debug`       | Verbose logging, including why the full-screen UI was not drawn. |

`ZARD_DEBUG` in the environment does the same as `--debug`.

---

## `init`

Initialises the project: writes `components.json`, installs dependencies, configures Tailwind and the TypeScript aliases, applies the theme tokens, and installs the shared `core` and `utils` helpers every component needs.

```bash
npx zard-cli init
```

| Flag                   | Default           | Purpose                                                                                                        |
| ---------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `-y, --yes`            | `false`           | Skip the confirmation. **Required** without an interactive terminal, because `init` overwrites the global CSS. |
| `-c, --cwd <cwd>`      | current directory | The working directory.                                                                                         |
| `-t, --type <type>`    | asked             | The project type: `angular`, `angular-library`, `nx`, `nx-library`, `analog`.                                  |
| `-p, --project <name>` | first compatible  | The workspace project to configure.                                                                            |

Running `init` in a project that already has a `components.json` re-initialises it — the `.postcssrc.json` is rewritten on purpose, which is how a leftover configuration gets fixed.

### The project type

The first question, and the user's to answer — the CLI does not decide it. It is not cosmetic: it determines which file the aliases go into, how Tailwind is wired, and whether there is an application to register providers in.

| Type              | What it means                                                         |
| ----------------- | --------------------------------------------------------------------- |
| `angular`         | Application. Providers in `app.config.ts`, tokens in the global CSS.  |
| `angular-library` | Publishable library. Components ship with it; no app providers.       |
| `nx`              | Application inside an Nx workspace. Paths go to `tsconfig.base.json`. |
| `nx-library`      | Library inside an Nx workspace, in `libs/`. No app providers.         |
| `analog`          | Vite-powered Angular app. Tailwind is a Vite plugin, not PostCSS.     |

What follows from it:

- **TypeScript paths.** Nx types write to `tsconfig.base.json` — the root `tsconfig.json` is not inherited by any project, so a mapping written there never reaches the compiler even though the editor resolves it. Everything else writes to the project's own `tsconfig.json`, unless the workspace already keeps a base config.
- **Tailwind.** `analog` gets the Vite plugin. Everything else gets a `.postcssrc.json` written **inside the project**, not at the workspace root — the root would configure every app at once.
- **Libraries.** No `app.config.ts` and no global CSS to overwrite, so those steps do not run. The theme CSS is created inside the library and declared as an asset in `ng-package.json` so it reaches the published package. `provideZard()` and the Tailwind setup are then the consuming application's responsibility — `init` says so before it finishes. It does **not** touch the library's public entry point: `core` (and every component `add` writes) lands under `baseUrl`, and re-exporting it from `src/index.ts` is a manual step. Skip it and the consuming app has nothing to import.
- **`index.html`.** Analog keeps it at the project root; the Angular build keeps it in `src/`. This is what `add dark-mode` needs.

### Choosing the project

Once the type is answered, only matching projects are offered — applications for `angular`/`nx`/`analog`, libraries for the library types. With one candidate the question is skipped and the name is shown in the header. `--project <name>` answers it in advance; an incompatible name is refused with the list of valid ones.

`<app>-e2e` projects are excluded. The Nx generator declares them as `projectType: "application"`, but there is no `app.config.ts`, global CSS or build to configure there. The suffix is the convention; a `playwright.config.*` or `cypress.config.*` in the project directory catches renamed ones.

### Headless

With no interactive terminal — CI, a pipe — nobody can answer, so:

- `--yes` is mandatory.
- The type falls back to detection: Nx workspace → `nx` (or `nx-library` when the workspace declares libraries and no application), Analog dependencies → `analog`, otherwise `angular`.
- The global CSS must already exist, except in a library where `init` creates it.

---

## `add`

Installs components into the configured directory, resolving their dependencies — both npm packages and other registry items — before writing anything.

```bash
npx zard-cli add button card dialog
npx zard-cli add
```

| Flag                | Default                  | Purpose                                                                 |
| ------------------- | ------------------------ | ----------------------------------------------------------------------- |
| `-y, --yes`         | `false`                  | Skip the confirmation.                                                  |
| `-o, --overwrite`   | `false`                  | Overwrite existing files.                                               |
| `-c, --cwd <cwd>`   | current directory        | The working directory.                                                  |
| `-a, --all`         | `false`                  | Add every available component.                                          |
| `-p, --path <path>` | the configured directory | Write to a different directory. Must stay inside the working directory. |

Positional arguments are component names — the same names the registry index publishes. With none, the wizard opens the list.

Notes:

- `add` requires `components.json`. Without it, it stops and tells you to run `init`.
- Dependencies already present in the project are filtered out, so a repeated `add` does not pay for a full dependency-tree revalidation.
- `add dark-mode` needs an `index.html` path, which it asks for. Headless, it warns instead: run it interactively to configure it.
- A pre-release Angular (`-rc`, `-next`, `-canary`) gets a compatibility warning, not a refusal.
- Headless, the component names must come from arguments or `--all` — there is no list to pick from.

**`--overwrite` discards local changes.** Never pass it without the user's explicit approval.

---

## What does not exist

There is no `search`, `view`, `docs`, `diff`, `info`, `build`, `apply` or `preset` command. To find components, read the registry index or use the MCP server ([registry.md](./registry.md), [mcp.md](./mcp.md)). To read a component's documentation, fetch its published Markdown at `https://zardui.com/docs/components/<name>.md`.
