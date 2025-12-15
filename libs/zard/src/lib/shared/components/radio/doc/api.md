# Radio API

## Inputs

| Name       | Type         | Default        | Description                        |
| ---------- | ------------ | -------------- | ---------------------------------- |
| `class`    | `ClassValue` | `''`           | Additional CSS classes             |
| `disabled` | `boolean`    | `false`        | Whether the radio is disabled      |
| `name`     | `string`     | `'radio'`      | Name attribute for the radio group |
| `zId`      | `string`     | auto-generated | ID attribute for the radio         |
| `value`    | `unknown`    | `null`         | Value of the radio button          |

## Outputs

| Name          | Type                    | Description                        |
| ------------- | ----------------------- | ---------------------------------- |
| `radioChange` | `EventEmitter<boolean>` | Emits when radio selection changes |
