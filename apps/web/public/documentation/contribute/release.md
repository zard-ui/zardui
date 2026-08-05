```bash title="What the release job runs" copyButton
npm ci
npm run build
npm test
npm run build:registry
npx nx run zard:build
npx nx run cli:build
npx nx run mcp:build
npx nx release version <bump> --preid=beta --git-commit=false --git-tag=false
npx nx release changelog <version> --git-commit=false --git-tag=false
git tag -a "v<version>" -m "v<version>"
npm publish --provenance --access public --tag <latest|beta>
```

```bash title="Preview a release locally" copyButton
npm run release:dry-run
```
