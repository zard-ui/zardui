```bash tab="npm" copyButton
npx skills add https://github.com/zard-ui/zardui --skill zard
```

```bash tab="pnpm" copyButton
pnpm dlx skills add https://github.com/zard-ui/zardui --skill zard
```

```bash tab="yarn" copyButton
yarn dlx skills add https://github.com/zard-ui/zardui --skill zard
```

```bash tab="bun" copyButton
bunx skills add https://github.com/zard-ui/zardui --skill zard
```

Migrating a project pinned to an older zard/ui — renamed selectors, a recomposed `card` or `input-group`, source that predates the `core`/`utilities` split? Install `zard-migration` instead, or in addition, with its own `--skill`:

```bash tab="npm" copyButton
npx skills add https://github.com/zard-ui/zardui --skill zard-migration
```

```bash tab="pnpm" copyButton
pnpm dlx skills add https://github.com/zard-ui/zardui --skill zard-migration
```

```bash tab="yarn" copyButton
yarn dlx skills add https://github.com/zard-ui/zardui --skill zard-migration
```

```bash tab="bun" copyButton
bunx skills add https://github.com/zard-ui/zardui --skill zard-migration
```

Both commands can be run in the same project — they write to separate directories and don't conflict. Installed for the project, they land in `.claude/skills/zard` and `.claude/skills/zard-migration`:

```text title=".claude/skills"
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
