# API Reference

[z-button-group] Component

The `ZardButtonGroupComponent` component is a container that groups related buttons together with consistent styling.

| Property       | Description | Type                     | Default      |
| -------------- | ----------- | ------------------------ | ------------ |
| `zOrientation` | Orientation | `horizontal \| vertical` | `horizontal` |

```ts
@Component({
  selector: 'z-example',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardIconComponent],
  template: `
    <z-button-group>
      <button z-button>Button</button>
      <button z-button zType="outline"><i z-icon zType="arrow-up"></i></button>
    </z-button-group>
  `,
})
export class ExampleComponent {}
```

Nest multiple button groups to create complex layouts with spacing. See the nested example for more details.

```ts
@Component({
  selector: 'z-example',
  imports: [ZardButtonGroupComponent],
  template: `
    <z-button-group>
      <z-button-group />
      <z-button-group />
    </z-button-group>
  `,
})
export class ExampleComponent {}
```

[z-button-group-divider] Component

The `ZardButtonGroupDividerComponent` component visually divides buttons within a group. Under the hood it's simply a divider with extra styles, which is also linked to the parent groups orientation.

| Property       | Description                                                                  | Type                     | Default |
| -------------- | ---------------------------------------------------------------------------- | ------------------------ | ------- |
| `zOrientation` | Override for divider orientation, by default it uses the parents orientation | `horizontal \| vertical` | `null`  |

```ts
@Component({
  selector: 'z-example',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardButtonGroupDividerComponent],
  template: `
    <z-button-group>
      <button z-button>Button</button>
      <z-button-group-divider />
      <button z-button>Button 2</button>
    </z-button-group>
  `,
})
export class ExampleComponent {}
```

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
