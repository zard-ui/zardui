```json title="button.json" copyButton
{
  "name": "button",
  "type": "registry:component",
  "files": [
    {
      "name": "button.component.ts",
      "content": "import {\n  afterNextRender,\n  ChangeDetectionStrategy,\n  Component,\n..."
    },
    {
      "name": "button.variants.ts",
      "content": "import { cva, type VariantProps } from 'class-variance-authority';\n..."
    },
    {
      "name": "index.ts",
      "content": "export * from './button.component';\nexport * from './button.variants';\n"
    }
  ],
  "icons": {
    "family": "lucide",
    "symbols": ["lucideLoaderCircle"],
    "tokens": ["loader-circle"],
    "demos": {
      "symbols": ["lucideArchive", "lucideArrowLeft"],
      "tokens": ["archive", "arrow-left"]
    }
  }
}
```

```bash copyButton
npx zard-cli add button --path src/app/ui
```
