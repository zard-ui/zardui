---
title: May 2026 - Numeric Inputs and Alert Dialog
description: A quieter month focused on form correctness. We taught the input directive to speak numbers, and we changed one dialog default that had been surprising people.
---

# May 2026 - Numeric Inputs and Alert Dialog

A quieter month focused on form correctness. We taught the input directive to speak numbers, and we changed one dialog default that had been surprising people.

## Numeric inputs keep their type

The input directive now reads and writes real numbers for `type="number"` and `type="range"`, so a signal or reactive form typed as `number` stays a number instead of being turned into a string. An empty field resolves to `null`.

## Alert Dialog no longer closes on the backdrop

`zMaskClosable` now defaults to `false` on Alert Dialog. A confirmation is meant to be answered, not dismissed by a stray click. If you relied on the old behaviour, opt back in explicitly.

```
zMaskClosable: true
```
