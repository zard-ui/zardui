# Alert Dialog API

Configuration options for creating alert dialogs.

| Property            | Type                                      | Default      | Description                                       |
| ------------------- | ----------------------------------------- | ------------ | ------------------------------------------------- |
| `zTitle`            | `string \| TemplateRef<T>`                | -            | Dialog title text or template                     |
| `zDescription`      | `string`                                  | -            | Dialog description/body text                      |
| `zContent`          | `string \| TemplateRef<T> \| Type<T>`     | -            | Custom content component, template, or HTML       |
| `zIcon`             | `string`                                  | -            | Icon class name (e.g., Lucide icon)               |
| `zOkText`           | `string \| null`                          | `'Continue'` | OK button text, `null` to hide button             |
| `zCancelText`       | `string \| null`                          | `'Cancel'`   | Cancel button text, `null` to hide button         |
| `zOkDestructive`    | `boolean`                                 | `false`      | Whether OK button should have destructive styling |
| `zOkDisabled`       | `boolean`                                 | `false`      | Whether OK button should be disabled              |
| `zType`             | `'default' \| 'destructive' \| 'warning'` | `'default'`  | Dialog variant styling                            |
| `zMaskClosable`     | `boolean`                                 | `false`      | Whether clicking outside closes the dialog        |
| `zClosable`         | `boolean`                                 | `true`       | Whether dialog can be closed                      |
| `zWidth`            | `string`                                  | -            | Custom width (e.g., '400px', '50%')               |
| `zCustomClasses`    | `ClassValue`                              | -            | Additional CSS classes to apply                   |
| `zOnOk`             | `EventEmitter<T> \| OnClickCallback<T>`   | -            | OK button click handler                           |
| `zOnCancel`         | `EventEmitter<T> \| OnClickCallback<T>`   | -            | Cancel button click handler                       |
| `zData`             | `object`                                  | -            | Data to pass to custom content components         |
| `zViewContainerRef` | `ViewContainerRef`                        | -            | View container for rendering custom content       |
