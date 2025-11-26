# API Reference

[z-button-group] Component

| Property       | Description | Type                     | Default      |
| -------------- | ----------- | ------------------------ | ------------ |
| `zOrientation` | Orientation | `horizontal \| vertical` | `horizontal` |

[z-button-group-divider] Component

| Property       | Description                                                                  | Type                     | Default |
| -------------- | ---------------------------------------------------------------------------- | ------------------------ | ------- |
| `zOrientation` | Override for divider orientation, by default it uses the parents orientation | `horizontal \| vertical` | `null`  |

[z-button-group-text] Directive

The `ZardButtonGroupTextDirective` applies styles text elements, so that they conform with the rest of the group, for example a label.

```ts
@Component({
  selector: 'z-example',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardButtonGroupTextDirective, ZardIconComponent, ZardInputDirective],
  template: `
    <z-button-group>
      <label z-button-group-text for="search">Search</label>
      <input z-input id="search" />
      <button z-button zType="outline"><i z-icon zType="search"></i></button>
    </z-button-group>
  `,
})
export class ExampleComponent {}
```
