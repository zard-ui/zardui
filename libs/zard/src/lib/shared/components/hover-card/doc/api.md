# API

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

## [zHoverCard]

> Opens rich content in a floating panel when its trigger is hovered or focused.

| Input           | Description                                | Type                                     | Default    |
| --------------- | ------------------------------------------ | ---------------------------------------- | ---------- |
| `[zHoverCard]`  | Template rendered inside the hover card    | `TemplateRef<void>`                      | Required   |
| `[zPlacement]`  | Preferred position relative to the trigger | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` |
| `[zOpenDelay]`  | Delay in milliseconds before opening       | `number`                                 | `700`      |
| `[zCloseDelay]` | Delay in milliseconds before closing       | `number`                                 | `300`      |
| `[zVisible]`    | Controls visibility programmatically       | `boolean`                                | `false`    |

| Output             | Description                         | Payload   |
| ------------------ | ----------------------------------- | --------- |
| `(zVisibleChange)` | Emitted when the visibility changes | `boolean` |

## z-hover-card

> Wraps and styles the content displayed by `[zHoverCard]`.

| Input     | Description        | Type         | Default |
| --------- | ------------------ | ------------ | ------- |
| `[class]` | Custom CSS classes | `ClassValue` | `''`    |
