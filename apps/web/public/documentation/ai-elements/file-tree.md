# File Tree

```bash tab="npm" copyButton
npx zard-cli add collapsible button
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add collapsible button
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add collapsible button
```

```bash tab="bun" copyButton
bunx zard-cli add collapsible button
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
```

```angular-html showLineNumbers copyButton
<ng-template #tree let-node>
  @if (node.type === 'folder') {
    <z-collapsible zOpen>
      <button type="button" z-button z-collapsible-trigger zType="ghost" zSize="sm" class="group w-full justify-start">
        <ng-icon name="lucideChevronRight" class="transition-transform group-aria-expanded:rotate-90" />
        <ng-icon name="lucideFolder" />
        {{ node.name }}
      </button>
      <z-collapsible-content>
        <div class="ms-4 flex flex-col">
          @for (child of node.children; track child.path) {
            <ng-container *ngTemplateOutlet="tree; context: { $implicit: child }" />
          }
        </div>
      </z-collapsible-content>
    </z-collapsible>
  } @else {
    <button type="button" z-button zType="ghost" zSize="sm" class="w-full justify-start" (click)="select(node.path)">
      <ng-icon name="lucideFile" />
      {{ node.name }}
    </button>
  }
</ng-template>
```
