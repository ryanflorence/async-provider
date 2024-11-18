# async-provider

A lightweight, type-safe async context management system for JavaScript applications. Perfect for server-side applications where you need to share request-scoped values across components and functions.

## Features

- 🔒 **Type-safe**: Full TypeScript support with generic type safety
- 🌟 **Simple API**: Just three functions - `createContext`, `provide`, and `pull`
- 🎯 **Isolated Values**: Values are isolated to specific async contexts - like a request
- 🔗 **Single provider**: No need to nest multiple providers - pass all contexts in a single Map
- ↩️ **Return values**: Unlike raw AsyncLocalStorage, easily get return values from your callbacks
- 💨 **Zero dependencies**: Uses Node's built-in AsyncLocalStorage

## Installation

```bash
npm install @ryanflorence/async-provider
```

## Usage

```typescript
import { createContext, provide, pull } from "@ryanflorence/async-provider";

// 1. ✅ Create your contexts
let userContext = createContext<User>();
let dbContext = createContext<Database>();

async function myHandleRequest(req: Request) {
  // setup context values
  let user = await myAuthenticateUser(req);
  let db = myCreateDatabaseConnection(user);

  // 2. ✅ Provide contexts
  let html = await provide(
    new Map([
      [userContext, user],
      [dbContext, db],
    ]),
    async () => {
      // run your app code within this context
      let result = await renderApp();
      // Can return values from provider callback
      return result;
    },
  );

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}

// 3. ✅ Pull context from anywhere
function renderApp() {
  let user = pull(userContext);
  let db = pull(dbContext);

  // Use user and db...
}
```

## Why async-provider?

Particularly useful in server environments (like React Router Loaders, React Server Components, GraphQL servers) where multiple components need access to request-scoped values:

- User authentication data
- Database connections
- Request-specific configuration
- Feature flags
- Logging context

### Advantages over Alternatives

- **vs. Module imports**

  - Module scope can't access request-specific information
  - Values are properly scoped to each request

- **vs. Raw AsyncLocalStorage**

  - Simpler API
  - No need to nest multiple providers
  - Type-safe by default
  - Can return values from context scope callback

## API

### `createContext<T>()`

Creates a new context object for values of type T.

```typescript
let userContext = createContext<User>();
```

### `provide<T>(contextMap, callback)`

Provides values for contexts within the scope of the callback.

```ts
await provide(
  new Map([
    [userCtx, currentUser],
    [featureCtx, flags],
  ]),
  async () => {
    // ...
  },
);

// Also accepts arrays of tuples
await provide(
  [
    [userCtx, currentUser],
    [featureCtx, flags],
  ],
  async () => {
    // ...
  },
);
```

### `pull<T>(context)`

Retrieves the value for a context. Must be called within a `provide` scope.

```typescript
let user = pull(userContext);
```

## License

MIT

## Contributing

Contributions welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.
