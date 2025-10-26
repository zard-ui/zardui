## 1.0.0-beta.25 (2025-10-24)

### 📦 Code Refactoring

- **cli:** modularize commands and reorganize structure
  - Split init command (294 lines) into 6 focused modules
  - Split add command (151 lines) into 4 focused modules
  - Reorganized registry and themes into core/ directory
  - Separated logic from data for better maintainability

### ✨ Features

- **cli:** add @cli path alias for cleaner imports
  - Configured TypeScript path mapping with @cli/* alias
  - Added tsc-alias to build pipeline for alias resolution
  - Updated all imports to use new path alias

### 🐛 Bug Fixes

- **cli:** add icon component dependencies to registry
  - Fixed 17 components that were crashing due to missing icon dependency
  - Updated registry with proper icon dependencies for: accordion, alert, avatar, breadcrumb, button, calendar, checkbox, combobox, command, date-picker, dialog, pagination, select, sheet, layout, tabs, toggle-group

## 1.0.0-beta.24 (2025-10-24)

### 🐛 Bug Fixes

- **release:** fix version mismatch in beta.23 npm publish

## 1.0.0-beta.23 (2025-10-24)

### 📦 Code Refactoring

- **core:** changed icon packs to lucide-angular ([#274](https://github.com/zard-ui/zardui/pull/274))
- **tabs:** improvements pr 278 ([#280](https://github.com/zard-ui/zardui/pull/280))

### 🐛 Bug Fixes

- **ci:** update package.json version from tag before build in release workflow
- **radio:** improve label positioning and accessibility with setDisabledState
- **tabs:** vertical tabs placement ([#278](https://github.com/zard-ui/zardui/pull/278))
- **memory:** removing memory leaks ([#277](https://github.com/zard-ui/zardui/pull/277))
- **tabs:** tabgroup memory leak fix and performance optimization ([#273](https://github.com/zard-ui/zardui/pull/273))

### ✨ Features

- **ssr:** adding ssr support to the documentation ([#269](https://github.com/zard-ui/zardui/pull/269))
- **seo:** adding dynamic meta tags for doc pages ([#266](https://github.com/zard-ui/zardui/pull/266))
- **firebase:** adding apphosting.yaml configuration to firebase app hosting

### 🔧 Chores

- **release:** convert auto-release to manual trigger
- **firebase:** export Express app for Firebase App Hosting

### ❤️ Thank You

- Matheus Ribeiro
- Luiz Gomes
- mikij
- ZardUI Team

## 1.0.0-beta.22 (2025-10-17)

### 🐛 Bug Fixes

- **cli:** add missing component dependencies in registry ([#264](https://github.com/zard-ui/zardui/pull/264))

### ❤️ Thank You

- Samuel Rizzon

## 1.0.0-beta.21 (2025-10-17)

### ✨ Features

- implemeting style theme at the library (20) ([5eea737](https://github.com/zard-ui/zardui/commit/5eea737))
- add button component ([2028c95](https://github.com/zard-ui/zardui/commit/2028c95))
- create dynamic documentation ([968311e](https://github.com/zard-ui/zardui/commit/968311e))
- add card component documentation and examples ([0d5cff9](https://github.com/zard-ui/zardui/commit/0d5cff9))
- enhance layout and scrolling behavior in the application ([3394f78](https://github.com/zard-ui/zardui/commit/3394f78))
- add checkbox component ([c0aa890](https://github.com/zard-ui/zardui/commit/c0aa890))
- defining icon and font-family patterns ([beca0bd](https://github.com/zard-ui/zardui/commit/beca0bd))
- upgrading dynamic documentation ([f545631](https://github.com/zard-ui/zardui/commit/f545631))
- updating checkbox disabled to use input signals ([c17166c](https://github.com/zard-ui/zardui/commit/c17166c))
- add disabled state support for checkbox component ([91912b4](https://github.com/zard-ui/zardui/commit/91912b4))
- enhance checkbox component with improved accessibility and styling ([672f9cb](https://github.com/zard-ui/zardui/commit/672f9cb))
- update footer text to enhance branding and open source visibility ([3495f1a](https://github.com/zard-ui/zardui/commit/3495f1a))
- adding firebase deploy configuration on the app ([4701c32](https://github.com/zard-ui/zardui/commit/4701c32))
- add badge component documentation and demos ([#39](https://github.com/zard-ui/zardui/pull/39))
- adding environment variables on the doc ([bf2b55a](https://github.com/zard-ui/zardui/commit/bf2b55a))
- updating layout components for be dynamic ([6021171](https://github.com/zard-ui/zardui/commit/6021171))
- updating home sections for the project alpha ([6b196c2](https://github.com/zard-ui/zardui/commit/6b196c2))
- (doc) add banner component ([33182b4](https://github.com/zard-ui/zardui/commit/33182b4))
- add switch component ([#46](https://github.com/zard-ui/zardui/pull/46), [#49](https://github.com/zard-ui/zardui/issues/49))
- adding dropdown component ([#59](https://github.com/zard-ui/zardui/pull/59))
- update accordion component availability to true ([05480e4](https://github.com/zard-ui/zardui/commit/05480e4))
- change default component from 'alert' to 'accordion' ([ca0a826](https://github.com/zard-ui/zardui/commit/ca0a826))
- updating design and adding new plugins from prism.js ([1b6f6de](https://github.com/zard-ui/zardui/commit/1b6f6de))
- doc mobile nav (improvised) ([e724fb9](https://github.com/zard-ui/zardui/commit/e724fb9))
- adding new plugins and expand feature in markdown component ([54cc49c](https://github.com/zard-ui/zardui/commit/54cc49c))
- add dialog component ([#89](https://github.com/zard-ui/zardui/pull/89))
- add breadcrumb component ([#95](https://github.com/zard-ui/zardui/pull/95))
- updating dev pipeline credentials params ([1c93716](https://github.com/zard-ui/zardui/commit/1c93716))
- updating project social medias ([64ad035](https://github.com/zard-ui/zardui/commit/64ad035))
- add progress bar component ([b561119](https://github.com/zard-ui/zardui/commit/b561119))
- add menu component ([#197](https://github.com/zard-ui/zardui/pull/197))
- creating the change.log page ([#232](https://github.com/zard-ui/zardui/pull/232))
- add cli support to multi-runners ([#234](https://github.com/zard-ui/zardui/pull/234))
- add theme selection for the cli ([#235](https://github.com/zard-ui/zardui/pull/235))
- auto-detect prerelease versions and increment beta number ([2a5ddce](https://github.com/zard-ui/zardui/commit/2a5ddce))
- **alert:** add alert component ([#53](https://github.com/zard-ui/zardui/pull/53))
- **card:** add header and body components ([#41](https://github.com/zard-ui/zardui/pull/41))
- **divider:** add divider component ([#78](https://github.com/zard-ui/zardui/pull/78))
- **empty:** add empty component ([#224](https://github.com/zard-ui/zardui/pull/224))
- **input:** create input and textarea components ([cd5b180](https://github.com/zard-ui/zardui/commit/cd5b180))
- **input-group:** add input-group component ([#212](https://github.com/zard-ui/zardui/pull/212))
- **layout:** add layout component system with header, footer, sidebar, and content ([#240](https://github.com/zard-ui/zardui/pull/240))
- **loader:** add loader component ([#50](https://github.com/zard-ui/zardui/pull/50))
- **radio:** add radio component ([#51](https://github.com/zard-ui/zardui/pull/51))
- **release:** implement automated semantic versioning and release system ([#263](https://github.com/zard-ui/zardui/pull/263))
- **sheet:** add sheet component ([#220](https://github.com/zard-ui/zardui/pull/220))
- **tooltip:** create tooltip component ([#69](https://github.com/zard-ui/zardui/pull/69))

### 🐛 Bug Fixes

- just to release the v0.0.2 ([035a640](https://github.com/zard-ui/zardui/commit/035a640))
- trying to release v0.0.2 ([4243c11](https://github.com/zard-ui/zardui/commit/4243c11))
- test ([824600c](https://github.com/zard-ui/zardui/commit/824600c))
- change package name ([bf60a99](https://github.com/zard-ui/zardui/commit/bf60a99))
- try to release a version by CI ([2fa26a3](https://github.com/zard-ui/zardui/commit/2fa26a3))
- try to release a version by CI ([ec3a144](https://github.com/zard-ui/zardui/commit/ec3a144))
- changing the icons pattern entire application ([7fc1d0d](https://github.com/zard-ui/zardui/commit/7fc1d0d))
- enhance accessibility for checkbox ([f68a14e](https://github.com/zard-ui/zardui/commit/f68a14e))
- dynamic anchor component with enhanced scrolling behavior ([09cbd1d](https://github.com/zard-ui/zardui/commit/09cbd1d))
- destructive button color on dark mode ([c70a0a1](https://github.com/zard-ui/zardui/commit/c70a0a1))
- removing z-icon import ([1beae3e](https://github.com/zard-ui/zardui/commit/1beae3e))
- fixing automatic deploy to dev ([d1a6628](https://github.com/zard-ui/zardui/commit/d1a6628))
- fixing automatic deploy to dev ([#38](https://github.com/zard-ui/zardui/pull/38))
- production flag ([14b225c](https://github.com/zard-ui/zardui/commit/14b225c))
- updating discord invite url ([f38e0da](https://github.com/zard-ui/zardui/commit/f38e0da))
- updating dev pipeline with new google credentials ([f3766f8](https://github.com/zard-ui/zardui/commit/f3766f8))
- merging conflicts ([8a359bf](https://github.com/zard-ui/zardui/commit/8a359bf))
- updating pipelines for all environments with node 20 ([74653ed](https://github.com/zard-ui/zardui/commit/74653ed))
- Dialog import ([bf0a729](https://github.com/zard-ui/zardui/commit/bf0a729))
- merge state signals to prevent de-sync ([#198](https://github.com/zard-ui/zardui/pull/198))
- dropdown-trigger and tooltip.ts with wrong access-modifier ([#236](https://github.com/zard-ui/zardui/pull/236))
- github username in funding.yml ([b0d6c1a](https://github.com/zard-ui/zardui/commit/b0d6c1a))
- failing unit test for Sheet component ([#244](https://github.com/zard-ui/zardui/pull/244))
- popover to remain open when scrolling ([#248](https://github.com/zard-ui/zardui/pull/248))
- weird black border instead of a gray border ([#254](https://github.com/zard-ui/zardui/pull/254))
- remove conflicting flag from nx release command ([7ea4e1e](https://github.com/zard-ui/zardui/commit/7ea4e1e))
- handle first release and prevent interactive prompts in CI ([5553884](https://github.com/zard-ui/zardui/commit/5553884))
- pass bump type to nx release and add detailed logging ([96d324e](https://github.com/zard-ui/zardui/commit/96d324e))
- **button:** clarify button click behavior with active scale animation ([#209](https://github.com/zard-ui/zardui/pull/209))
- **dialog:** implement angular animations for proper center zoom animation ([#256](https://github.com/zard-ui/zardui/pull/256))
- **input-group:** correct ClassValue import path ([#223](https://github.com/zard-ui/zardui/pull/223))
- **registry:** fix reference to non-existent dialog.component.html file ([#228](https://github.com/zard-ui/zardui/pull/228))
- **ssr:** updated platform checks to improve SSR compatibility across components ([#203](https://github.com/zard-ui/zardui/pull/203))
- **tooltip:** update component lifecycle and rxjs usage ([#71](https://github.com/zard-ui/zardui/pull/71))

### 📦 Code Refactoring

- update home page content ([e516e3b](https://github.com/zard-ui/zardui/commit/e516e3b))
- add core directive support and update CLI to version 1.0.0-beta.2 ([c84a07a](https://github.com/zard-ui/zardui/commit/c84a07a))
- migrate to signals and control flow ([#194](https://github.com/zard-ui/zardui/pull/194))
- enhance dialog component with generic data type support ([#218](https://github.com/zard-ui/zardui/pull/218))
- **overlay:** migrate all overlay components to use outsidePointerEvents ([#258](https://github.com/zard-ui/zardui/pull/258))

### 📝 Documentation

- adding MIT license, adding github banner, adding CONTRUITING file ([bad5751](https://github.com/zard-ui/zardui/commit/bad5751))
- updating overview files structure ([bb24419](https://github.com/zard-ui/zardui/commit/bb24419))
- add SECURITY.md, CODE_OF_CONDUCT.md and update CONTRIBUTING.md ([c59a2b7](https://github.com/zard-ui/zardui/commit/c59a2b7))
- **button:** add link variant example ([#261](https://github.com/zard-ui/zardui/pull/261))
- **toast:** add step to register the component ([#229](https://github.com/zard-ui/zardui/pull/229))

### 🏗️ Build System

- migrate to angular 20 ([#217](https://github.com/zard-ui/zardui/pull/217))

### 🧪 Tests

- **card:** fix card unit tests ([1e2df64](https://github.com/zard-ui/zardui/commit/1e2df64))
- **checkbox:** creation of the spec file and unit tests of the checkbox ([#64](https://github.com/zard-ui/zardui/pull/64))
- **checkbox:** add tests for reactiveform context ([#64](https://github.com/zard-ui/zardui/pull/64))

### ❤️ Thank You

- Brener Batista Alves @Brenerr
- Chase Naples @cnaples79
- David Vilaça
- Ediongsenyene Joseph
- Ekram Ullah Dewan @Ekram70
- Elder Fonseca @elderfonseca
- Henrique Custódia @henriquecustodia
- Igual @LucasHenriqueAbreu
- Juliano Souza
- Kevin Valmorbida @KevinValmo
- Lucas Silva @lucasluizss
- Luis Fernando da Silva @Luiz1nn
- luiz gomes
- Luiz gomes @Luizgomess
- Luiz Gomes
- luizvidal @luizvidal
- Matheus Ribeiro @ribeiromatheuss
- mihajm
- Mohamed Ibn Khayat @ibnkhayatmed
- Samuel Rizzon

# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and uses [Conventional Commits](https://www.conventionalcommits.org/) with emojis for commit messages.

---

## [Unreleased]

### 🎉 Initial Release Setup

This changelog will be automatically generated and updated by Nx Release based on conventional commits.

### 📋 Commit Format

We use emoji-prefixed conventional commits:

- ✨ `feat` → New features (minor version bump)
- 🐛 `fix` → Bug fixes (patch version bump)
- 📦 `refactor` → Code refactoring (no version bump)
- 🧪 `test` → Tests (no version bump)
- 📝 `docs` → Documentation (no version bump)
- 🚀 `perf` → Performance improvements (patch version bump)
- 🔧 `chore` → Maintenance tasks (no version bump)
- 💄 `style` → Code style changes (no version bump)
- 🏗️ `build` → Build system changes (no version bump)

---

## Recent Highlights (Manual Summary)

Based on recent commits, ZardUI has received several significant improvements:

### ✨ Features

- **Layout System**: Comprehensive layout component system with header, footer, sidebar, and content
- **Sheet Component**: New sheet component for slide-over panels
- **CLI Improvements**: Theme selection support and multi-runner compatibility
- **Empty Component**: New empty state component

### 🐛 Bug Fixes

- **Dialog**: Implemented Angular animations for proper center zoom animation
- **Popover**: Fixed popover to remain open when scrolling
- **Sheet**: Resolved failing unit tests
- **SSR**: Improved platform checks for better SSR compatibility
- **Input Focus**: Various input and focus-related bug fixes

### 📦 Refactors

- **Overlay Components**: Migrated all overlay components to use outsidePointerEvents
- **Dialog System**: Enhanced dialog component with generic data type support

### 🧪 Tests

- **Layout**: Added comprehensive unit tests for layout components
- **Dialog**: Added unit tests for Angular animations

### 📝 Documentation

- **Installation**: Updated manual installation docs for multiple components
- **Examples**: Added various component usage examples and demos

---

## Future Releases

Starting from the next release, this changelog will be automatically generated with detailed commit information, contributors, and links to pull requests.

Each release will include:
- Version number and date
- Categorized changes (Features, Bug Fixes, etc.)
- Commit references and PR links
- Author credits
- Breaking changes (if any)

---

**Note**: This is the initial changelog. Future releases will be automatically managed by our release automation system.
