---
description: Write the changelog entry for a month, curating the commits that actually matter to people who use zard/ui.
argument-hint: "[YYYY-MM]  (defaults to the current month)"
---

# Write a changelog entry

Target month: **$1** — if that is empty, use the current month (`date +%Y-%m`).

You are writing the page that people read to find out what changed in zard/ui. Your audience
**uses** the library; they do not maintain it. Most commits in a month are irrelevant to them.
Your job is editorial: read the history, decide what matters, and write about it well, in English.

Work through the steps below in order. Do not skip the verification at the end.

---

## 1. Bail out early if the month is already published

```bash
ls apps/web/src/app/domain/pages/change-log/entries/<year>/
```

If `<month>-<year>.ts` already exists, stop and tell the user the month is already published.
Offer to update it instead, but do not overwrite it without being asked.

## 2. Work out the commit range

Entries are published per month, but months get skipped — the registry currently jumps from
December 2025 to March 2026. So the range is **not** just the target month: it starts where the
last published entry left off, so nothing that happened in a skipped month is lost.

1. Read the registry to find the newest published entry before the target month:

   ```bash
   cat apps/web/src/app/domain/pages/change-log/entries/changelog-registry.ts
   ```

2. `START` = the first day of the month **after** that entry.
   `END` = the first day of the month **after** the target month.
   Example: last entry `03-2026`, target `2026-08` → `START=2026-04-01`, `END=2026-09-01`.
   If there is no earlier entry at all, use the first day of the target month as `START`.

3. Collect the commits:

   ```bash
   git log --no-merges --date=short --pretty='%h %ad %s' --since=<START> --until=<END>
   ```

4. Collect the files that changed in the library itself (this is where consumer-visible work lives):

   ```bash
   git log --no-merges --pretty=format: --name-only --since=<START> --until=<END> -- libs/zard/src/lib/shared/components | sort -u
   ```

5. Find component folders that are **new** in the range — these are the strongest candidates for
   `examples[]`:

   ```bash
   git log --no-merges --diff-filter=A --pretty=format: --name-only --since=<START> --until=<END> \
     -- 'libs/zard/src/lib/shared/components/*/*.component.ts' | sort -u
   ```

6. Skim the release notes for the same window — they already summarise the published versions:

   ```bash
   head -120 CHANGELOG.md
   ```

If step 3 returns no commits, stop: there is nothing to publish.

## 3. Curate

Hand the range to the **`changelog-curator`** subagent (via the Agent tool). Give it `START`, `END`,
the target month label, and the raw command output you collected. It reads the diffs and returns a
filtered, classified list.

Curation is the expensive part — it means reading diffs — which is exactly why it belongs in a
subagent instead of your own context.

When it comes back, apply your own judgement to the result. You are the editor; the curator is a
reader. If it kept something that only a maintainer would care about, drop it.

**If the curator returns nothing relevant, stop and say so.** A month with 40 commits can legitimately
produce zero entries. Do not invent content to fill the page. Do not create the file.

## 4. Relevance criteria

These are derived from the eleven entries already published — read a couple of them before you write,
they are the real specification.

### Goes in `examples[]` — a new component with a visual demo

- A component published under `libs/zard/src/lib/shared/components/<name>/` with a demo in `demo/`.
  (November 2025 → Carousel and Kbd. March 2025 → Button, Card, Badge, Alert, Table.)
- The `description` says what the **component** does, in one sentence — never what the commit did.
  Good: *"Display keyboard keys and shortcuts in a visually consistent way."*
  Bad: *"Adds the Kbd component and its tests."*

### Goes in `highlights[]` — no visual component, but it changes the life of someone consuming the library

- A new public API or provider (December 2025 → `provideZard()`).
- A change to how the library is distributed (December 2025 → the CLI's private registry).
- A new CLI command or capability (December 2025 → `add dark-mode`).
- A dependency migration the consumer feels (March 2026 → `lucide-angular` → `@ng-icons/lucide`).
- A breaking change, with the migration path.
- Support for a new major of Angular or Tailwind.

Set `code` **only** when there is a short, literal command or snippet worth copying.

### Stays out — when in doubt, exclude

- Internal bug fixes with no public API change.
- `chore` / `ci` / `build` / `test` / `style`, and refactors with no visible effect.
- Release and version-bump commits (`🔖 chore(release)`, "This was a version bump only").
- Changes to the documentation site (`apps/web`) that do not affect people installing the library.
- Docs for a single component.
- Anything that only matters to whoever maintains the repository.

## 5. Validate every symbol before writing

An entry that references a demo or a code blob that does not exist breaks the build. Check first —
for each component you are about to showcase, with `<name>` the folder name and `<variation>` the
demo file name (`default`, `preview`, `basic`, `customization`, …):

```bash
ls libs/zard/src/lib/shared/components/<name>/demo/
grep -n "export class" libs/zard/src/lib/shared/components/<name>/demo/<variation>.ts
grep -n "export const" apps/web/src/generated/components/<name>/demo/<variation>.ts
grep -n "export const" apps/web/src/generated/installation/cli/add-<name>.ts
```

If the `@generated/**` files are missing, the highlighter has not run for that component:

```bash
npm run generate:highlight
```

Then check again. Never write an import you have not verified.

## 6. Write the entry

Two files, both under `apps/web/src/app/domain/pages/change-log/entries/<year>/`. Write them with
Write/Edit, copying the shape and tone of the neighbouring months.

### `<month>-<year>.ts` — the metadata (always)

This half is loaded eagerly for every visitor, so it stays small: no imports of demos or code blobs.

```ts
import { type ChangelogEntry } from '../changelog-entry.interface';

export const AUGUST_2026: ChangelogEntry = {
  meta: {
    month: 'August 2026',
    year: 2026,
    monthNumber: 8,
    date: new Date(2026, 7, 1), // month is 0-based here
    id: '08-2026', // MM-YYYY, zero-padded
  },

  overview: 'One or two sentences summarising the month.',

  highlights: [
    {
      title: 'Short noun phrase',
      description: 'What changed and what it means for someone using the library.',
      icon: 'zap', // 'zap' | 'terminal' | 'moon' | 'package' | 'rocket' | 'shield' | 'code' | 'settings'
      code: 'npx zard-cli@latest add dark-mode', // only when there is something to copy
    },
  ],

  // Only when the month ships components — must match the file below.
  loadExamples: () => import('./august-2026.examples').then(m => m.AUGUST_2026_EXAMPLES),
};
```

`meta.id`, `meta.date`, `meta.monthNumber` and `meta.month` must all agree. Drop `highlights` if the
month has none; drop `loadExamples` if it ships no components.

### `<month>-<year>.examples.ts` — the demo payload (only when the month ships components)

This half is imported on demand, one module per month, when the month approaches the viewport. It is
where every heavy import belongs.

```ts
import { INPUT_OTP_DEMO_DEFAULT } from '@generated/components/input-otp/demo/default';
import { INPUT_OTP_CLI_ADD } from '@generated/installation/cli/add-input-otp';

import { ZardDemoInputOtpDefaultComponent } from '@zard/components/input-otp/demo/default';

import { type ChangelogExample } from '../changelog-entry.interface';

export const AUGUST_2026_EXAMPLES: ChangelogExample[] = [
  {
    name: 'default', // the demo variation shown
    description: 'One sentence describing what the component does.',
    component: ZardDemoInputOtpDefaultComponent,
    componentName: 'input-otp', // the real folder name — it drives the install command
    codeData: INPUT_OTP_DEMO_DEFAULT,
    cliAdd: INPUT_OTP_CLI_ADD,
  },
];
```

`componentName` must be an existing folder in `libs/zard/src/lib/shared/components/`.

### Tone

English, first person plural, the same register as the published months: *"We replaced…"*,
*"We focused on…"*. `overview` is one or two sentences. Descriptions are one sentence. No changelog
jargon, no commit hashes, no PR numbers, no marketing.

## 7. Register the entry

Add the new const to `apps/web/src/app/domain/pages/change-log/entries/changelog-registry.ts`:
an import at the top and the const in the `CHANGELOG_ENTRIES` array. Keep the array in reverse
chronological order for readability — the list is sorted by date at runtime either way.

## 8. Verify

```bash
npx eslint apps/web/src/app/domain/pages/change-log --fix
npm run build
```

`npm run build` regenerates `apps/web/public/docs/changelog.md`, which is a **committed artifact** —
the "copy page" button and `llms.txt` serve it. It has to be committed together with the entry.

Then confirm, in this order:

```bash
grep -c "Error loading markdown" apps/web/public/docs/changelog.md   # must be 0
grep -n "<Month> <Year>" apps/web/public/docs/changelog.md           # the new month is there
grep -c "<Month> <Year>" dist/apps/web/browser/docs/changelog/index.html  # server-rendered, not a placeholder
```

The new month must appear in the **prerendered HTML**, not only after hydration — the page is
prerendered and the markdown is extracted from that HTML.

## 9. Commit

Commit messages are validated by commitlint: an emoji is required, the subject is 10–72 characters
and has no trailing period.

```
📝 docs(changelog): add the <Month> <Year> entry
```

Include the entry files, the registry, and the regenerated `apps/web/public/docs/changelog.md`.
