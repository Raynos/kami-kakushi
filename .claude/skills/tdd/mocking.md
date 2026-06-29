# When to Mock

Mock at **system boundaries** only:

- External APIs (payment, email, etc.)
- Databases (sometimes - prefer test DB)
- Time/randomness
- File system (sometimes)

Don't mock:

- Your own classes/modules
- Internal collaborators
- Anything you control

> **In kamikakushi you almost never mock.** The pure core (`src/core`) is import-pure with no external
> collaborators, and "Time/randomness" above is handled by **seeding, not mocking** — the single
> splitmix64 RNG (`src/core/rng.ts`) and day-keyed time are deterministic seams you _feed_ via
> `createInitialState(seed)`. The only real boundaries are persistence storage and the DOM, and there
> prefer the **real fake** (jsdom + real `save`/`migrate` round-trips, see `src/persistence/save.test.ts`)
> over hand-mocks. Never mock a selector, a sub-reducer, or the RNG.

## Designing for Mockability

At system boundaries, design interfaces that are easy to mock:

**1. Use dependency injection**

Pass external dependencies in rather than creating them internally:

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. Prefer SDK-style interfaces over generic fetchers**

Create specific functions for each external operation instead of one generic function with conditional logic:

```typescript
// GOOD: Each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: Mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

The SDK approach means:
- Each mock returns one specific shape
- No conditional logic in test setup
- Easier to see which endpoints a test exercises
- Type safety per endpoint
