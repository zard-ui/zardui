# Select

Displays a list of options for the user to pick from, triggered by a button.

Use `z-select-item` for options, `z-select-group` with `z-select-label` and `z-select-separator` for grouped lists, and `zInvalid` when the select is rendered inside a validation state.

## Composition

Use the following composition to build a `z-select`:

```text
z-select
├── z-select-label
├── z-select-item
├── z-select-group
│   ├── z-select-label
│   ├── z-select-item
│   └── z-select-item
├── z-select-separator
└── z-select-group
    ├── z-select-label
    ├── z-select-item
    └── z-select-item
```
