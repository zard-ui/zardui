# Model Selector

```bash tab="npm" copyButton
npx zard-cli add dropdown input-group
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add dropdown input-group
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add dropdown input-group
```

```bash tab="bun" copyButton
bunx zard-cli add dropdown input-group
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
```

```angular-html showLineNumbers copyButton
<z-input-group>
  <textarea z-textarea placeholder="Ask the agent to change your code..."></textarea>
  <z-input-group-addon zAlign="block-end">
    <button type="button" z-input-group-button zSize="sm" z-dropdown [zDropdownMenu]="modelMenu">
      GPT-5
      <ng-icon name="lucideChevronDown" />
    </button>
    <z-dropdown-menu-content #modelMenu="zDropdownMenuContent">
      <z-dropdown-menu-label>OpenAI</z-dropdown-menu-label>
      <z-dropdown-menu-radio-group [(zValue)]="model">
        <z-dropdown-menu-radio-item zValue="gpt-5">GPT-5</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="gpt-5-mini">GPT-5 mini</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>

    <button type="button" z-input-group-button zSize="sm" z-dropdown [zDropdownMenu]="effortMenu">
      Medium
      <ng-icon name="lucideChevronDown" />
    </button>
    <z-dropdown-menu-content #effortMenu="zDropdownMenuContent">
      <z-dropdown-menu-radio-group [(zValue)]="effort">
        <z-dropdown-menu-radio-item zValue="low">Low</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="medium">Medium</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="high">High</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>

    <button type="submit" z-input-group-button zVariant="default" class="ms-auto" aria-label="Send">
      <ng-icon name="lucideArrowUp" />
    </button>
  </z-input-group-addon>
</z-input-group>
```

## Streaming

```angular-ts showLineNumbers copyButton
protected submit(): void {
  this.agent.send({ text: this.text(), model: this.model(), effort: this.effort() });
}
```
