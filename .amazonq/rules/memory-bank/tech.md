# Zard UI - Technology Stack

## Core Technologies

### Frontend Framework
- **Angular**: 21.0.6 (Latest stable version)
- **Angular CDK**: 21.0.5 (Component Development Kit)
- **Angular SSR**: 21.0.4 (Server-Side Rendering)
- **TypeScript**: 5.9.3 (Strict type checking)

### Styling & Design
- **TailwindCSS**: 4.1.18 (Utility-first CSS framework)
- **PostCSS**: 8.5.6 (CSS processing)
- **class-variance-authority**: 0.7.1 (Component variant management)
- **tailwind-merge**: 3.4.0 (Conditional class merging)
- **clsx**: 2.1.1 (Conditional class names)

### Build System & Tooling
- **Nx**: 22.3.3 (Monorepo management and build system)
- **Node.js**: 22 || 20 (Runtime environment)
- **npm**: Package management
- **TypeScript Compiler**: Code compilation
- **SWC**: Fast TypeScript/JavaScript compiler

## Development Dependencies

### Code Quality & Linting
- **ESLint**: 9.39.2 (JavaScript/TypeScript linting)
- **Prettier**: 3.7.4 (Code formatting)
- **angular-eslint**: 21.1.0 (Angular-specific linting rules)
- **typescript-eslint**: 8.50.1 (TypeScript ESLint integration)

### Testing Framework
- **Jest**: 30.2.0 (JavaScript testing framework)
- **@testing-library/angular**: 18.1.1 (Angular testing utilities)
- **@testing-library/jest-dom**: 6.9.1 (DOM testing matchers)
- **happy-dom**: 20.0.11 (Lightweight DOM implementation)

### Git & Release Management
- **Husky**: 9.1.7 (Git hooks)
- **Commitlint**: 20.2.0 (Commit message linting)
- **lint-staged**: 16.2.7 (Pre-commit file linting)
- **Conventional Commits**: Automated versioning and changelog

## Runtime Dependencies

### UI & Animation
- **lucide-angular**: 0.562.0 (Icon library)
- **embla-carousel**: 8.6.0 (Carousel component)
- **gsap**: 3.14.2 (Animation library)
- **ngx-sonner**: 3.1.0 (Toast notifications)

### Utilities & Processing
- **rxjs**: 7.8.2 (Reactive programming)
- **zod**: 4.2.1 (Schema validation)
- **culori**: 4.0.2 (Color manipulation)
- **fast-glob**: 3.3.3 (File globbing)
- **fs-extra**: 11.3.3 (Enhanced file system operations)

### CLI Dependencies
- **commander**: 14.0.2 (Command-line interface framework)
- **chalk**: 5.6.2 (Terminal string styling)
- **prompts**: 2.4.2 (Interactive command-line prompts)
- **ora**: 9.0.0 (Terminal spinners)
- **execa**: 9.6.1 (Process execution)

## Documentation & Content Processing

### Markdown Processing
- **unified**: 11.0.5 (Text processing framework)
- **remark-parse**: 11.0.0 (Markdown parser)
- **remark-gfm**: 4.0.1 (GitHub Flavored Markdown)
- **remark-rehype**: 11.1.2 (Markdown to HTML)
- **rehype-highlight**: 7.0.2 (Syntax highlighting)
- **rehype-pretty-code**: 0.14.1 (Enhanced code blocks)

### Code Analysis
- **ts-morph**: 27.0.2 (TypeScript compiler API wrapper)
- **shiki**: 3.20.0 (Syntax highlighter)

## Development Commands

### Primary Commands
```bash
npm start          # Start development server (port 4222)
npm test           # Run all library tests
npm run build      # Build production bundle
npm run release    # Automated release process
```

### Development Workflow
```bash
npm run build:registry        # Generate component registry
npm run generate:installation # Create installation guides
npm run watch:files          # Watch and regenerate files
npm run cli                  # Build and serve CLI
```

### Testing & Quality
```bash
npm run test:watch          # Run tests in watch mode
nx run-many --target=lint   # Lint all projects
nx run-many --target=test   # Test all projects
```

## Build Configuration

### Nx Workspace
- **Target Defaults**: Optimized caching and dependency management
- **Named Inputs**: Production and development input definitions
- **Generators**: Angular component and library generators

### TypeScript Configuration
- **Base Config**: Shared TypeScript settings across projects
- **Strict Mode**: Enabled for type safety
- **Path Mapping**: Configured for library imports

### Bundle Optimization
- **Tree Shaking**: Dead code elimination
- **Code Splitting**: Optimized chunk generation
- **Minification**: Production bundle optimization