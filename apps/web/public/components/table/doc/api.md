# API

## [z-table] <span class="api-type-label directive">Directive</span>

> `z-table` is a directive that accepts all properties supported by a native `<table>`. It automatically styles all nested table elements (`thead`, `tbody`, `tr`, `th`, `td`, `caption`) without requiring additional directives.

To customize the table, pass the following props to the directive.

| Property | Description | Type                                | Default   |
| -------- | ----------- | ----------------------------------- | --------- |
| `zType`  | Table type  | `default \| striped \| bordered`    | `default` |
| `zSize`  | Table size  | `default \| compact \| comfortable` | `default` |

## Usage

### Basic Table

```html
<table z-table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td>Active</td>
    </tr>
  </tbody>
</table>
```

### With Data Binding

```html
<table z-table zType="striped">
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
    </tr>
  </thead>
  <tbody>
    @for (person of people; track person.id) {
    <tr>
      <td>{{ person.name }}</td>
      <td>{{ person.age }}</td>
    </tr>
    }
  </tbody>
</table>
```

## Optional Sub-Components

For more granular control, you can use individual table components:

### [z-table-header] <span class="api-type-label component">Component</span>

> `thead[z-table-header]` applies styles to table header sections.

### [z-table-body] <span class="api-type-label component">Component</span>

> `tbody[z-table-body]` applies styles to table body sections.

### [z-table-row] <span class="api-type-label component">Component</span>

> `tr[z-table-row]` applies styles to table rows.

### [z-table-head] <span class="api-type-label component">Component</span>

> `th[z-table-head]` applies styles to table header cells.

### [z-table-cell] <span class="api-type-label component">Component</span>

> `td[z-table-cell]` applies styles to table data cells.

### [z-table-caption] <span class="api-type-label component">Component</span>

> `caption[z-table-caption]` applies styles to table captions.
