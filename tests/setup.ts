/**
 * Vitest global setup
 */

import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock API handlers
export const handlers = [
  // Health check
  http.get('https://onetimesecret.com/api/v2/status', () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  // Create secret
  http.post('https://onetimesecret.com/api/v2/secret', async () => {
    return HttpResponse.json({
      custid: 'test_customer',
      metadata_key: 'test_metadata_key_123',
      secret_key: 'test_secret_key_456',
      ttl: 3600,
      metadata_ttl: 3600,
      secret_ttl: 3600,
      state: 'new',
      updated: Date.now() / 1000,
      created: Date.now() / 1000,
      passphrase_required: false,
    });
  }),

  // Get secret
  http.post('https://onetimesecret.com/api/v2/secret/:key', () => {
    return HttpResponse.json({
      custid: 'test_customer',
      metadata_key: 'test_metadata_key_123',
      secret_key: 'test_secret_key_456',
      ttl: 3600,
      metadata_ttl: 3600,
      secret_ttl: 3600,
      state: 'received',
      updated: Date.now() / 1000,
      created: Date.now() / 1000,
      passphrase_required: false,
      value: 'test secret value',
    });
  }),
];

// Set up MSW server
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});
