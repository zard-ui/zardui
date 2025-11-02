# Input Group API Reference

## Components

### z-input-group

| Input                   | Type                          | Default     | Description                                    |
| ----------------------- | ----------------------------- | ----------- | ---------------------------------------------- |
| `zSize`                 | `'sm' \| 'default' \| 'lg'`   | `'default'` | Size of the input group and all its elements   |
| `zDisabled`             | `boolean`                     | `false`     | Disable the entire input group                 |
| `zBorderless`           | `boolean`                     | `false`     | Remove borders and background for a clean look |
| `zAddOnBefore`          | `string \| TemplateRef<void>` | `undefined` | Content to display before the input            |
| `zAddOnAfter`           | `string \| TemplateRef<void>` | `undefined` | Content to display after the input             |
| `zPrefix`               | `string \| TemplateRef<void>` | `undefined` | Prefix content inside the input (left)         |
| `zSuffix`               | `string \| TemplateRef<void>` | `undefined` | Suffix content inside the input (right)        |
| `zAriaLabel`            | `string`                      | `undefined` | Accessibility label for the input group        |
| `zAriaLabelledBy`       | `string`                      | `undefined` | ID of element that labels the input group      |
| `zAriaDescribedBy`      | `string`                      | `undefined` | ID of element that describes the input group   |
| `zAddOnBeforeAriaLabel` | `string`                      | `undefined` | Accessibility label for the before addon       |
| `zAddOnAfterAriaLabel`  | `string`                      | `undefined` | Accessibility label for the after addon        |
| `zPrefixAriaLabel`      | `string`                      | `undefined` | Accessibility label for the prefix             |
| `zSuffixAriaLabel`      | `string`                      | `undefined` | Accessibility label for the suffix             |
| `class`                 | `ClassValue`                  | `''`        | Additional CSS classes                         |
