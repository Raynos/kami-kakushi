# Good and Bad Tests

## Good Tests

**Integration-style**: Test through real interfaces, not mocks of internal parts.

```typescript
// GOOD: Tests observable behavior
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

Characteristics:

- Tests behavior users/callers care about
- Uses public API only
- Survives internal refactors
- Describes WHAT, not HOW
- One logical assertion per test

## Bad Tests

**Implementation-detail tests**: Coupled to internal structure.

```typescript
// BAD: Tests implementation details
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Red flags:

- Mocking internal collaborators
- Testing private methods
- Asserting on call counts/order
- Test breaks when refactoring without behavior change
- Test name describes HOW not WHAT
- Verifying through external means instead of interface

```typescript
// BAD: Bypasses interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: Verifies through interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

## In kamikakushi — favour fast integration/system tests

Prefer driving the **real** game over poking at internals — fast (milliseconds in `vitest`, no real
browser) and behaviour-level. House patterns, all "integration-style through the public interface":

- **Real UI in jsdom** — mount the real renderer and drive it like the app does, assert on what renders.
  See `src/ui/render.test.ts` (`// @vitest-environment jsdom`; "mount the real renderer and drive it
  like the app does").
- **Real core through the public surface** — run the actual `reduce`/`tick` reducer via the `./index`
  barrel (or the DEV `window.__qa` harness: `newGame(seed)` → `dispatch(intent)` → `tick(dt)` → read
  `state()`) and assert on observable state deltas. See `src/core/economy.test.ts`.
- **On RNG-driven outcomes** (combat/loot) — assert **relations/bounds** (damage rises with skill; a drop
  sits within its loot table), never exact seeded values. An exact-value assertion is a change-detector
  that breaks on a behaviour-preserving refactor — a "bad test" by the rules above. (Our whole correctness
  layer is seed-driven, so this is the easy trap to fall into.)

Reserve Playwright (real browser, slower) for true end-to-end. Default to the fast jsdom/`__qa` path.
