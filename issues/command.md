### 📖 Description

The `Command` component provides a command palette interface that allows users to execute actions quickly using keyboard navigation. It is useful for application-wide search, command execution, and enhancing keyboard accessibility.

### 🎨 References

- shadcn/ui: [UI](https://ui.shadcn.com/docs/components/command) | [Source Code](https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/command.tsx)
- ng-zorro: [UI](https://ng.ant.design/components/auto-complete/en) | [Source Code](https://github.com/NG-ZORRO/ng-zorro-antd/tree/master/components/auto-complete)
- ng-spartan: [UI](https://spartan.ng/components/command) | [Source Code](https://github.com/spartan-ng/spartan/tree/main/libs/ui/command)

### 📸 UI:

![Image](https://github.com/user-attachments/assets/c62fa0e6-e3ad-49b6-bb3b-25df2232e7fe)

### 📦 Expected API

#### **zCommand (Directive)**

| Name         | Type                   | Required | Description                            |
| ------------ | ---------------------- | -------- | -------------------------------------- |
| `[zCommand]` | `ZardCommandComponent` | Yes      | Used to bind nzAutocomplete components |

#### **z-command (Component)**

| Name             | Type                       | Required | Description                                    |
| ---------------- | -------------------------- | -------- | ---------------------------------------------- |
| `[zPlaceholder]` | `string`                   | No       | Used to bind the placeholder of the command    |
| `(zOnChange)`    | `Event<ZardCommandOption>` | No       | Event emitted when the selected option changes |

### **z-command-option (Component)**

| Name          | Type                       | Required | Description                                   |
| ------------- | -------------------------- | -------- | --------------------------------------------- |
| `[zValue]`    | `any`                      | Yes      | Used to bind the value of the option          |
| `[zLabel]`    | `string\|TemplateRef<any>` | Yes      | Used to bind the label of the option          |
| `[zIcon]`     | `string\|TemplateRef<any>` | No       | Used to bind the icon of the option           |
| `[zCommand]`  | `string`                   | No       | Used to bind the command of the option        |
| `[zShortcut]` | `string`                   | No       | Used to bind the shortcut of the option       |
| `[zDisabled]` | `boolean`                  | No       | Used to bind the disabled state of the option |

#### **z-command-option-group (Component)**

| Name       | Type     | Required | Description                         |
| ---------- | -------- | -------- | ----------------------------------- |
| `[zLabel]` | `string` | Yes      | Used to bind the label of the group |

#### **z-command-divider (Component)**

> No properties

### 🌟 Example

```html
<z-command>
  <z-command-option-group zLabel="Suggestions">
    <z-command-option zLabel="Calendar" zValue="1" zIcon="calendar"></z-command-option>
    <z-command-option zLabel="Search emoji" zValue="2" zIcon="smile"></z-command-option>
    <z-command-option zLabel="Calculator" zValue="3" zIcon="calculator" zDisabled></z-command-option>
  </z-command-option-group>
  <z-command-divider></z-command-divider>
  <z-command-option-group zLabel="Actions">
    <z-command-option zLabel="Copy" zValue="4" zIcon="copy" zCommand="copy" zShortcut="Ctrl+C"></z-command-option>
    <z-command-option zLabel="Paste" zValue="5" zIcon="paste" zCommand="paste" zShortcut="Ctrl+V"></z-command-option>
  </z-command-option-group>
</z-command>
```

### ✅ Acceptance Criteria

- [ ] Matches the references
- [ ] Includes unit tests
- [ ] Responsive and accessible (a11y)
- [ ] Supports dark mode
- [ ] Supports keyboard navigation for selection and execution
