# zard-cli

Four commands: `create` scaffolds a new project, `init` sets an existing one up, `add` installs components into it and `apply` changes its design. They draw a full-screen wizard when there is a terminal to draw on, and fall back to a plain sequential run when there is not.

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

| Flag                   | Default               | Purpose                                                                                                        |
| ---------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `-y, --yes`            | `false`               | Skip the confirmation. **Required** without an interactive terminal, because `init` overwrites the global CSS. |
| `-c, --cwd <cwd>`      | current directory     | The working directory.                                                                                         |
| `-t, --type <type>`    | asked                 | The project type: `angular`, `angular-library`, `nx`, `nx-library`, `analog`.                                  |
| `-p, --project <name>` | first compatible      | The workspace project to configure.                                                                            |
| `--css <path>`         | the project's         | The global stylesheet that receives the theme (in a library, the file init creates).                           |
| `--app-config <path>`  | the project's         | The `app.config.ts` that receives `provideZard()`. Ignored for libraries.                                      |
| `--base-color <color>` | `neutral`             | `neutral`, `stone`, `zinc`, `gray`, `slate`, `mauve`, `olive`, `mist` or `taupe`. Anything else is refused.    |
| `--components-alias`   | `@/shared/components` | Import alias for components; core, services and blocks sit beside it.                                          |
| `--utils-alias`        | `@/shared/utils`      | Import alias for utils.                                                                                        |
| `--rtl` / `--no-rtl`   | `--no-rtl`            | Record `"rtl": true` and set `dir="rtl"` on `<html>` in `index.html`. It does not set `lang`.                  |
| `--preset <code>`      | none                  | Apply a whole design preset (see below). Conflicts with `--base-color`.                                        |
| `--pointer`            | `false`               | Pointer cursor on buttons. Only valid with `--preset`.                                                         |

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

### Presets

A preset is a short code starting with `Z` (default `Z0`) that carries a whole design: style, base color, theme color, chart color, body and heading font, icon library, radius, and the menu color, appearance and accent. It is built on https://zardui.com/create, which also prints the exact command. The CLI decodes it locally and rejects a malformed code — or a shadcn/ui one — before touching any file. `--preset` also accepts the whole pasted `--preset <code>` text.

```bash
npx zard-cli init --preset Z6F9MtstG --type angular --yes
```

`init --preset` works on every project type, libraries included. On top of a normal init it writes the theme (base color, theme, chart, radius, menu look, optional pointer rule), the font packages with their `@import`s and `--font-sans` / `--font-heading`, the icon family's `ng-icons` package, and `style`, `icons`, `menuColor`, `menuAppearance`, `menuAccent` and `preset` in `components.json`. Later `add` runs install components with that icon library. The `style` is recorded; the component files do not yet differ per style.

---

## `create`

Scaffolds a **new application** with the framework's own generator, then runs `init --preset` on it and installs `button`.

```bash
npx zard-cli create my-app --template nx --preset Z6F9MtstG --pointer --rtl --package-manager pnpm
```

| Flag                          | Default                  | Purpose                                                                                                       |
| ----------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `[name]`                      | asked                    | Project name and directory. Lowercase letters, digits and dashes, starting with a letter.                     |
| `--template <template>`       | asked                    | `angular` (`ng new`), `nx` (`create-nx-workspace` + the Angular app generator) or `analog` (`create-analog`). |
| `--preset <code>`             | asked                    | The design preset.                                                                                            |
| `--pointer`                   | `false`                  | Pointer cursor on buttons.                                                                                    |
| `--rtl` / `--no-rtl`          | `--no-rtl`               | Passed through to `init --rtl`.                                                                               |
| `--package-manager <manager>` | the one that ran the CLI | `npm`, `pnpm`, `yarn` or `bun`; falls back to `npm`.                                                          |
| `-c, --cwd <cwd>`             | current directory        | Where the project directory is created.                                                                       |
| `-y, --yes`                   | `false`                  | Skip confirmations; with no `--preset`, use the default design.                                               |

- **Interactive:** asks the template first (the cursor starts on `angular`, never preselected by detection), then the name, then the preset from a curated list or `Custom…`, which prints the create page URL. Flags already given are not asked again.
- **Headless** (no terminal, or `--yes` with all flags): the name and `--template` are always required, and the preset must come from `--preset` or `--yes`. Errors name the offending flag or code.
- Everything is validated before anything is written: flags, preset, name, and registry reachability. An existing `<cwd>/<name>` is refused — `create` never writes into an existing directory — so a failure leaves nothing half-created. If `init` fails after the scaffold, the project is kept and the message gives the `init --preset` command to resume.
- Libraries are not a template. For a library, or any existing project, use `init --preset`.
- **`--rtl` sets `dir="rtl"` only.** `lang` stays `"en"`; tell the user to set it to the content language (`ar`, `he`, `fa`…).

---

## `apply`

Applies a preset to a project that already has `components.json`, without running `init` again. It never prompts and never touches components.

```bash
npx zard-cli apply --preset Z6F9MtstG
npx zard-cli apply --preset Z6F9MtstG --only theme
npx zard-cli apply --preset Z6F9MtstG --only font
```

| Flag              | Default           | Purpose                                                            |
| ----------------- | ----------------- | ------------------------------------------------------------------ |
| `--preset <code>` | required          | The preset to apply.                                               |
| `--only <parts>`  | all of it         | `theme` or `font` (`fonts` is accepted), comma-separated for both. |
| `--pointer`       | keep what exists  | Add the pointer cursor rule. `--no-pointer` removes it.            |
| `-c, --cwd <cwd>` | current directory | The working directory.                                             |

- `theme` rewrites the theme block in the stylesheet (rules of your own below it survive) and the base color and `menu*` keys of `components.json`.
- `font` rewrites the font imports and `--font-sans` / `--font-heading`, and installs the font packages.
- Without `--only` it does both, plus the icon family package and `style`, `icons` and `preset` in `components.json`. Components already installed keep their style and icons; re-add them with `add <name> --overwrite` (with the user's approval) to follow the preset.

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
- `add dark-mode` needs an `index.html` path, which it asks for. Headless, `--index-html <path>` answers it; without the flag it uses the suggested path, and if that file does not exist it still registers the provider and warns that the script must be added by hand.
- A pre-release Angular (`-rc`, `-next`, `-canary`) gets a compatibility warning, not a refusal.
- Headless, the component names must come from arguments or `--all` — there is no list to pick from.
- A block id (`dashboard-01`, `login-01` …) is accepted the same way as a component name — `add dashboard-01` pulls in the block and every component it uses, writing it under `aliases.blocks` instead of `aliases.components`. See [registry.md](./registry.md).

**`--overwrite` discards local changes.** Never pass it without the user's explicit approval.

---

## What does not exist

There is no `search`, `view`, `docs`, `diff`, `info`, `build` or `preset` command — a preset is a flag of `create`, `init` and `apply`. To find components, read the registry index or use the MCP server ([registry.md](./registry.md), [mcp.md](./mcp.md)). To read a component's documentation, fetch its published Markdown at `https://zardui.com/docs/components/<name>.md`.
