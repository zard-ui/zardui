```json title="angular.json" copyButton showLineNumbers
{
  "projects": {
    "ui": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              {
                "glob": "**/*.css",
                "input": "projects/ui/src",
                "output": "/"
              }
            ]
          }
        }
      }
    }
  }
}
```

```json title="projects/ui/ng-package.json" copyButton showLineNumbers
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/ui",
  "lib": {
    "entryFile": "src/public-api.ts"
  },
  "assets": [
    {
      "glob": "**/*.css",
      "input": "src",
      "output": "/"
    }
  ]
}
```
