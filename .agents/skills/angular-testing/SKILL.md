---
name: angular-testing
description: Write unit and integration tests for Angular v21+ applications using Jest with @testing-library/angular, focusing on user-centric testing, AAA pattern, and modern Angular patterns (Standalone components, Signals). Use for testing components, services, and HTTP interactions with Jest globals and Testing Library DOM matchers.
---

# Angular Testing with Jest

Test Angular v21+ applications with Jest and @testing-library/angular, prioritizing user-centric testing over implementation details.

## Core Principles

- **User-Centric Testing:** Simulate real user behavior using `@testing-library/angular`. Avoid testing implementation details or private state.
- **Modern Angular:** Follow Angular v20+ standards (Standalone components, Signals, `@if/@for` control flow).
- **Accessibility:** Use semantic queries (getByRole, getByLabelText) that promote accessible markup.

## Framework & Syntax

### Jest Globals

Always use Jest globals:
- `describe`, `it`, `expect`, `jest` (e.g., `jest.fn()`, `jest.spyOn()`)
- Never use `jasmine`, `spyOn`, or `done()`

### Testing Library DOM Matchers

Use `@testing-library/jest-dom` matchers for better assertions:

```typescript
// Good - Use jest-dom matchers
expect(button).toHaveClass('primary');
expect(text).toBeVisible();
expect(element).toHaveTextContent('Hello');
expect(button).toBeDisabled();

// Bad - Avoid direct DOM manipulation
expect(element.classList.contains('name')).toBe(true);
expect(element.style.display).toBe('none');
```

## Test Structure (AAA Pattern)

### Strict AAA Guidelines

Structure every test into **Arrange**, **Act**, and **Assert** blocks:

1. **Leave exactly one empty line** between Arrange/Act/Assert blocks
2. **Do NOT include** `// Arrange` or `// Act` or `// Assert` comments
3. **Use meaningful test titles** with active voice

### Test Naming

- Use active voice, describe what the test does
- Avoid "should" phrasing

```typescript
// Bad - Generic "should" title
it('should handle submit', () => { });

// Good - Descriptive and specific
it('prevents submission when the email field is invalid', () => { });

// Good - Clear behavior description
it('updates the profile when the save button is clicked', () => { });
```

## Component Testing Strategy

### Isolation

Each `it` block must be self-contained. Use `beforeEach` only for setup truly shared across all tests.

### Query Selection

Use Testing Library queries in order of preference:
1. `screen.getByRole()` - Most accessible and semantic
2. `screen.getByLabelText()` - For form elements
3. `screen.getByText()` - For static text content
4. `screen.getByTestId()` - Last resort only

### User Interactions

Use `userEvent` from `@testing-library/user-event` for realistic interactions instead of native DOM events.

### Public API Testing

Test only public fields and methods. Test `protected` or `private` logic only through public triggers (user interactions, input changes, public method calls).

### Business Logic Focus

Do not test Angular's built-in directives (like `@if`, `@for`). Test the component's unique inputs, outputs, and business logic.

## Mocking & Async

### Effective Mocking

Use `jest.spyOn()` or `jest.fn()` to isolate dependencies. Avoid importing heavy modules; mock services and APIs at the boundary.

### Async Handling

Use `async/await` for all promises returned by queries or events. Never leave a promise unhandled.

### Signals

Update signal state via `component.mySignal.set()` and verify the UI updates automatically.

### HTTP

Use `HttpTestingController` and `provideHttpClientTesting()` for service tests.

## Best Practices Summary

1. **User-Centric:** Test what users see and interact with
2. **AAA Pattern:** Arrange, Act, Assert with clear separation
3. **Meaningful Names:** Active voice, specific behavior
4. **Isolation:** Each test is self-contained
5. **Accessibility:** Use semantic queries (getByRole, getByLabelText)
6. **Public API Only:** Don't test private implementation
7. **Async Handling:** Always await promises and user events
8. **Mock at Boundaries:** Mock services, not internal logic
9. **Business Logic Focus:** Don't test Angular's built-in directives
10. **DOM Matchers:** Use jest-dom for readable assertions

For complete usage examples and patterns, see [references/testing-jest-patterns.md](references/testing-patterns.md).
