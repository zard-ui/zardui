# Angular Testing Patterns

## Table of Contents

- [Jest Setup](#jest-setup)
- [Test Structure (AAA Pattern)](#test-structure-aaa-pattern)
- [Component Testing](#component-testing)
- [Testing Signals](#testing-signals)
- [Testing Services](#testing-services)
- [Mocking Dependencies](#mocking-dependencies)
- [Component Testing Strategy](#component-testing-strategy)
- [Async Testing](#async-testing)
- [OnPush Components](#onpush-components)
- [HTTP Resource Testing](#http-resource-testing)
- [Common Testing Patterns](#common-testing-patterns)

## Jest Setup

### Installation

```bash
npm install -D jest @types/jest @testing-library/angular @testing-library/jest-dom @testing-library/user-event happy-dom
```

### Configuration

```json
// jest.config.js
export default {
  testEnvironment: 'happy-dom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/libs/zard/src/lib/$1',
  },
  transform: {
    '^.+\\.(ts|html)$': ['jest-preset-angular', {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    }],
  },
};
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
```

```json
// tsconfig.spec.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"]
  },
  "include": ["src/**/*.spec.ts"]
}
```

### Running Tests

```bash
# Run tests
npx jest

# Watch mode
npx jest --watch

# Coverage
npx jest --coverage

# Specific file
npx jest my-component.spec.ts
```

## Test Structure (AAA Pattern)

### Example Test Structure

```typescript
it('updates the profile when the save button is clicked', async () => {
  const user = userEvent.setup();
  const saveSpy = jest.fn();
  await render(ProfileComponent, { componentProperties: { save: saveSpy } });

  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.click(screen.getByRole('button', { name: /save/i }));

  expect(saveSpy).toHaveBeenCalledWith({ name: 'John Doe' });
});
```

## Component Testing

### Basic Component Test with Testing Library

```typescript
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Counter } from './counter.component';

describe('Counter', () => {
  it('displays the initial count', async () => {
    await render(Counter);

    expect(screen.getByText('Count: 0')).toBeVisible();
  });

  it('increments the count when button is clicked', async () => {
    const user = userEvent.setup();
    await render(Counter);

    await user.click(screen.getByRole('button', { name: /increment/i }));

    expect(screen.getByText('Count: 1')).toBeVisible();
  });
});
```

### Testing Component Inputs

```typescript
it('displays the provided item name', async () => {
  const item = { id: '1', name: 'Test Item' };
  await render(ItemComponent, { componentInputs: { item } });

  expect(screen.getByText('Test Item')).toBeVisible();
});
```

### Testing Component Outputs

```typescript
it('emits selected event when item is clicked', async () => {
  const user = userEvent.setup();
  const emittedSpy = jest.fn();

  await render(ItemComponent, {
    componentInputs: { item: { id: '1', name: 'Test' } },
    componentOutputs: { selected: { emit: emittedSpy } as any },
  });

  await user.click(screen.getByRole('button'));

  expect(emittedSpy).toHaveBeenCalledWith({ id: '1', name: 'Test' });
});
```

## Testing Signals

### Direct Signal Testing

```typescript
import { signal, computed } from '@angular/core';

describe('Signal logic', () => {
  it('should update computed when signal changes', () => {
    const count = signal(0);
    const doubled = computed(() => count() * 2);

    expect(doubled()).toBe(0);

    count.set(5);
    expect(doubled()).toBe(10);

    count.update(c => c + 1);
    expect(doubled()).toBe(12);
  });
});
```

### Testing Component Signals

```typescript
describe('TodoList', () => {
  it('filters active todos correctly', async () => {
    const todos = [
      { id: '1', text: 'Task 1', done: false },
      { id: '2', text: 'Task 2', done: true },
    ];

    await render(TodoListComponent, {
      componentInputs: { todos, filter: 'active' },
    });

    expect(screen.getByText('Task 1')).toBeVisible();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });
});
```

## Testing Services

### Basic Service Test

```typescript
import { CounterService } from './counter.service';

describe('CounterService', () => {
  let service: CounterService;

  beforeEach(() => {
    service = new CounterService();
  });

  it('increments the count', () => {
    expect(service.count()).toBe(0);

    service.increment();

    expect(service.count()).toBe(1);
  });

  it('resets the count to zero', () => {
    service.increment();
    service.increment();

    service.reset();

    expect(service.count()).toBe(0);
  });
});
```

### Service with HTTP

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches user by id', async () => {
    const mockUser = { id: '1', name: 'Test User' };

    const userPromise = service.getUser('1');

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);

    const user = await userPromise;
    expect(user).toEqual(mockUser);
  });
});
```

## Mocking Dependencies

### Mocking with Jest

```typescript
describe('UserProfile', () => {
  const mockUserService = {
    getUser: jest.fn().mockReturnValue(of({ id: '1', name: 'Test' })),
    updateUser: jest.fn(),
    user: signal<User | null>(null),
  };

  it('displays user name after loading', async () => {
    await render(UserProfileComponent, {
      providers: [{ provide: UserService, useValue: mockUserService }],
    });

    expect(screen.getByText('Test')).toBeVisible();
  });

  it('calls update when save button is clicked', async () => {
    const user = userEvent.setup();
    mockUserService.updateUser.mockResolvedValue(undefined);

    await render(UserProfileComponent, {
      providers: [{ provide: UserService, useValue: mockUserService }],
    });

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(mockUserService.updateUser).toHaveBeenCalled();
  });
});
```

### Mocking Signal-Based Services

```typescript
const mockAuthService = {
  user: signal<User | null>(null),
  isAuthenticated: computed(() => mockAuthService.user() !== null),
  login: jest.fn(),
  logout: jest.fn(),
};

it('shows content when authenticated', async () => {
  mockAuthService.user.set({ id: '1', name: 'Test User' });

  await render(ProtectedComponent, {
    providers: [{ provide: AuthService, useValue: mockAuthService }],
  });

  expect(screen.getByTestId('protected-content')).toBeVisible();
});
```

## Component Testing Strategy

### Query Selection

Use Testing Library queries in order of preference:

```typescript
// Best - Most accessible
screen.getByRole('button');
screen.getByLabelText('Username');
screen.getByText('Submit');

// Avoid unless necessary
screen.getByTestId('submit-button');
```

### User Interactions

Use `userEvent` for realistic interactions:

```typescript
const user = userEvent.setup();

// Typing
await user.type(screen.getByLabelText('Email'), 'test@example.com');

// Clicking
await user.click(screen.getByRole('button', { name: /submit/i }));

// Selecting options
await user.selectOptions(screen.getByRole('combobox'), 'option-value');
```

## Async Testing

### Async Operations

```typescript
it('loads data after delay', async () => {
  await render(DataComponent);

  // Initial loading state
  expect(screen.getByText(/loading/i)).toBeVisible();

  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeVisible();
  });
});
```

### fakeAsync for Time-Based Tests

```typescript
import { fakeAsync, tick } from '@angular/core/testing';

it('debounces search input', fakeAsync(async () => {
  const user = userEvent.setup();
  await render(SearchComponent);

  await user.type(screen.getByRole('searchbox'), 'test');

  tick(300); // Advance debounce timer

  expect(screen.getByText('Results found')).toBeVisible();
}));
```

## OnPush Components

```typescript
it('updates display when input changes', async () => {
  await render(OnPushComponent, {
    componentInputs: { data: { name: 'Initial' } },
  });

  expect(screen.getByText('Initial')).toBeVisible();

  // Update input signal
  await screen.findByText('Initial');
  const component = screen.queryByRole('generic')?.parent?.parent?.parent?.componentInstance;
  component?.data.set({ name: 'Updated' });

  await waitFor(() => {
    expect(screen.getByText('Updated')).toBeVisible();
  });
});
```

## HTTP Resource Testing

```typescript
describe('UserComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('displays user after loading', async () => {
    await render(UserComponent);

    expect(screen.getByText('Loading...')).toBeVisible();

    const req = httpMock.expectOne('/api/users/1');
    req.flush({ id: '1', name: 'John Doe' });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeVisible();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});
```

## Common Testing Patterns

### Testing Form Validation

```typescript
it('shows error when email is invalid', async () => {
  const user = userEvent.setup();
  await render(SignUpComponent);

  await user.type(screen.getByLabelText('Email'), 'invalid-email');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(screen.getByText(/invalid email/i)).toBeVisible();
  expect(screen.queryByRole('button', { name: /submit/i })).toBeDisabled();
});
```

### Testing Conditional Rendering

```typescript
it('shows delete button when user is admin', async () => {
  await render(ItemComponent, {
    componentInputs: { user: { role: 'admin' } },
  });

  expect(screen.getByRole('button', { name: /delete/i })).toBeVisible();
});

it('hides delete button when user is not admin', async () => {
  await render(ItemComponent, {
    componentInputs: { user: { role: 'user' } },
  });

  expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
});
```

### Testing Lists

```typescript
it('renders all items in the list', async () => {
  const items = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ];

  await render(ListComponent, { componentInputs: { items } });

  expect(screen.getByText('Item 1')).toBeVisible();
  expect(screen.getByText('Item 2')).toBeVisible();
  expect(screen.getByText('Item 3')).toBeVisible();
});
```
