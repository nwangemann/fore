/** Test helper: replaces global fetch with one that answers every request with `body`. */
export function mockFetch(body: unknown): jest.Mock {
  const fn = jest.fn(async () => ({ ok: true, status: 200, json: async () => body }));
  globalThis.fetch = fn as unknown as typeof fetch;
  return fn;
}

/** The URL of the nth fetch call, parsed. */
export function requestedUrl(fn: jest.Mock, call = 0): URL {
  return new URL(String(fn.mock.calls[call]?.[0]));
}
