# Zard UI - Development Guidelines

## Code Quality Standards

### TypeScript Configuration

- **Strict Mode**: All TypeScript files use strict type checking
- **Interface Definitions**: Comprehensive interface definitions for all data structures
- **Type Safety**: Explicit typing for function parameters, return values, and object properties
- **Generic Types**: Proper use of generics for reusable type definitions

### File Organization Patterns

- **Barrel Exports**: Use index files to export multiple related items
- **Feature-Based Structure**: Organize code by feature/domain rather than file type
- **Consistent Naming**: Use kebab-case for files, PascalCase for classes/interfaces
- **Extension Conventions**: `.component.ts`, `.service.ts`, `.directive.ts` for Angular files

### Import/Export Standards

- **Absolute Imports**: Use path mapping for clean import statements
- **Grouped Imports**: Angular imports first, then third-party, then local imports
- **Named Exports**: Prefer named exports over default exports
- **Type-Only Imports**: Use `import type` for type-only imports

## Angular Development Patterns

### Component Architecture

- **Standalone Components**: All components use standalone: true
- **OnPush Change Detection**: Use ChangeDetectionStrategy.OnPush for performance
- **Signal-Based State**: Leverage Angular signals for reactive state management
- **Dependency Injection**: Use inject() function over constructor injection

### Component Structure Example

```typescript
@Component({
  selector: 'z-component-name',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, OtherComponents],
  template: `
    ...
  `,
  styles: [`...`],
})
export class ComponentNameComponent {
  private readonly service = inject(ServiceName);
  readonly state = signal(initialValue);
}
```

### Service Patterns

- **Injectable Root**: Use providedIn: 'root' for singleton services
- **Signal State**: Use signals for reactive service state
- **Method Chaining**: Support fluent interfaces where appropriate
- **Error Handling**: Implement proper error handling and logging

### Template Conventions

- **Control Flow**: Use new @if, @for, @switch syntax over structural directives
- **Signal Binding**: Bind directly to signals in templates
- **CSS Classes**: Use TailwindCSS utility classes consistently
- **Accessibility**: Include proper ARIA attributes and semantic HTML

## Styling Guidelines

### TailwindCSS Usage

- **Utility-First**: Prefer utility classes over custom CSS
- **Responsive Design**: Use responsive prefixes (sm:, md:, lg:, xl:)
- **Dark Mode**: Support dark mode with dark: prefix
- **Component Variants**: Use class-variance-authority for component variants

### Color System

- **OKLCH Format**: Use OKLCH color space for better color consistency
- **CSS Variables**: Define colors as CSS custom properties
- **Theme Support**: Support multiple theme presets (neutral, slate, zinc, etc.)
- **Semantic Colors**: Use semantic color names (primary, secondary, muted, etc.)

### Animation Patterns

- **GSAP Integration**: Use GSAP for complex animations
- **CSS Transitions**: Use CSS transitions for simple state changes
- **Performance**: Prefer transform and opacity for animations
- **Accessibility**: Respect prefers-reduced-motion settings

## Data Management

### State Management

- **Signals**: Use Angular signals for local component state
- **Immutable Updates**: Always create new objects for state updates
- **Computed Values**: Use computed() for derived state
- **Effect Handling**: Use effect() for side effects

### API Integration

- **HTTP Client**: Use Angular HttpClient for API calls
- **Error Handling**: Implement consistent error handling patterns
- **Loading States**: Manage loading states with signals
- **Caching**: Implement appropriate caching strategies

### Form Handling

- **Reactive Forms**: Use Angular reactive forms
- **Validation**: Implement comprehensive form validation
- **Type Safety**: Use typed forms for better developer experience
- **Accessibility**: Ensure forms are accessible

## Testing Standards

### Unit Testing

- **Jest Framework**: Use Jest as the testing framework
- **Testing Library**: Use Angular Testing Library for component tests
- **Signal Testing**: Test signal-based components properly
- **Mock Services**: Mock external dependencies in tests

### Test Structure

- **AAA Pattern**: Arrange, Act, Assert test structure without comenting sections
- **Descriptive Names**: Use descriptive test names
- **Setup/Teardown**: Proper test setup and cleanup
- **Coverage**: Maintain high test coverage

## Performance Optimization

### Bundle Optimization

- **Tree Shaking**: Ensure proper tree shaking with ES modules
- **Lazy Loading**: Implement lazy loading for routes and components
- **Code Splitting**: Split code into appropriate chunks
- **Asset Optimization**: Optimize images and other assets

### Runtime Performance

- **OnPush Strategy**: Use OnPush change detection strategy
- **TrackBy Functions**: Use trackBy functions in \*ngFor loops
- **Async Operations**: Handle async operations efficiently
- **Memory Management**: Prevent memory leaks with proper cleanup

## Documentation Standards

### Code Documentation

- **JSDoc Comments**: Use JSDoc for function and class documentation
- **Interface Documentation**: Document all interface properties
- **Example Usage**: Provide usage examples in comments
- **README Files**: Maintain comprehensive README files

### API Documentation

- **Component APIs**: Document all component inputs and outputs
- **Service Methods**: Document service method signatures and behavior
- **Type Definitions**: Provide clear type definitions
- **Migration Guides**: Document breaking changes and migration paths

## Build and Deployment

### Build Configuration

- **Nx Workspace**: Use Nx for monorepo management
- **Build Targets**: Configure appropriate build targets
- **Environment Config**: Manage environment-specific configurations
- **Asset Handling**: Proper asset management and optimization

### Release Process

- **Conventional Commits**: Use conventional commit messages
- **Automated Versioning**: Implement automated version bumping
- **Changelog Generation**: Generate changelogs automatically
- **Package Publishing**: Automate package publishing process

## Security Considerations

### Input Sanitization

- **XSS Prevention**: Sanitize user inputs properly
- **Content Security Policy**: Implement appropriate CSP headers
- **Dependency Scanning**: Regular dependency vulnerability scanning
- **Secure Defaults**: Use secure defaults for all configurations

### Authentication & Authorization

- **Token Management**: Secure token storage and management
- **Route Guards**: Implement proper route protection
- **Permission Checks**: Validate permissions at component level
- **Session Management**: Proper session handling and cleanup
