```bash title="Start from an issue" copyButton
git checkout master
git pull origin master
git checkout -b feat/#123-button-loading
```

```bash title="Before you push" copyButton
npx nx run-many --target=lint --p=zard,blocks --parallel
npm test
npm run build
```

```bash title="Commit — the emoji is mandatory" copyButton
git add .
git commit -m "✨ feat(button): add loading state"

# Valid
# ✨ feat(button): add loading state
# 🐛 fix(input): resolve focus bug on Safari
# 📝 docs(contribute): document the block generator
# ✨ feat(button)!: redesign the button API   <- breaking change, major bump

# Rejected by commitlint
# feat(button): add loading state             <- no emoji
# ✨ feat(button): fix                        <- subject shorter than 10 chars
# ✨ feat(button): add loading state.          <- trailing period
# ✨ Feat(button): add loading state          <- type must be lower-case
```
