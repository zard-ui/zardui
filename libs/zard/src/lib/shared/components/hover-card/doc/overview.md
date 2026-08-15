# Hover Card

Displays rich, contextual content in a floating panel when a user hovers over or focuses a trigger. Use a hover card for profile previews, link previews, and inline definitions that need more content or interaction than a tooltip.

The card opens and closes after configurable delays. It remains open while the pointer or keyboard focus moves between the trigger and the card, and closes when focus leaves the region or the user presses Escape.

## Composition

Apply `[zHoverCard]` to the trigger and provide the content through an `ng-template` containing `z-hover-card`:

```text
trigger[zHoverCard]
└── ng-template
    └── z-hover-card
```

```html
<a href="/users/zardui" [zHoverCard]="preview">@zardui</a>

<ng-template #preview>
  <z-hover-card>
    <h4 class="font-medium">ZardUI</h4>
    <p class="text-muted-foreground text-sm">Beautiful Angular components built with Tailwind CSS.</p>
  </z-hover-card>
</ng-template>
```

Use `zPlacement` to select the preferred side and `zOpenDelay` or `zCloseDelay` to customize hover intent. The overlay automatically falls back to another side when the preferred placement does not fit in the viewport.
