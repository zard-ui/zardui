---
title: Utilities
description: CSS utilities that ship with zard/ui for effects Tailwind has no primitive for — no JavaScript, no component to install.
---

# Utilities

CSS utilities that ship with zard/ui for effects Tailwind has no primitive for — no JavaScript, no component to install.

## Available utilities

Two so far. Each one is a class you add to an element you already have.

- [Scroll Fade](/docs/utils/scroll-fade)

Fade the edges of a scroll container, in sync with the scroll position.

- [Shimmer](/docs/utils/shimmer)

A sweeping highlight across text, for the seconds where something is being generated.

## How they work

Each one is a Tailwind v4 `@utility` definition in the library's global stylesheet, so it arrives with the `core` registry item and needs nothing else installed.

They compose with variants the way any other class does — `md:` , `dark:` and `hover:` all work — and they cost nothing at runtime: there is no directive to import, no service to inject and no listener to unsubscribe from.
