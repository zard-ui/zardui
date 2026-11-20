---
title: December 2025 - provideZard() and a Private Registry
description: Major infrastructure improvements this month! We focused on developer experience with a new provider system, CLI enhancements with our own private registry, and streamlined dark-mode setup.
---

# December 2025 - provideZard() and a Private Registry

Major infrastructure improvements this month! We focused on developer experience with a new provider system, CLI enhancements with our own private registry, and streamlined dark-mode setup.

## provideZard()

New provider function for streamlined app configuration. Add event manager plugins and other Zard utilities with a single function call in your app.config.ts.

```
provideZard()
```

## Private Registry System

The CLI now uses our own private registry instead of fetching from GitHub. This brings significant performance improvements, better version control, and more reliable component installations.

## Dark Mode via CLI

Adding dark-mode support to your project is now as simple as running a single CLI command. It automatically configures everything you need.

```
npx zard-cli@latest add dark-mode
```
