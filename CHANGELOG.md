## 1.0.0-beta.52 (2026-02-23)

### 🐛 Bug Fixes

- **tree:** emit zNodeClick on mouse click and refine node spacing ([#452](https://github.com/zard-ui/zardui/pull/452))

### ❤️ Thank You

- Pavan Mollagavelli @neopavan

## 1.0.0-beta.51 (2026-02-23)

### 🐛 Bug Fixes

- **animation:** animation classes should be applied properly now ([#453](https://github.com/zard-ui/zardui/pull/453))

### ❤️ Thank You

- Mickey Lazarevic @mikij

## 1.0.0-beta.50 (2026-02-23)

### ✨ Features

- **tree:** add tree component ([#449](https://github.com/zard-ui/zardui/pull/449))

### ❤️ Thank You

- Pavan Mollagavelli @neopavan

## 1.0.0-beta.49 (2026-02-23)

### 🐛 Bug Fixes

- **dark-mode:** defer media query initialization to afterNextRenderer for SSR ([#446](https://github.com/zard-ui/zardui/pull/446))

### ❤️ Thank You

- Mickey Lazarevic @mikij

## 1.0.0-beta.48 (2026-02-23)

This was a version bump only, there were no code changes.

## 1.0.0-beta.47 (2026-02-22)

### 🐛 Bug Fixes

- **ci:** add [skip ci] to release commit to prevent release loop ([22a5f78](https://github.com/zard-ui/zardui/commit/22a5f78))
- **dark-mode:** add ngSkipHydration to dark mode page component ([#445](https://github.com/zard-ui/zardui/pull/445))

### ❤️ Thank You

- luiz gomes
- Mickey Lazarevic @mikij

## 1.0.0-beta.46 (2026-02-22)

This was a version bump only, there were no code changes.

## 1.0.0-beta.45 (2026-02-22)

### ✨ Features

- adding preset, dark mode service improvements, prevent SSR flickering ([#384](https://github.com/zard-ui/zardui/pull/384))
- **context-menu:** adding context menu directive ([#381](https://github.com/zard-ui/zardui/pull/381))
- **theme-generator:** customize zard/ui theme ([#380](https://github.com/zard-ui/zardui/pull/380))

### 🐛 Bug Fixes

- light or dark colors for code  properly follow dark mode servi… ([#390](https://github.com/zard-ui/zardui/pull/390))
- CLI component installer execution fix ([#393](https://github.com/zard-ui/zardui/pull/393))
- route should not overlap with file name ([#396](https://github.com/zard-ui/zardui/pull/396))
- input component - forms support fix ([#397](https://github.com/zard-ui/zardui/pull/397))
- generateId replaced by ZardIdDirective to support SSR hydration ([#403](https://github.com/zard-ui/zardui/pull/403))
- adjusting production errors ([c5ef1c0](https://github.com/zard-ui/zardui/commit/c5ef1c0))
- dynamic og image generator ([60929c5](https://github.com/zard-ui/zardui/commit/60929c5))
- **checkbox:** adding disabled state for reactive forms usage ([#407](https://github.com/zard-ui/zardui/pull/407))
- **cli:** support custom component aliases for added component imports and dark mode setup ([#431](https://github.com/zard-ui/zardui/pull/431))
- **flickering:** regression corrected ([#444](https://github.com/zard-ui/zardui/pull/444))
- **menu:** focus trigger element on hover ([#426](https://github.com/zard-ui/zardui/pull/426))
- **select:** fixes overflow of long text item element in select component ([#417](https://github.com/zard-ui/zardui/pull/417))

### 📦 Code Refactoring

- imports instead of modules #382 ([#383](https://github.com/zard-ui/zardui/pull/383), [#382](https://github.com/zard-ui/zardui/issues/382))
- use Angular `booleanAttribute` instead of custom boolean transform. ([#427](https://github.com/zard-ui/zardui/pull/427))
- **button:** latest shadcn/ui button styling ([#428](https://github.com/zard-ui/zardui/pull/428))
- **calendar:** minor code refactoring ([#398](https://github.com/zard-ui/zardui/pull/398))
- **calendar:** revert functionality ([#400](https://github.com/zard-ui/zardui/pull/400))
- **calendar:** code simplifications ([#415](https://github.com/zard-ui/zardui/pull/415))
- **card:** synced with latest shadcn card implementation ([#375](https://github.com/zard-ui/zardui/pull/375))
- **carousel:** template simplification ([#414](https://github.com/zard-ui/zardui/pull/414))
- **combobox:** template simplification, test added ([#412](https://github.com/zard-ui/zardui/pull/412))
- **empty:** use NgOptimizedImage for improved image performance ([#408](https://github.com/zard-ui/zardui/pull/408))
- **select:** template simplification ([#413](https://github.com/zard-ui/zardui/pull/413))
- **switch:** modernize component to use model input and Angula… ([#422](https://github.com/zard-ui/zardui/pull/422))

### 🏗️ Build System

- Reducing the number of warnings during installations and builds ([0f0e606](https://github.com/zard-ui/zardui/commit/0f0e606))
- updatin package-lock ([55421d4](https://github.com/zard-ui/zardui/commit/55421d4))
- changing ci flow to just run in prs ([b3a1a05](https://github.com/zard-ui/zardui/commit/b3a1a05))
- bumping versions to 1.0.0-beta.43 ([e1cc7d5](https://github.com/zard-ui/zardui/commit/e1cc7d5))
- **ci:** remove --first-release hardcoded and unify CI workflows ([8be3b2f](https://github.com/zard-ui/zardui/commit/8be3b2f))
- **ci:** use RELEASE_TOKEN for protected branch push and restrict CI to PRs only ([962698b](https://github.com/zard-ui/zardui/commit/962698b))

### 🧪 Tests

- **dropdown:** adding unit tests ([#416](https://github.com/zard-ui/zardui/pull/416))
- **e2e:** setup Playwright E2E tests for core components ([#435](https://github.com/zard-ui/zardui/pull/435))

### ❤️ Thank You

- Lucas Fernandes
- luiz gomes
- Luiz gomes @Luizgomess
- Michael Iskandarani @Noskilo
- Mickey Lazarevic @mikij
- Pavan Mollagavelli @neopavan
- Turach

## 1.0.0-beta.27 (2025-12-15)

### ✨ Features

- **CLI:** updating the CLI to detect pre-installed tailwind (Angular 21), updating change log layout,
  updating zard/ui hero section ([#370](https://github.com/zard-ui/zardui/pull/370))
- **calendar:** expand the year range using the min and max date validators ([#355](https://github.com/zard-ui/zardui/pull/355))
- **select:** compact mode introduced to provide new look in calendar ([#352](https://github.com/zard-ui/zardui/pull/352))
- **event manager plugins:** introduced event manager plugins with CLI update ([#348](https://github.com/zard-ui/zardui/pull/348))

### 🐛 Bug Fixes

- **progress:** fixed variant classes ([#367](https://github.com/zard-ui/zardui/pull/367))
- **select:** visual and keyboard issues related to focus ([#363](https://github.com/zard-ui/zardui/pull/363))
- **pagination:** a11y fixes, component API changes ([#361](https://github.com/zard-ui/zardui/pull/361))
- **date picker, select:** CVA fix and navigation update ([#353](https://github.com/zard-ui/zardui/pull/353))
- **select:** add outsidePointerEvents to prevent overlapping components from being closed ([#328](https://github.com/zard-ui/zardui/pull/328))

### 📦 Code Refactoring

- **accordion:** code improvement and missing test added ([#365](https://github.com/zard-ui/zardui/pull/365))
- **library:** fixed output event names for throughout the libarary ([#347](https://github.com/zard-ui/zardui/pull/347))
- **string template outlet directive:** refactored to use signal inputs ([#333](https://github.com/zard-ui/zardui/pull/333))
- **tooltip:** changed tooltip look to follow shadcn/ui look ([#320](https://github.com/zard-ui/zardui/pull/320))
- **input group:** reduced API, look like shadcn/ui variant ([#329](https://github.com/zard-ui/zardui/pull/329))
- **breadcrumb:** code cleanup with improvements ([#324](https://github.com/zard-ui/zardui/pull/324))

## 1.0.0-beta.26 (2025-11-13)

### ✨ Features

- **buton-group:** add button group component ([#308](https://github.com/zard-ui/zardui/pull/308))
- **carousel:** carousel component implemented ([#311](https://github.com/zard-ui/zardui/pull/311))
- **kbd:** kbd and kbd-group components implemented ([#314](https://github.com/zard-ui/zardui/pull/314))

### 📦 Code Refactoring

- **select:** enhance select to support multiple selection ([#309](https://github.com/zard-ui/zardui/pull/309))
- **empty:** Refactor the Empty component to follow the ZardUI pattern ([#296](https://github.com/zard-ui/zardui/pull/296))

### 📝 Documentation

- **accordion:** updated API to reflect all component inputs ([#318](https://github.com/zard-ui/zardui/pull/318))

### 🐛 Bug Fixes

- **select:** z-select-item computed signal does not compute in all cases ([#307](https://github.com/zard-ui/zardui/pull/307))

## 1.0.0-beta.25 (2025-10-24)

### 📦 Code Refactoring

- **cli:** modularize commands and reorganize structure
  - Split init command (294 lines) into 6 focused modules
  - Split add command (151 lines) into 4 focused modules
  - Reorganized registry and themes into core/ directory
  - Separated logic from data for better maintainability

### ✨ Features

- **cli:** add @cli path alias for cleaner imports
  - Configured TypeScript path mapping with @cli/\* alias
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
