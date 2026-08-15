---
title: Forms
description: Build forms with Angular and zard/ui.
---

# Forms

Build forms with Angular and zard/ui.

## Pick Your Approach

Angular ships three ways to build a form. Start by picking the one you want to use, then follow the guide to learn how to build accessible, validated forms with the zard/ui components you already have.

- [Signal Forms](/docs/forms/signal-forms)
- [Reactive Forms](/docs/forms/reactive-forms)
- [Template-driven Forms](/docs/forms/template-driven-forms)

## Which one should I use?

All three build on the same zard/ui primitives — `field / input / select / checkbox` and friends. What changes is where the state and the validation rules live.

| Approach | State lives in | Best for |
| --- | --- | --- |
| Signal Forms | A writable signal you own | New code on Angular 21+, signal-based apps |
| Reactive Forms | `FormGroup` / `FormControl` | Dynamic forms, complex validation, existing codebases |
| Template-driven Forms | A plain object bound with `ngModel` | Short forms with a handful of fields |

If you are starting fresh and already on Angular 21, go with Signal Forms. If you need something that has been stable for years, Reactive Forms is the safe choice.
