# Angular API

The conventions every zard/ui component follows, and that code written around them should follow too.

## Contents

- Standalone with `imports`
- OnPush, always
- `ViewEncapsulation.None`
- Signal inputs, not decorators
- Boolean inputs are coerced
- The `z` prefix
- Selectors: element and attribute
- Composite components import their array
- Host bindings, not template class strings
- Generated files are output

---

## Standalone with `imports`

There are no NgModules. Everything a template uses is declared in `imports`.

**Incorrect:**

```angular-ts
@NgModule({
  declarations: [ProfileCard],
  imports: [CommonModule, ZardCardModule],
})
export class ProfileModule {}
```

**Correct:**

```angular-ts
@Component({
  selector: 'app-profile-card',
  imports: [ZardCardImports, ZardButtonComponent],
  template: `
    …
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCard {}
```

---

## OnPush, always

Every component in the library is `ChangeDetectionStrategy.OnPush`, and components built on them should be too — signals make it the default-correct choice, and `Default` next to `OnPush` children is how stale views appear.

**Incorrect:**

```angular-ts
@Component({
  selector: 'app-dashboard',
  template: `
    …
  `,
})
export class Dashboard {}
```

**Correct:**

```angular-ts
@Component({
  selector: 'app-dashboard',
  template: `
    …
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
```

---

## `ViewEncapsulation.None`

Library-wide. Component styles come from Tailwind utilities, not scoped stylesheets, and emulated encapsulation would add attribute selectors for nothing. The single `Emulated` in the library (the accordion parent) is a legacy exception — do not copy it.

```angular-ts
@Component({
  // …
  encapsulation: ViewEncapsulation.None,
})
```

---

## Signal inputs, not decorators

**Incorrect:**

```angular-ts
export class ZardBadgeComponent {
  @Input() zType: 'default' | 'secondary' = 'default';
  @Output() dismissed = new EventEmitter<void>();
}
```

**Correct:**

```angular-ts
export class ZardBadgeComponent {
  readonly zType = input<ZardBadgeTypeVariants>('default');
  readonly dismissed = output<void>();
}
```

Two-way state that persists (form values) uses `model()`. A mandatory value uses `input.required<T>()`.

---

## Boolean inputs are coerced

Without the transform, `<button z-button zDisabled>` passes the string `""`, which is falsy — the attribute silently does nothing.

**Incorrect:**

```angular-ts
readonly zDisabled = input(false);
```

**Correct:**

```angular-ts
import { booleanAttribute } from '@angular/core';

readonly zDisabled = input(false, { transform: booleanAttribute });
```

---

## The `z` prefix

Every input that drives a variant or a behaviour carries it. `class` is the only unprefixed input on any component, and it is the pass-through for layout.

**Incorrect:**

```angular-ts
readonly type = input<'default' | 'outline'>('default');
readonly size = input<'sm' | 'lg'>('sm');
```

**Correct:**

```angular-ts
readonly zType = input<ZardButtonTypeVariants>('default');
readonly zSize = input<ZardButtonSizeVariants>('default');
readonly class = input<ClassValue>('');
```

---

## Selectors: element and attribute

Components declare an element selector, an attribute selector, or both — and the attribute form is often hosted on a native tag, so that the native element keeps its own semantics and form participation.

```angular-html
<!-- element -->
<z-card>…</z-card>
<z-select zPlaceholder="Pick one">…</z-select>

<!-- attribute on the native tag -->
<button z-button zType="outline">Save</button>
<a z-button zType="link" href="/docs">Docs</a>
<input z-input placeholder="Email" />
<textarea z-textarea></textarea>
```

**Incorrect:**

```angular-html
<z-button (click)="save()">Save</z-button>
<z-input [(ngModel)]="email" />
```

Use the selector the component actually declares — read its `@Component` or its documentation page. Guessing produces markup that renders as an unknown element with no error.

---

## Composite components import their array

Composite components export a `Zard<Name>Imports` const array. Import that, not the individual classes.

**Incorrect:**

```angular-ts
imports: [ZardCardComponent, ZardCardHeaderComponent, ZardCardTitleComponent, ZardCardContentComponent],
```

**Correct:**

```angular-ts
import { ZardCardImports } from '@/shared/components/card/card.imports';

imports: [ZardCardImports],
```

The alias prefix comes from `aliases.components` in `components.json` — `@/shared/components` is the default, not a constant.

---

## Host bindings, not template class strings

Classes are computed once and bound on the host. Assembling them in the template splits the definition across two places and defeats `tailwind-merge`.

**Incorrect:**

```angular-ts
template: `<div [class]="'rounded-lg border p-4 ' + (active ? 'bg-accent' : '')">…</div>`,
```

**Correct:**

```angular-ts
protected readonly classes = computed(() => mergeClasses(cardVariants({ zSize: this.zSize() }), this.class()));

// @Component: host: { 'data-slot': 'card', '[class]': 'classes()' }
```

---

## Generated files are output

In the zard repository, `apps/web/src/generated/**` and `apps/web/public/r/*.json` are produced by build scripts. Editing them looks like it works until the next build erases it.

Regenerate instead:

```bash
npm run generate:highlight    # code blocks from public/documentation/**/*.md
npm run build:registry        # public/r/*.json from the library source
```
