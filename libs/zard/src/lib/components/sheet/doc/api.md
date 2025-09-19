# Sheet API Reference

## Service

### ZardSheetService

Service for creating and managing sheet overlays.

**Methods:**

- `create(config: ZardSheetOptions): ZardSheetRef` - Creates and opens a sheet

## Configuration Options

### ZardSheetOptions

| Input               | Type                                     | Default    | Description                                       |
| ------------------- | ---------------------------------------- | ---------- | ------------------------------------------------- |
| `zTitle`            | `string \| TemplateRef<T>`               | -          | Sheet title text or template                      |
| `zDescription`      | `string`                                 | -          | Sheet description/body text                       |
| `zContent`          | `string \| TemplateRef<T> \| Type<T>`    | -          | Custom content component, template, or HTML       |
| `zSide`             | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'`   | Position of the sheet on screen                   |
| `zWidth`            | `string`                                 | -          | Custom width (e.g., '400px', '50%')               |
| `zHeight`           | `string`                                 | -          | Custom height (e.g., '80vh', '500px')             |
| `zOkText`           | `string \| null`                         | `'OK'`     | OK button text, `null` to hide button             |
| `zCancelText`       | `string \| null`                         | `'Cancel'` | Cancel button text, `null` to hide button         |
| `zOkIcon`           | `string`                                 | -          | OK button icon class name                         |
| `zCancelIcon`       | `string`                                 | -          | Cancel button icon class name                     |
| `zOkDestructive`    | `boolean`                                | `false`    | Whether OK button should have destructive styling |
| `zOkDisabled`       | `boolean`                                | `false`    | Whether OK button should be disabled              |
| `zHideFooter`       | `boolean`                                | `false`    | Whether to hide the footer with action buttons    |
| `zMaskClosable`     | `boolean`                                | `true`     | Whether clicking outside closes the sheet         |
| `zClosable`         | `boolean`                                | `true`     | Whether sheet can be closed                       |
| `zCustomClasses`    | `string`                                 | -          | Additional CSS classes to apply                   |
| `zOnOk`             | `EventEmitter<T> \| OnClickCallback<T>`  | -          | OK button click handler                           |
| `zOnCancel`         | `EventEmitter<T> \| OnClickCallback<T>`  | -          | Cancel button click handler                       |
| `zData`             | `object`                                 | -          | Data to pass to custom content components         |
| `zViewContainerRef` | `ViewContainerRef`                       | -          | View container for rendering custom content       |

## Sheet Reference

### ZardSheetRef

Reference to a sheet instance, returned by `ZardSheetService.create()`.

**Properties:**

- `componentInstance: T | null` - Reference to the content component

**Methods:**

- `close(result?: R): void` - Closes the sheet

## Component

### ZardSheetComponent

| Output            | Type                 | Description                           |
| ----------------- | -------------------- | ------------------------------------- |
| `okTriggered`     | `EventEmitter<void>` | Emitted when OK button is clicked     |
| `cancelTriggered` | `EventEmitter<void>` | Emitted when Cancel button is clicked |
