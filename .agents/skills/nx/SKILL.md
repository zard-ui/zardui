---
name: nx
description: Best practices for Nx monorepo development, project configuration, and code generation
---

# Nx Monorepo Development

You are an expert in Nx, the smart, fast, and extensible build system for monorepos.

## Project Structure

- Organize projects following Nx conventions:
  - `apps/` - Application projects (web apps, APIs, mobile apps)
  - `libs/` - Library projects (shared code, features, utilities)
- Use consistent naming patterns: `scope-type-name` (e.g., `shared-ui-button`)
- Group related libraries under feature folders

## Workspace Configuration

Configure `nx.json` for workspace-wide settings:

```json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "test": {
      "cache": true
    }
  },
  "defaultBase": "main"
}
```

- Use `project.json` for project-specific configuration
- Define proper `tags` for enforcing module boundaries

## Project Configuration

Each project should have a `project.json`:

```json
{
  "name": "my-app",
  "sourceRoot": "apps/my-app/src",
  "projectType": "application",
  "tags": ["scope:web", "type:app"],
  "targets": {
    "build": { },
    "serve": { },
    "test": { }
  }
}
```

- Define clear project types: `application` or `library`
- Use tags for enforcing dependency constraints

## Code Generation

- Use Nx generators for consistent code scaffolding:
  - `nx g @nx/react:app my-app` - Generate React application
  - `nx g @nx/react:lib my-lib` - Generate React library
  - `nx g @nx/react:component my-component --project=my-lib` - Generate component
- Create custom generators for project-specific patterns
- Use `--dry-run` to preview changes before execution

## Module Boundaries

Enforce boundaries using ESLint rules:

```json
{
  "@nx/enforce-module-boundaries": [
    "error",
    {
      "depConstraints": [
        { "sourceTag": "type:app", "onlyDependOnLibsWithTags": ["type:lib", "type:util"] },
        { "sourceTag": "type:lib", "onlyDependOnLibsWithTags": ["type:lib", "type:util"] },
        { "sourceTag": "scope:web", "onlyDependOnLibsWithTags": ["scope:web", "scope:shared"] }
      ]
    }
  ]
}
```

- Define clear dependency rules between project types
- Use scopes to separate domain boundaries

## Caching and Performance

- Enable computation caching for faster builds
- Configure Nx Cloud for distributed caching and task execution
- Use affected commands to only run tasks for changed projects:
  - `nx affected:build`
  - `nx affected:test`
  - `nx affected:lint`
- Define proper `inputs` and `outputs` for accurate caching

## Task Execution

- Run tasks with Nx CLI:
  - `nx build my-app` - Build specific project
  - `nx run-many -t build` - Build all projects
  - `nx affected -t test` - Test affected projects
- Use task pipelines for proper dependency ordering
- Configure parallel execution for independent tasks

## Testing Strategy

- Use Jest for unit testing with Nx presets
- Configure Cypress or Playwright for E2E testing
- Implement component testing for UI libraries
- Use `nx affected:test` in CI for efficient test runs

## CI/CD Integration

- Use Nx Cloud for distributed task execution
- Configure GitHub Actions with Nx:
  ```yaml
  - uses: nrwl/nx-set-shas@v4
  - run: nx affected -t lint test build
  ```
- Implement proper caching strategies
- Use `nx-cloud record` for capturing metrics

## Best Practices

- Keep applications thin; move logic to libraries
- Create shared utility libraries for common code
- Use barrel exports (`index.ts`) for clean imports
- Implement proper type exports from libraries
- Document library purposes and public APIs
- Use Nx Console VS Code extension for visual project management
- Leverage the project graph for understanding dependencies: `nx graph`
