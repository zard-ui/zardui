# 🏷️ CLI Version-Based Component Fetching

This document explains how ZardUI CLI ensures component compatibility through version-based fetching.

## 🎯 Problem Statement

When users install a specific version of `@ngzard/ui`, they expect:
1. Components to be compatible with that version
2. No breaking changes from newer versions
3. Consistent behavior across installations

## ✅ Solution: Tag-Based Component Fetching

### How It Works

```mermaid
graph LR
    A[User Installs] --> B[@ngzard/ui@1.2.3]
    B --> C[CLI Reads Version]
    C --> D[Fetches from Tag v1.2.3]
    D --> E[Components Match Version]
```

### Step by Step

1. **User Installation**
   ```bash
   npm install @ngzard/ui@1.2.3
   ```

2. **CLI Detects Version**
   ```typescript
   // packages/cli/src/utils/fetch-component.ts
   function getCliVersion(): string {
     const packageJson = JSON.parse(readFileSync('../../package.json', 'utf8'));
     return packageJson.version; // "1.2.3"
   }
   ```

3. **Constructs GitHub URL**
   ```typescript
   const version = getCliVersion(); // "1.2.3"
   const ref = `v${version}`;       // "v1.2.3"
   const url = `https://raw.githubusercontent.com/zard-ui/zardui/v1.2.3/libs/zard/...`;
   ```

4. **Fetches Component**
   ```bash
   ngzard add button
   # Fetches from: https://raw.githubusercontent.com/zard-ui/zardui/v1.2.3/libs/zard/src/lib/components/button/button.component.ts
   ```

## 🔄 Unified Versioning

Both packages **always have the same version**:

```json
{
  "libs/zard/package.json": {
    "version": "1.2.3"
  },
  "packages/cli/package.json": {
    "version": "1.2.3"
  }
}
```

**Why?**
- Ensures library and CLI are always in sync
- Users can trust version numbers
- Simplifies version management

**Configuration:** [`nx.json`](../nx.json)
```json
{
  "release": {
    "projectsRelationship": "fixed"
  }
}
```

## 📦 Version Sync Mechanism

### Automatic Version Detection

The CLI reads its version directly from `package.json` at runtime:

**Before (❌ Hardcoded):**
```typescript
// packages/cli/src/constants/app.constants.ts
export const APP_VERSION = '1.0.0-beta.11'; // ❌ Gets outdated!
```

**After (✅ Dynamic):**
```typescript
// packages/cli/src/constants/app.constants.ts
function getAppVersion(): string {
  const packageJson = JSON.parse(readFileSync('../../package.json', 'utf8'));
  return packageJson.version; // ✅ Always correct!
}

export const APP_VERSION = getAppVersion();
```

## 🏷️ Git Tag Format

Tags use the format `v{version}`:

```bash
v1.0.0
v1.2.3
v2.0.0-beta.1
```

**Why this format?**
- ✅ Standard semantic versioning
- ✅ Compatible with npm version format
- ✅ Easy to parse and validate
- ✅ GitHub Release best practice

## 🔍 Examples

### Example 1: Installing Latest Version

```bash
# User installs latest
npm install @ngzard/ui@latest

# CLI detects version: 1.5.0
# Fetches components from: v1.5.0 tag
```

### Example 2: Installing Specific Version

```bash
# User installs specific version
npm install @ngzard/ui@1.2.3

# CLI detects version: 1.2.3
# Fetches components from: v1.2.3 tag
```

### Example 3: Development Mode

```bash
# During development (no matching tag)
# CLI falls back to: master branch
```

## 🎯 Benefits

### For Users
- ✅ **Predictable**: Components always match installed version
- ✅ **Safe**: No breaking changes from master branch
- ✅ **Reproducible**: Same version = same components

### For Maintainers
- ✅ **Simple**: One version for everything
- ✅ **Automatic**: No manual updates needed
- ✅ **Clear**: Easy to understand and debug

## 🔧 Implementation Files

### Core Files
- [`packages/cli/src/utils/fetch-component.ts`](../packages/cli/src/utils/fetch-component.ts) - Component fetching logic
- [`packages/cli/src/constants/app.constants.ts`](../packages/cli/src/constants/app.constants.ts) - Version detection
- [`nx.json`](../nx.json) - Unified versioning config

### Related Documentation
- [Release Automation](../RELEASE_AUTOMATION.md) - How releases work
- [Quick Start](../QUICK_START_RELEASE.md) - Getting started guide

## 🧪 Testing

### Test Version Detection

```bash
# Build CLI
npx nx build cli

# Check version
./packages/cli/dist/index.js --version
# Should output: 1.0.0-beta.20 (or current version)
```

### Test Component Fetching

```bash
# Install CLI locally
cd packages/cli
npm link

# Use CLI in test project
cd /path/to/test-project
ngzard add button

# Verify: Should fetch from tag matching installed version
```

## ⚠️ Important Notes

1. **Tags Must Exist**: The version tag must exist in GitHub for component fetching to work
2. **Fallback to Master**: If tag doesn't exist, CLI falls back to master branch
3. **Version Sync**: Always use `npm run release` to ensure versions stay in sync
4. **No Manual Updates**: Never manually update version numbers - use automated release

## 📚 Related Concepts

- **Semantic Versioning**: https://semver.org/
- **Git Tags**: https://git-scm.com/book/en/v2/Git-Basics-Tagging
- **Nx Release**: https://nx.dev/features/manage-releases
