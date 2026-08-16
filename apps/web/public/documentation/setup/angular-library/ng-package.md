```json title="projects/ui/ng-package.json" copyButton showLineNumbers
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/ui",
  "lib": {
    "entryFile": "src/public-api.ts"
  },
  "assets": [
    {
      "glob": "styles.css",
      "input": "src",
      "output": "/"
    }
  ]
}
```
