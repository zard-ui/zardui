---
title: Skills
description: Teach your AI assistant how zard/ui is actually built — the conventions, the CLI and the registry — so it writes code that compiles the first time. A second skill migrates a project pinned to an older version.
---

# Skills

Teach your AI assistant how zard/ui is actually built — the conventions, the CLI and the registry — so it writes code that compiles the first time. A second skill migrates a project pinned to an older version.

## What it changes

An assistant asked for a zard/ui component writes from whatever it absorbed about the library — which is how you get an `@Input()` on a signal component, a `<z-button>` element where the selector is an attribute, and a dialog toggled by a boolean that this library opens through a service. The skill replaces the recollection with the conventions: how components are installed, what the inputs are called, and which composition is the right one.

Prompts it makes work as asked, rather than after two rounds of corrections:

- *"Add a profile form with Signal Forms, validated, with the errors under each field."*
- *"Build a settings page with a sidebar layout and a card per section."*
- *"Switch the theme to zinc."*
- *"Install the components from our private registry instead of the public one."*
- *"Set this up in the admin app of our Nx workspace."*

It is complementary to the [MCP server](/docs/mcp) , not a replacement: the server fetches the real source and documentation on demand, the skill carries the conventions that apply before any component is fetched. Together they cover both halves of the problem.

A second skill, **zard-migration** , covers a different problem: components are copied into a project rather than imported from a package, so nothing upgrades them when a name is renamed or a component is recomposed. It documents every breaking change and the procedure to bring an older project's source back in line with the current registry — see [Installation](/docs/skills#installation) below.

## Installation

The [skills](https://skills.sh) CLI installs from this repository. Because it hosts two skills, the command names which one with `--skill` . It asks whether to install for the project or globally, and which agents to install it for.

```
npx skills add https://github.com/zard-ui/zardui --skill zard
```

Migrating a project pinned to an older zard/ui — renamed selectors, a recomposed `card` or `input-group` , source that predates the `core` / `utilities` split? Install `zard-migration` instead, or in addition, with its own `--skill` :

```
npx skills add https://github.com/zard-ui/zardui --skill zard-migration
```

Both commands can be run in the same project — they write to separate directories and don't conflict. Installed for the project, they land in `.claude/skills/zard` and `.claude/skills/zard-migration` — each a main file and a set of references it links to, so that a rule is only read when it is needed:

**.claude/skills**

```
zard/
  SKILL.md          project context, principles, critical rules
  cli.md            init and add, every flag, the project types
  registry.md       index, item and icon formats; your own registry
  mcp.md            the nine MCP tools and how to connect them
  customization.md  theme tokens, CVA variants, mergeClasses
  rules/
    angular.md      standalone, input(), OnPush, selectors
    styling.md      Tailwind v4, semantic tokens, variants first
    composition.md  compose before writing custom markup
    forms.md        Signal Forms, Reactive Forms, Template-driven
    icons.md        ng-icons, provideIcons, the catalog
    typeset.md      styling rendered markdown with one container class
zard-migration/
  SKILL.md          detection, the ordered migration procedure, the --overwrite warning
  renames.md         every breaking rename, sourced to the commit that made it
  recompositions.md  card, pagination, input-group, the core/utils/utilities split
```

Nothing else to configure. Committing the installed directories is what makes the skills available to everyone working on the project, rather than to whoever ran the command.

## What's included

Six areas, each its own file. The main guide carries the rules that always apply; the rest is loaded when the work calls for it — this is what `zard` installs.

### Project context

The first instruction is to read the project's [components.json](/docs/components-json) : the import aliases, the source root, the icon family, the package manager, the project type, and the registry the project installs from. Those are the values that decide what generated code should look like, and assuming them is what produces imports that do not resolve.

### CLI commands

`init` and `add` with every flag, the five project types and what follows from each, and how the headless path behaves. It also states what does not exist — there is no `search` , `diff` or `info` command, and inventing one is the failure that looks most like success.

### Registry

The three published files — the index, the items, the icon catalog — with their JSON Schemas, what `schemaVersion` means, and how to point a project at a [registry of your own](/docs/registry) .

### MCP server

The nine tools with their inputs, how to connect the server in each client, and the two environment variables that point it at another registry. Mostly a pointer to [the same thing documented here](/docs/mcp) , so the assistant knows the tools exist and reaches for them before guessing at an API.

### Theming and customization

The [theme tokens](/docs/theming) and how to add one, CVA variants in `<name>.variants.ts` , `mergeClasses` and the order its arguments go in, and which layer to change for which kind of customization — with the note that an edit to a component's body is the one that a later `--overwrite` discards.

### Rules

Six files of incorrect/correct pairs, in real zard/ui code:

- **Angular** — standalone, `input()` , OnPush, `ViewEncapsulation.None` , and the element-versus-attribute selectors
- **Styling** — semantic tokens, variants before raw classes, `class` for layout only
- **Composition** — the full card, items inside their group, dialogs opened by a service
- **Forms** — the three [form approaches](/docs/forms) , `z-field` layout, and validation state
- **Icons** — ng-icons, `provideIcons` , and the configurable family
- **Typeset** — one container class for rendered markdown instead of a class per tag, and the six variables that govern it

### The migration skill

A second, separate skill — `zard-migration` — for a project whose installed component source predates the current registry. Unlike `zard` , it is invoked explicitly: three files, no lazy-loaded references, because a migration is read start to finish rather than consulted rule by rule.

- **SKILL.md** — how to tell which version a project is on with no version field to read, and the ordered, resumable migration procedure
- **renames.md** — every breaking rename and removal, old name to new name, sourced to the commit that made it
- **recompositions.md** — the components that kept their name but changed shape, with real before/after markup

## How it works

1. **Detection.** The description says when the skill applies — working with zard/ui, the CLI, the registry, or a project whose `components.json` declares a zard project type. The assistant loads it on its own; you do not invoke it. `zard-migration` is the exception — a migration is consequential enough that it is invoked explicitly, by name.
2. **Project context.** It reads `components.json` from the project root and works from the real aliases, source root, icon family and package manager. There is no `info` command to run: the file is the configuration.
3. **Conventions applied.** Standalone and OnPush, signal inputs, the `z` prefix, semantic tokens, variants before raw classes, `z-field` for form layout — the same rules the library holds itself to.
4. **Discovery before code.** What exists comes from the registry index or the [MCP server](/docs/mcp) ; a component's real API comes from its documentation page, published as Markdown at `/docs/components/<name>.md` . Reading it is cheaper than debugging an input that never existed.
5. **Installation through the CLI.** Components are written by [`zard-cli add`](/docs/cli) , with the package runner the project actually uses — never by pasting source fetched from GitHub, which skips dependency resolution and the icon family.

## Learn more

- [CLI](/docs/cli) — the full command and flag reference
- [MCP Server](/docs/mcp) — connect an assistant to the registry and the docs
- [Theming](/docs/theming) — the tokens every component reads
- [Registry](/docs/registry) — the published format, and how to serve your own
- [skills/zard](https://github.com/zard-ui/zardui/tree/master/skills/zard) — the source of everything described above
- [skills/zard-migration](https://github.com/zard-ui/zardui/tree/master/skills/zard-migration) — the second skill, for a project whose component source predates the current registry
