# Tests

This directory contains unit and integration tests for the OTS client.

## Running Tests

```bash
# Run all tests
pnpm test:unit

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:unit -- --coverage
```

## Test Structure

- `unit/` - Unit tests for individual modules
- `integration/` - Integration tests for API client (requires local OTS instance)
- `setup.ts` - Global test setup with MSW mocks

## Writing Tests

Tests use Vitest and MSW for API mocking. Example:

```typescript
import { describe, it, expect } from 'vitest';

describe('MyFeature', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

## MSW Mocks

Mock API handlers are defined in `setup.ts`. Override them in individual tests as needed:

```typescript
import { server } from '../setup';
import { http, HttpResponse } from 'msw';

server.use(
  http.post('https://onetimesecret.com/api/v2/secret', () => {
    return HttpResponse.json({ custom: 'response' });
  })
);
```
