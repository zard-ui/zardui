```bash title="What the command touches"
your-app/
├── components.json                          # read — aliases.services resolves the target folder
└── src/
    ├── index.html                           # updated — inline theme script added before </head>
    └── app/
        └── shared/
            ├── core/
            │   └── provider/
            │       └── providezard.ts       # updated — provideAppInitializer added as first provider
            └── services/
                ├── dark-mode.ts             # created — the ZardDarkMode service
                └── index.ts                 # created — barrel export
```
