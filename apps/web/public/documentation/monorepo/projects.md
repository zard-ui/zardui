```bash title="Terminal"
   ✔  project type  …  Nx

◆  Which app should receive the components?
   ❯  web       apps/web
      admin     apps/admin
      storefront  apps/storefront
   Its app.config.ts and global CSS are the ones init configures.

   ↑/↓ choose    enter confirm    esc back
```

```bash title="Terminal" copyButton
# Both answers up front — required in CI, where nobody can be asked.
npx zard-cli@latest init --type nx --project admin --yes
```
