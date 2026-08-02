```bash title="Check your toolchain" copyButton
node --version   # must be >= 20.19.0
npm --version
git --version
```

```bash title="Fork, clone and install" copyButton
git clone https://github.com/<your-username>/zardui.git
cd zardui
npm install
```

```bash title="Start the docs site" copyButton
npm start
```

```bash title=".env" copyButton
PORT=4222
```

```bash title="Troubleshooting" copyButton
# Port already taken — pick another one
PORT=4300 npm start

# Stale Nx cache or an unexplained build failure
npx nx reset

# Broken dependency tree
rm -rf node_modules package-lock.json
npm install

# Code blocks look empty or outdated
npm run generate:highlight
```
