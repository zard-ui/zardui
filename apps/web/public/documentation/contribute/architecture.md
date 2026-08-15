```json title="apps/web/tsconfig.json" showLineNumbers copyButton
{
  "compilerOptions": {
    "paths": {
      "@blocks": ["../../libs/blocks/src/index.ts"],
      "@zard/*": ["../../libs/zard/src/lib/shared/*"],
      "@/*": ["../../libs/zard/src/lib/*"],
      "@doc/domain/*": ["./src/app/domain/*"],
      "@doc/env/*": ["./src/environments/*"],
      "@doc/shared/*": ["./src/app/shared/*"],
      "@doc/widget/*": ["./src/app/widget/*"],
      "@highlight/*": ["../../packages/highlight/src/*"],
      "@generated/*": ["./src/generated/*"]
    }
  }
}
```

```json title="libs/zard/tsconfig.json" showLineNumbers copyButton
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/lib/*"],
      "@generated/*": ["../../apps/web/src/generated/*"],
      "@highlight/*": ["../../packages/highlight/src/*"],
      "@doc/*": ["../../apps/web/src/app/*"]
    }
  }
}
```

```angular-ts title="Component anatomy — signals, CVA and mergeClasses" showLineNumbers copyButton
@Component({
  selector: 'z-button, button[z-button], a[z-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'button', '[class]': 'classes()' },
  exportAs: 'zButton',
  template: `
    <ng-content />
  `,
})
export class ZardButtonComponent {
  readonly zType = input<ZardButtonTypeVariants>('default');
  readonly zSize = input<ZardButtonSizeVariants>('default');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(buttonVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()),
  );
}
```
