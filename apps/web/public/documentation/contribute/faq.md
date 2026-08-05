```bash title="Fix a rejected commit" copyButton
# Rewrite the message of the last commit — never use --no-verify
git commit --amend -m "✨ feat(button): add loading state"
```

```bash title="Code blocks are empty or stale" copyButton
npm run generate:highlight
git add apps/web/src/generated
```

```bash title="A new route is missing from the prerender list" copyButton
node apps/web/update-routes.mjs
git add apps/web/prerender-routes.txt
```

```bash title="Reset a confusing build" copyButton
npx nx reset
rm -rf node_modules package-lock.json
npm install
npm run build
```
