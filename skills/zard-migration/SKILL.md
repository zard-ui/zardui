---
name: zard-migration
description: Migrates a project whose installed zard/ui component source predates the current registry — components are copied into the project by zard-cli, so nothing upgrades them on its own. Applies when a project's zard/ui source uses a name the current registry no longer publishes (`divider`, `loader`, `radio`, `progress-bar`, `toast`, `menu`, `form`, `tree`, `layout`, `segmented`), when a component's shape doesn't match its current documentation (card, pagination, input-group), or when asked to "migrate to the latest zard-ui", "upgrade this project's zard components", or "why doesn't zard-cli add match what's already here". Not for a fresh install — that's the `zard` skill.
user-invocable: true
allowed-tools: Bash(npx zard-cli *), Bash(pnpm dlx zard-cli *), Bash(bunx --bun zard-cli *)
---

# zard-migration

Migrates a project's installed zard/ui component source to match the current registry.

## Why this is invoked explicitly

The `zard` skill is `user-invocable: false` — it engages passively, on any zard/ui work. This one is
`user-invocable: true`: overwriting installed component files is consequential and worth a deliberate
ask ("migrate this project to the latest zard-ui"), not something that should fire silently the moment
an assistant notices an old selector while doing unrelated work.

Read [../zard/SKILL.md](../zard/SKILL.md) first if this project has not been worked on this session —
it covers `components.json`, the CLI, the registry and the MCP server, all of which this guide assumes.

## What you will lose

**`zard-cli add <name> --overwrite` replaces the local files wholesale.** Any edit made inside a
component's own files — a tweaked class, an added input, a changed template — is discarded, silently,
file by file. Edits kept in the theme CSS, in a new CVA variant, or in a wrapper component survive,
because those files are not part of the registry item.

Never run `--overwrite` without the user's explicit approval, and **diff before you overwrite**: read
the installed file and the registry's current version (`get-component` over MCP, or the published
`https://zardui.com/docs/components/<name>.md`) before deciding whether the local copy has changes
worth keeping.

## 1. Detect what version this project is on

There is no version field in `components.json` — a project on the current registry and a project two
years behind both look identical at that level. The signal is in the installed files themselves.

### Fast check: does anything installed no longer exist in the registry?

List the components directory (`aliases.components` in `components.json`) and compare its folder names
against `apps/web/public/r/registry.json` (or `list-components` over MCP). A folder whose name is not a
current registry item — `divider`, `loader`, `radio`, `progress-bar`, `toast`, `menu`, `form`, `tree`,
`layout`, `segmented` — is source from before that name was renamed, split, or removed. See
[renames.md](./renames.md) for the full table.

### Slower check: does an installed component's shape match its current docs?

A folder can share today's name and still be out of date — `card`, `pagination` and `input-group` were
not renamed, they were **recomposed**: the files are still called `card.component.ts`, but what they
export changed shape. Compare the installed file against `get-component-docs` / the component's
published Markdown. See [recompositions.md](./recompositions.md) for the concrete before/after of each.

### Concrete markers, if a fast grep is more useful than reading file by file

| Found in the project                                                              | Means                                                                    |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `@import '<core>/css/tailwind'` in the global CSS (instead of `.../css/zard`)       | Predates the `core` → `core` + `utilities` split ([927f8232](https://github.com/zard-ui/zardui/commit/927f8232)) |
| A bare, unscoped `::-webkit-scrollbar { ... }` block appended to the global CSS     | Predates the opt-in `scrollbar-thin` utility ([6c9e21ce](https://github.com/zard-ui/zardui/commit/6c9e21ce)) |
| `ZardButtonGroupDividerComponent` / `z-button-group-divider` anywhere               | Predates the button-group divider → separator rename ([93391360](https://github.com/zard-ui/zardui/commit/93391360)) |
| A `toast` directory, or `ZardToastComponent` / `z-toast` / `z-toaster`              | Predates the toast → sonner rename ([1fd63f15](https://github.com/zard-ui/zardui/commit/1fd63f15)) |
| `textarea[z-input]` on a `<textarea>` (instead of `textarea[z-textarea]`)           | Predates the textarea split ([70bc9b0a](https://github.com/zard-ui/zardui/commit/70bc9b0a)) |
| No `card.imports.ts` next to `card.component.ts`                                    | Predates the card recomposition ([73b544f5](https://github.com/zard-ui/zardui/commit/73b544f5)) |
| `<z-input-group [zAddonBefore]="…" [zAddonAfter]="…">` (inputs, not `z-input-group-addon` children) | Predates the input-group recomposition ([d2245133](https://github.com/zard-ui/zardui/commit/d2245133)) |
| `zType`/`zSize` on `toggle-group` without `zItems`/`zValue`/`zOrientation`          | Predates the toggle-group prop rename ([66df83b3](https://github.com/zard-ui/zardui/commit/66df83b3)) |

None of these are exhaustive on their own — a project can be a mix, migrated partway by hand at some
point. Check every installed component, not just the ones a marker flags.

## 2. What changed

- [renames.md](./renames.md) — every breaking rename and removal, old name → new name → what to edit in
  your own source, each sourced to the commit that made it.
- [recompositions.md](./recompositions.md) — card, pagination and input-group, which kept their name but
  changed shape, with the real before/after markup from this repository's own history. Also the
  `core`/`utils`/`utilities` split and the scrollbar migration.

## 3. Migrate safely — an ordered, resumable procedure

Each step is safe to stop after and safe to resume from a fresh session — nothing here depends on
in-memory state, only on the project's files and `components.json`.

1. **Audit what is installed.** Read `components.json` for `aliases.components` and `aliases.blocks`,
   then list both directories. For each folder, check it against `registry.json`
   ([renames.md](./renames.md) if the name itself is gone) and against its current docs
   ([recompositions.md](./recompositions.md) if the name survived but the shape may not have).
2. **Diff before you overwrite.** For every component that needs updating, read the installed file and
   the current registry source side by side. Note anything in the installed file that is **not** in the
   registry version — that is a local customisation, and `--overwrite` is about to discard it.
3. **Re-add from the registry.** `npx zard-cli add <name> --overwrite` (substitute the project's package
   runner — see [../zard/SKILL.md](../zard/SKILL.md)). One component at a time is easier to reconcile
   than `--all`; batch only once the pattern is familiar. A renamed component is added under its **new**
   name (`zard-cli add separator`, not `divider`) — the old folder is not removed automatically, delete
   it once nothing imports from it.
4. **Reconcile local edits.** Reapply whatever step 2 found worth keeping — as a CVA variant, a theme
   token, or a wrapper component where possible, so the next migration doesn't repeat this one.
5. **Fix imports and selectors.** Update every consumer that imported the old class name or used the old
   selector — the compiler will find the imports (`ZardButtonGroupDividerComponent` no longer exists),
   but a renamed *selector* used only in a template (`<hr z-divider>` → `<z-separator>`) fails silently
   at render, not at compile time. Grep the old selector across the project, not just the component
   folder.
6. **Fix the global CSS import**, if it still says `@import '<core>/css/tailwind'` — change it to
   `@import '<core>/css/zard'`. See [recompositions.md](./recompositions.md).
7. **Verify the build.** Typecheck, then run the app and exercise every migrated component — a renamed
   CVA variant key or a removed input surfaces as a runtime class that never applies, not a compile
   error.

Re-running this procedure is safe: step 1 finds nothing left to do once every installed component
matches the registry.

## Reference

- [renames.md](./renames.md) — the rename table
- [recompositions.md](./recompositions.md) — card, pagination, input-group, the `core`/`utils`/`utilities`
  split, and the scrollbar migration
- [../zard/SKILL.md](../zard/SKILL.md) — `components.json`, the CLI, the registry, the MCP server
