# Zard UI - Project Structure

## Directory Organization

### Root Level Structure
```
zardui/
├── apps/                    # Applications
│   └── web/                # Documentation website
├── libs/                   # Libraries
│   ├── zard/              # Core component library
│   └── blocks/            # Higher-level component blocks
├── packages/              # Publishable packages
│   └── cli/               # Command-line interface tool
├── scripts/               # Build and utility scripts
├── docs/                  # Project documentation
├── issues/                # Component development issues/specs
└── coverage/              # Test coverage reports
```

### Core Components & Relationships

#### Component Library (`libs/zard/`)
- **Purpose**: Core UI components (buttons, inputs, dialogs, etc.)
- **Structure**: Organized by component type with shared utilities
- **Exports**: Standalone Angular components with TailwindCSS styling
- **Dependencies**: Angular CDK, class-variance-authority, clsx

#### Blocks Library (`libs/blocks/`)
- **Purpose**: Higher-level component compositions and patterns
- **Structure**: Complex UI patterns built from core components
- **Relationship**: Depends on `libs/zard` components
- **Use Case**: Ready-to-use sections and layouts

#### CLI Package (`packages/cli/`)
- **Purpose**: Command-line tool for component installation
- **Features**: Component scaffolding, dependency management
- **Technology**: Node.js with Commander.js framework
- **Distribution**: Published as npm package

#### Web Application (`apps/web/`)
- **Purpose**: Documentation website and component showcase
- **Features**: Live examples, installation guides, API documentation
- **Technology**: Angular SSR with markdown processing
- **Build**: Static site generation for deployment

## Architectural Patterns

### Monorepo Architecture
- **Tool**: Nx workspace for project management
- **Benefits**: Shared dependencies, consistent tooling, atomic commits
- **Structure**: Multiple publishable libraries and applications
- **Build System**: Nx executors for build, test, and lint operations

### Component Design Patterns
- **Standalone Components**: No NgModules, direct imports
- **Composition API**: Components built through composition
- **Variant System**: class-variance-authority for component variants
- **Utility Classes**: TailwindCSS for styling with tailwind-merge

### Build & Release System
- **Registry System**: Automated component registry generation
- **Installation Guides**: Dynamic generation of setup instructions
- **Versioning**: Conventional commits with automated releases
- **Distribution**: npm packages for CLI and component library

### Development Workflow
- **Scripts**: TypeScript scripts for build automation
- **File Watching**: Automatic regeneration of registry and guides
- **Testing**: Jest-based testing across all packages
- **Linting**: ESLint with Angular-specific rules

## Key Configuration Files

### Workspace Configuration
- `nx.json`: Nx workspace configuration and build targets
- `package.json`: Root dependencies and workspace scripts
- `tsconfig.base.json`: Base TypeScript configuration

### Build System
- `scripts/build-registry.cts`: Component registry generation
- `scripts/generate-installation-guides.cts`: Setup guide creation
- `scripts/generate-files.cts`: File watching and regeneration

### Quality Assurance
- `eslint.config.mjs`: ESLint configuration for code quality
- `jest.config.ts`: Jest testing framework setup
- `.husky/`: Git hooks for pre-commit validation