## 🚀 New Component: Toggle group

### 📖 Description

The component should receive values ​​using [zValue] or through a formControl, its function is specifically to return indicators based on what was sent to it.

example:

I passed this array to the component:

```ts
[
    {
        label: "Pen"
        value: "pen"
        checked: false
    },
    {
        label: "Pineapple"
        value: "pineapple"
        checked: true
    },
    {
        label: "Apple"
        value: "apple"
        checked: false
    },
];
```

Based on this data, I can define what will be returned and assemble the component on the screen.

### 🎨 References

- shadcn/ui: [[Link]](https://ui.shadcn.com/docs/components/toggle-group)

<img width="780" height="721" alt="Image" src="https://github.com/user-attachments/assets/54956b2a-b580-4a11-853b-e1c1b2728260" />

### 📦 Expected API

#### **Inputs (Props)**

<!-- List all the inputs (props) that the component should accept. -->

```ts
  Interface ToggleGroupValue {
    label: string;
    value: string;
    checked: boolean;
  }
```

| Name       | Type                             | Required | Description           |
| ---------- | -------------------------------- | -------- | --------------------- |
| `zValue`   | `ToggleGroupValue `              | No       | Defines Toggle value  |
| `zDefault` | `ToggleGroupValue `              | No       | Defines default value |
| `zSize`    | `"sm"      \| "md"      \| "lg"` | No       | Sets the toggle size  |

#### **Outputs (Events)**

<!-- List all the outputs (events) that the component should emit. -->

| Name       | Type                 | Description                                                          |
| ---------- | -------------------- | -------------------------------------------------------------------- |
| `onClick`  | `EventEmitter<void>` | Emitted when the toggle is clicked and return value ToggleGroupValue |
| `onHover`  | `EventEmitter<void>` | when the user hovers the mouse over it                               |
| `onChange` | `EventEmitter<void>` | Emitted when the toggle is triggered                                 |

### ✅ Acceptance Criteria

- [ ] Matches the references
- [ ] Includes unit tests
- [ ] Responsive and accessible (a11y)
- [ ] Supports dark mode
