# API

## [ZardDialogService] <span class="api-type-label service">Service</span>

> The `ZardDialogService` provides methods to open and close dialogs.

| Property            | Description                                             | Type                                    | Default   |
| ------------------- | ------------------------------------------------------- | --------------------------------------- | --------- |
| `zAutofocus`        | Sets the autofocus button.                              | `'ok' \| 'cancel' \| 'auto' \| null`    | `'auto'`  |
| `zCancelIcon`       | Sets the cancel icon.                                   | `string`                                |           |
| `zCancelText`       | Sets the cancel text.                                   | `string`                                |           |
| `zClosable`         | Enables closing the dialog.                             | `boolean`                               | `true`    |
| `zContent`          | Sets the dialog content.                                | `string \| TemplateRef<T> \| Type<T>`   |           |
| `zData`             | Sets the data for the dialog.                           | `object`                                |           |
| `zDescription`      | Sets the dialog description.                            | `string`                                |           |
| `zHideFooter`       | Hides the footer.                                       | `boolean`                               | `false`   |
| `zMaskClosable`     | Enables closing the dialog by clicking on the mask.     | `boolean`                               | `true`    |
| `zOkDestructive`    | Marks the OK button as destructive.                     | `boolean`                               | `false`   |
| `zOkDisabled`       | Disables the OK button.                                 | `boolean`                               | `false`   |
| `zOkIcon`           | Sets the OK button icon.                                | `string`                                |           |
| `zOkText`           | Sets the OK button text.                                | `string \| null`                        |           |
| `zOnCancel`         | Callback for cancel action.                             | `EventEmitter<T> \| OnClickCallback<T>` | `noopFun` |
| `zOnOk`             | Callback for OK action.                                 | `EventEmitter<T> \| OnClickCallback<T>` | `noopFun` |
| `zTitle`            | Sets the dialog title.                                  | `string \| TemplateRef<T>`              |           |
| `zViewContainerRef` | View container reference for dynamic component loading. | `ViewContainerRef`                      |           |
| `zWidth`            | Sets the dialog width.                                  | `string`                                |           |
