# Report — Date Picker update (zard/ui)

Closes [#526](https://github.com/zard-ui/zardui/issues/526). Branch: `feat/date-picker-update`.

The calendar got everything in [#689](https://github.com/zard-ui/zardui/pull/689) — `zMode`, `zCaptionLayout`,
`zNumberOfMonths`, `zDisabledDates`, `zShowOutsideDays`. The date picker was still hardcoding `single` + `dropdown` and
could not express any of it. Most of this change is forwarding what already exists, plus aligning the trigger with the
shadcn/ui reference (`apps/v4/examples/base/date-picker-*.tsx`).

---

## 1. Trigger: before → after

| Slot             | Before                                                            | After                                                                              |
| ---------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| host             | no classes of its own                                             | `flex w-[212px] flex-col` + `data-slot="date-picker"` + `data-empty`               |
| trigger layout   | `justify-start min-w-[240px]` + `HEIGHT_BY_SIZE` map              | `w-full justify-between text-left font-normal` (via CVA)                           |
| trigger height   | `xs h-7 / sm h-8 / default h-9 / lg h-11` — one step above button | inherited from `buttonVariants` (`xs h-6 / sm h-7 / default h-8 / lg h-9`)         |
| icon             | `lucideCalendar`, always, leading                                 | `zIcon`: trailing `lucideChevronDown` (default), leading `lucideCalendar`, or none |
| empty state      | `text-muted-foreground` computed in TS on two nodes               | `data-empty="true"` + `data-[empty=true]:text-muted-foreground`                    |
| popover          | `w-auto p-0`, centered                                            | `w-auto overflow-hidden p-0`, `zAlign="start"`                                     |
| calendar caption | `zCaptionLayout="dropdown"` hardcoded                             | `zCaptionLayout` input, default `label`                                            |

The icon carries `data-icon="inline-start"` / `inline-end`, which is what `buttonVariants` already keys its padding
off — same contract shadcn uses.

### Dead code removed

- `datePickerVariants` was a CVA whose every variant mapped to `''`. It now holds the host wrapper, and
  `datePickerTriggerVariants` holds the trigger delta.
- `HEIGHT_BY_SIZE` (a hand-written height map that overrode the button, with a comment explaining why) is gone. It made
  the picker one step taller than an `<input z-input>` next to it — visible in the “With time” example.
- `textClasses` and `popoverClasses` were `computed()` wrappers around a constant string.

---

## 2. API

### New inputs

| Input              | Type                                                             | Default     |
| ------------------ | ---------------------------------------------------------------- | ----------- |
| `zId`              | `string`                                                         | `''`        |
| `zIcon`            | `'chevron' \| 'calendar' \| 'none'`                              | `'chevron'` |
| `zMode`            | `'single' \| 'multiple' \| 'range'`                              | `'single'`  |
| `zCaptionLayout`   | `'label' \| 'dropdown' \| 'dropdown-months' \| 'dropdown-years'` | `'label'`   |
| `zNumberOfMonths`  | `number`                                                         | `1`         |
| `zDisabledDates`   | `Date[]`                                                         | `[]`        |
| `zShowOutsideDays` | `boolean`                                                        | `true`      |
| `zAlign`           | `'start' \| 'center' \| 'end'`                                   | `'start'`   |

`zId` lands on the trigger button so a `<label for="…">` points at something focusable; when it is set, the built-in
`aria-label="Choose date"` steps aside so the label wins.

### Breaking changes

1. **`placeholder` → `zPlaceholder`.** The `z` prefix the issue asks for.
2. **`value` is `CalendarValue`** (`Date | Date[] | null`), not `Date | null`, and `(dateChange)` emits the same. In
   single mode nothing changes at runtime.
3. **`zSize` no longer overrides the button height** — the default picker is `h-8` instead of `h-9`. It now lines up
   with `z-input`.
4. **The month/year dropdowns are opt-in.** Pass `zCaptionLayout="dropdown"` to keep the old caption.
5. **Trigger width is `212px`, not `min-w-[240px]`,** and lives on the host: `class="w-44"` resizes it. Inside a
   `<div z-field>` the field wins (it forces `*:w-full`), which is how the examples set their widths.
6. **`calendar` view child is optional** (`viewChild`, not `viewChild.required`). It only exists while the popover is
   open — the old required signal would have thrown on access with the popover closed.

### Behavior

- `single` closes the popover on pick, `range` once both ends are set, `multiple` stays open.
- The picker now binds the calendar's `(valueChange)` instead of `(dateChange)`, so clearing a range (clicking the same
  day twice) propagates. `(dateChange)` filters nulls out.

---

## 3. Files

**Created:** `demo/{preview,basic,date-of-birth,range,with-time,with-input}.ts`, this report.

**Modified:** `date-picker.component.ts`, `date-picker.variants.ts`, `date-picker.component.spec.ts`,
`demo/{date-picker,formats,sizes}.ts`, `doc/api.ts`, `apps/web/src/app/shared/constants/components.constant.ts`
(the description said “with range and presets”, and it had neither),
`packages/highlight/src/generator/usage-data.ts` (`placeholder` → `zPlaceholder`).

**Removed:** `demo/default.ts` — replaced by `preview.ts` (hero) and `basic.ts`. The orphaned generated file was cleaned
up by the generator.

**Generated:** `apps/web/src/generated/components/date-picker/**`, `apps/web/src/generated/installation/manual/date-picker.ts`,
`apps/web/src/generated/usage/date-picker.ts`, `apps/web/public/r/date-picker.json`.

`registry-data.ts` needed no change: the three files and the `button`/`calendar`/`popover` dependencies were already
right.

---

## 4. Examples

One per example on the shadcn/ui date picker page, plus the two zard-specific ones that document existing inputs.

| Demo            | Mirrors             | Shows                                                                       |
| --------------- | ------------------- | --------------------------------------------------------------------------- |
| `preview`       | `date-picker-demo`  | the default trigger, chevron and all                                        |
| `basic`         | `date-picker-basic` | `z-field` label via `zId`, `zIcon="none"`                                   |
| `date-of-birth` | `date-picker-dob`   | `zCaptionLayout="dropdown"` + `minDate`/`maxDate`                           |
| `range`         | `date-picker-range` | `zMode="range"`, `zNumberOfMonths=2`, `zIcon="calendar"`                    |
| `with-time`     | `date-picker-time`  | picker next to a `type="time"` input                                        |
| `with-input`    | `date-picker-input` | `z-input-group` + `z-popover` + `z-calendar`, typed entry, arrow-down opens |
| `sizes`         | —                   | the four heights                                                            |
| `formats`       | —                   | `zFormat` patterns                                                          |

Every demo lost its `console.log`. `multiple` mode is documented in `doc/api.ts` but has no example — a trigger listing
N dates degrades fast, and shadcn does not show one.

---

## 5. Decisions taken under ambiguity

1. **`zCaptionLayout` defaults to `label`, not `dropdown`.** shadcn's own date picker demo has no `captionLayout`; the
   dropdowns show up only in the date-of-birth and time examples. Matching the reference beat preserving the old look,
   and the escape hatch is one attribute.
2. **`zIcon` instead of picking one icon.** shadcn's examples use both a trailing chevron (demo, time) and a leading
   calendar (range). Without the input, the range example could not be reproduced.
3. **Width on the host, not on the trigger.** The trigger is `w-full`, so a single class on `<z-date-picker>` — or the
   surrounding `z-field` — controls the width. Putting `w-[212px]` on the button would have made `class` useless for
   resizing, since `class` binds to the host.
4. **`zSize` typed as a subset of the button scale** (`Extract<ZardButtonSizeVariants, …>`) rather than its own CVA
   variant. There is nothing left to vary once the heights come from the button.
5. **The range label is `Jan 20, 2026 - Feb 09, 2026`** — a hardcoded `-`, matching shadcn. An input for the separator
   would be one more thing to document for no real use case.
6. **`data-empty` emitted as `"true"` or absent**, not `"true"`/`"false"` — same convention the calendar grid uses for
   its `data-*` state.
7. **`aria-label` dropped when `zId` is set.** An `aria-label` beats an associated `<label>` for assistive tech, so
   keeping both would have hidden the visible label from screen readers.
8. **Open/closed asserted through `aria-expanded`, not through the overlay node.** The popover flips `aria-expanded`
   synchronously but detaches the overlay only when its close animation ends, so asserting on the DOM node passed
   locally and failed on CI. `aria-expanded` is both deterministic and the thing users of assistive tech actually get.
9. **`(dateChange)` documented as `EventEmitter<CalendarValue>`.** It is really an `OutputEmitterRef`, but all 15 output
   rows across the other `doc/api.ts` files say `EventEmitter`. Fixing one file would just make the docs inconsistent.
10. **The typed-date example parses one documented format by hand.** `new Date(value)` reads date-only ISO strings as
    UTC, so west of UTC the calendar lands a day earlier than what was typed. shadcn's own example has this bug.

---

## 6. Out of scope

- **Natural language picker** — needs `chrono-node`, a new runtime dependency. Worth its own issue.
- **RTL** — needs locale support in `z-calendar` (month/weekday names, `dir`). It is a calendar feature, not a date
  picker one.

---

## 7. Verification

| Command                                           | Result                                                                                         |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `npx nx test zard` (baseline)                     | 77 suites… → this clone: **1234 tests**                                                        |
| `npx nx test zard` (after)                        | 81 suites, **1258 tests** (33 in date-picker)                                                  |
| `npx nx lint zard`                                | **0 errors**, 273 warnings (baseline: 14 errors from unformatted new files, same 273 warnings) |
| `npx nx build zard`                               | ✅                                                                                             |
| `npx nx run web:build --configuration=production` | ✅ 83 routes prerendered                                                                       |
| `npm run generate:highlight`                      | ✅ 7 demo files, 1 installation file                                                           |
| `npm run build:registry`                          | ✅ 49 components, 0 failed                                                                     |

### Visual pass

Done in Chromium at 1280×900 against the dev server, light **and** dark, for every example, closed and open:
the hero, the range popover across two months, the dropdown caption with a 1900→today year range, the composed input
variant, all four sizes, all four formats, plus hover and focus-ring on the trigger.

One real bug surfaced and was fixed: **`with-time` collapsed to zero width.** The demo host element has no intrinsic
width, and `z-field-group` is `w-full`, so `max-w-xs` had nothing to resolve against — both fields rendered at 0 and the
labels overlapped. Fixed with a fixed `w-xs`, and the field (not the picker) now owns the date column width, since
`z-field` forces `*:w-full` onto its children.

### Accessibility

Checked with axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) and by keyboard:

- Trigger: `role="button"`, `aria-haspopup="dialog"`, `aria-expanded` flipping on open, `aria-controls` resolving to the
  popover id. `Enter` opens, `Escape` closes and returns focus.
- Day grid: arrow keys move the roving focus (`Friday, August 14, 2026, Today` → `Saturday, August 15, 2026`).
- In the labelled examples the accessible name comes from the `<label>`, not from `aria-label`.
- axe reports no new violation attributable to the date picker. See below for what it did find.

---

## 8. Unrelated bugs found (not fixed)

1. **The calendar grid has invalid ARIA structure.** `calendar-grid.component.ts` puts all 42 `role="gridcell"` divs
   directly inside one `role="rowgroup"`, so axe reports `aria-required-parent` (42 nodes), `aria-required-children` and
   `aria-allowed-attr` on the day ids whenever a calendar is on screen. A `role="row"` wrapper per week would fix it.
   Pre-existing, and it affects `z-calendar` everywhere — worth its own issue.
2. **`muted-foreground` on `bg-muted` fails contrast.** An empty trigger renders muted text, and the open state adds
   `aria-expanded:bg-muted`; axe flags the pair. It comes from the design tokens plus `buttonVariants`, not from this
   change.
3. **Stale generated artifacts in the repo.** `npm run generate:highlight` also rewrites
   `apps/web/src/generated/components/navigation-menu/demo/preview.ts` and
   `apps/web/src/generated/installation/manual/navigation-menu.ts`, which have been out of sync with their sources since
   before this work. Reverted to keep the diff focused.
4. **`apps/web/public/r/registry.json` is behind the package version** (`beta.99` vs `beta.100`), so
   `npm run build:registry` bumps it. Reverted for the same reason — CI owns that file.

---

## 9. Acceptance criteria (#526)

- [x] Visual design matches the shadcn/ui reference (trigger, chevron, popover alignment, caption)
- [x] All variants and sizes implemented — four heights, three icon modes, three selection modes
- [x] API follows the conventions: `z` prefix, signal inputs, OnPush, `ViewEncapsulation.None`
- [x] Demos progress simple → complex, and match the examples on the shadcn/ui page
- [x] Accessible: ARIA attributes and keyboard navigation verified, label association added via `zId`
- [x] Dark mode checked on every example
- [x] Unit tests: 8 → 33
- [x] Documentation: `doc/api.ts` covers every input with its real default (it was missing `xs`, `zMode`, and more)
