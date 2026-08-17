# Sidebar snippets

Reference fragments used as code-only examples on the sidebar docs page.
Each fenced block is exported as `SIDEBAR_SNIPPET_<ID>` via the snippet generator.

```css id="theming" title="styles.css" copyButton
/* The sidebar has its own colour scale, separate from the rest of the app, so it can sit on a
   different background than the page it frames. Every token is already declared by zard/ui —
   override them to theme the sidebar on its own. */
:root {
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}

/* The tokens are mapped in `@theme inline`, which is what turns them into the `bg-sidebar`,
   `text-sidebar-foreground`, `border-sidebar-border` and `ring-sidebar-ring` utilities. */
@theme inline {
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
```

```angular-html id="styling" title="Styling by state" copyButton
<!-- The sidebar publishes its state through data attributes, so anything inside it can react with
     plain Tailwind variants — no extra bindings needed. -->

<!-- 1. Hide an element once the sidebar has collapsed to icons.
        `group` lives on z-sidebar, together with data-collapsible. -->
<div z-sidebar-group class="group-data-[collapsible=icon]:hidden">
  <div z-sidebar-group-label>Projects</div>
</div>

<!-- 2. Style a sibling from the active state of its menu button.
        `peer/menu-button` lives on z-sidebar-menu-button, together with data-active. -->
<li z-sidebar-menu-item>
  <button z-sidebar-menu-button zActive>Inbox</button>
  <div z-sidebar-menu-badge class="opacity-50 peer-data-[active=true]/menu-button:opacity-100">24</div>
</li>
```

```angular-ts id="width-constants" title="sidebar.constants.ts" copyButton
// The defaults the provider writes onto its own host. Override them per provider through the
// `style` input (see the custom-width example) rather than editing these — the docs site itself
// declares a global `--sidebar-width` for its navigation, and the inline values are what keep the
// two from clashing.
export const ZARD_SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const ZARD_SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const ZARD_SIDEBAR_WIDTH = '16rem';
export const ZARD_SIDEBAR_WIDTH_MOBILE = '18rem';
export const ZARD_SIDEBAR_WIDTH_ICON = '3rem';
export const ZARD_SIDEBAR_KEYBOARD_SHORTCUT = 'b';
export const ZARD_SIDEBAR_MOBILE_BREAKPOINT = '(max-width: 767.98px)';
```

```angular-ts id="ssr-cookie" title="Reading sidebar_state on the server" copyButton
// New in the Angular port. ZardSidebarService persists the open state in the `sidebar_state`
// cookie and — this is the part shadcn has no equivalent for — reads it back on the server from
// the incoming request, so the first painted frame already has the right layout and there is no
// flash on hydration. This happens automatically; the code below is what runs inside the service.
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, REQUEST } from '@angular/core';

const document = inject(DOCUMENT);
const request = inject(REQUEST, { optional: true });
const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

// On the client the cookie comes from `document.cookie`; on the server, from the Cookie header.
const cookies = isBrowser ? document.cookie : request?.headers?.get('cookie');
const match = /(?:^|;\s*)sidebar_state=(true|false)/.exec(cookies ?? '');
const persistedOpen = match ? match[1] === 'true' : undefined;

// `undefined` means "nothing persisted yet", and the provider's zDefaultOpen decides instead.
```
