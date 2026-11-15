# Confirmation

```bash tab="npm" copyButton
npx zard-cli add item button
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add item button
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add item button
```

```bash tab="bun" copyButton
bunx zard-cli add item button
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';
```

```angular-html showLineNumbers copyButton
<div z-item zVariant="outline" zSize="sm">
  <div z-item-media zVariant="icon"><ng-icon name="lucideTerminal" /></div>
  <div z-item-content>
    <div z-item-title>Run {{ command }}?</div>
    <p z-item-description>The command runs in this project.</p>
  </div>
  <div z-item-actions>
    <button type="button" z-button zType="outline" zSize="sm" (click)="deny()">Deny</button>
    <button type="button" z-button zSize="sm" (click)="approve()">Approve</button>
  </div>
</div>
```

## Streaming

```angular-ts showLineNumbers copyButton
protected approve(): void {
  this.agent.respondToApproval({ toolCallId: this.call().id, approved: true });
}

protected deny(): void {
  this.agent.respondToApproval({ toolCallId: this.call().id, approved: false });
}
```
