```json title="registry.json" copyButton
{
  "$schema": "https://zardui.com/schema/registry.json",
  "schemaVersion": 1,
  "name": "@zard",
  "homepage": "https://zardui.com",
  "version": "1.0.0-beta.102",
  "items": [
    {
      "name": "core",
      "type": "registry:component",
      "files": [
        "directives/string-template-outlet/string-template-outlet.directive.ts",
        "directives/id.directive.ts",
        "provider/event-manager-plugins/zard-debounce-event-manager-plugin.ts",
        "provider/event-manager-plugins/zard-event-manager-plugin.ts",
        "provider/providezard.ts",
        "css/tailwind.css",
        "css/utilities.css",
        "index.ts"
      ],
      "icons": { "family": "lucide", "symbols": [], "tokens": [] }
    },
    {
      "name": "utils",
      "type": "registry:component",
      "basePath": "utils",
      "dependencies": ["tailwind-merge", "clsx"],
      "files": ["index.ts", "merge-classes.ts", "number.ts"],
      "icons": { "family": "lucide", "symbols": [], "tokens": [] }
    },
    {
      "name": "button",
      "type": "registry:component",
      "files": ["button.component.ts", "button.variants.ts", "index.ts"],
      "icons": { "family": "lucide", "symbols": ["lucideLoaderCircle"], "tokens": ["loader-circle"] }
    }
  ]
}
```
