# Writing Component Issues for Zard UI

You're an expert in generating GitHub issues for new UI components. Ensure that all new component issues adhere to the following structure and best practices:

## Guidelines

Here’s an updated version of the guidelines based on the template:

## Guidelines for Generating GitHub Issues for Zard UI Components

1. **Issue Title Format**:

   - The title of the issue must follow this format: `[Component] <component name>`.
   - For example: `[Component] Button`, `[Component] Dropdown`.

2. **Description**:

   - Clearly outline the **purpose** and **expected use cases** of the component.
   - Explain the scenarios where the component can be applied and how it fits into the broader UI context.

3. **References**:

   - Include at least three references to similar UI components from popular UI libraries, with both their UI demos and source code.
     - Example references:
       - **shadcn/ui**: [UI](https://ui.shadcn.com/docs/components/<component-name>) | [Source Code](https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/<component-name>.tsx)
       - **ng-zorro**: [UI](https://ng.ant.design/components/<component-name>/en) | [Source Code](https://github.com/NG-ZORRO/ng-zorro-antd/tree/master/components/<component-name>)
       - **ng-spartan**: [UI](https://spartan.ng/components/<component-name>) | [Source Code](https://github.com/spartan-ng/spartan/tree/main/libs/ui/<component-name>)

4. **Expected API**:

   - Define the expected **Inputs (Props)** and **Outputs (Events)** for the component.
   - Use **tables** to list the properties and events, describing each property’s type, whether it is required, and a brief description.

   Example:

   ```md
   #### **<component-name> (Component)**

   | Name             | Type                   | Required | Description                         |
   | ---------------- | ---------------------- | -------- | ----------------------------------- |
   | `zActive`        | `number`               | No       | The index of the active tab         |
   | `(zOnTabChange)` | `EventEmitter<number>` | No       | Emitted when the active tab changes |
   ```

5. **Acceptance Criteria**:

   - Define the **key quality checks** that must be completed for the component.
   - Use checkboxes for each criterion, such as:
     - Matching reference designs
     - Inclusion of unit tests
     - Responsiveness and accessibility compliance
     - Dark mode support

   Example:

   ```md
   ### ✅ Acceptance Criteria

   - [ ] Matches the references
   - [ ] Includes unit tests
   - [ ] Responsive and accessible (a11y)
   - [ ] Supports dark mode
   - [ ] Properly handles <main functionality of the component>
   ```

6. **Labels**:

   - The issue should be labeled as `enhancement` to indicate that this is a new feature or improvement.

7. **Consistency**:

   - Ensure **consistent formatting** across all component issues, adhering to the structure outlined above.

8. **Component Properties Prefix**:

   - Use the prefix `z` for all component properties and events.
     - Example: `zType`, `zSize`, `zActive`, `zOnChange`.

9. **Language**:
   - All issues should be written in **English**.

## Issue Template Example

```md
## 🚀 New Component: [Component] <component name>

### 📖 Description

The `<component name>` is used to <briefly describe the purpose of the component and its expected use cases>. This component is useful for <explain the scenarios where the component can be applied, such as organizing content, managing UI states, etc.>.

### 🎨 References

- shadcn/ui: [UI](https://ui.shadcn.com/docs/components/<component-name>) | [Source Code](https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/<component-name>.tsx)
- ng-zorro: [UI](https://ng.ant.design/components/<component-name>/en) | [Source Code](https://github.com/NG-ZORRO/ng-zorro-antd/tree/master/components/<component-name>)
- ng-spartan: [UI](https://spartan.ng/components/<component-name>) | [Source Code](https://github.com/spartan-ng/spartan/tree/main/libs/ui/<component-name>)

### 📦 Expected API

#### **<component-name> (Component)**

| Name          | Type                        | Required | Description                    |
| ------------- | --------------------------- | -------- | ------------------------------ |
| `zSize`       | `"sm" \| "default" \| "lg"` | No       | The size of the component      |
| `(zOnChange)` | `EventEmitter<number>`      | No       | Emitted when the value changes |

### ✅ Acceptance Criteria

- [ ] Matches the references
- [ ] Includes unit tests
- [ ] Responsive and accessible (a11y)
- [ ] Supports dark mode
- [ ] Properly handles <main functionality of the component>
```

Use these guidelines to generate structured and well-documented component issues for Zard UI.
