# Prompt Input

```bash tab="npm" copyButton
npx zard-cli add input-group attachment dropdown
```

```bash tab="pnpm" copyButton
pnpm dlx zard-cli add input-group attachment dropdown
```

```bash tab="yarn" copyButton
yarn dlx zard-cli add input-group attachment dropdown
```

```bash tab="bun" copyButton
bunx zard-cli add input-group attachment dropdown
```

## Usage

```angular-ts showLineNumbers copyButton
import { ZardAttachmentImports } from '@/shared/components/attachment/attachment.imports';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';
```

```angular-html showLineNumbers copyButton
<form (submit)="$event.preventDefault(); submit()">
  <z-input-group>
    <textarea
      z-textarea
      class="p-3"
      placeholder="Ask the agent to change your code..."
      [value]="text()"
      (input)="text.set($any($event.target).value)"
    ></textarea>
    <z-input-group-addon zAlign="block-end">
      <button
        type="button"
        z-input-group-button
        zVariant="outline"
        zSize="icon-sm"
        class="rounded-full"
        aria-label="Attach files"
        (click)="fileInput.click()"
      >
        <ng-icon name="lucidePlus" />
      </button>
      <button
        type="submit"
        z-input-group-button
        zVariant="default"
        zSize="icon-sm"
        class="ms-auto rounded-full"
        aria-label="Send"
        [disabled]="!canSend()"
      >
        <ng-icon name="lucideArrowUp" />
      </button>
    </z-input-group-addon>
  </z-input-group>
</form>
```

## Keyboard

```angular-html showLineNumbers copyButton
<textarea z-textarea (keydown.enter)="onEnter($any($event))"></textarea>
```

```angular-ts showLineNumbers copyButton
/** Enter sends, Shift+Enter adds a line. */
protected onEnter(event: KeyboardEvent): void {
  if (event.shiftKey) return;
  event.preventDefault();
  this.submit();
}
```

## Streaming

```angular-ts showLineNumbers copyButton
protected submit(): void {
  this.agent.send({ text: this.text(), files: this.fileInput().nativeElement.files });
}
```
