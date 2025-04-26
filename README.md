# safe-stringify-ts

A TypeScript utility for safely stringifying any JavaScript object, including those with circular references, DOM nodes, and other complex structures.

## Features

- Type-safe implementation
- Handles circular references
- Supports special JavaScript types (DOM nodes, errors, dates, etc.)
- Formatting options for both console and HTML display
- Async logging capabilities
- Custom formatters for different data types

## Installation

```bash
npm install safe-stringify-ts
```

## Usage

### Basic usage

```typescript
import { safeStringify } from 'safe-stringify-ts';

const complexObject = {
  circular: null,
  date: new Date(),
  error: new Error('Test error'),
  func: function test() { return 'hello'; },
  // DOM node example (browser only)
  node: document.body,
};
complexObject.circular = complexObject;

console.log(safeStringify(complexObject));
```

### Logging to HTML

```typescript
import { logToElement } from 'safe-stringify-ts';

const data = { name: 'Test', value: 42, nested: { a: 1, b: 2 } };
const element = document.getElementById('output');

logToElement(data, element);
```

### Logging async functions

```typescript
import { logAsync } from 'safe-stringify-ts';

async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  return response.json();
}

// Log the result when the promise resolves
logAsync(fetchData());
```

### Custom Formatting

```typescript
import { createLogger } from 'safe-stringify-ts';

const logger = createLogger({
  maxDepth: 3,
  colors: true,
  showFunctions: true,
  dateFormat: 'iso',
});

logger.log(complexObject);
```

## API

See [API documentation](./docs/API.md) for complete details.

## License

MIT