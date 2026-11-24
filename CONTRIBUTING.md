# Contributing

This guide covers how to run the tests. Tests use [Vitest](https://vitest.dev).

## Install dependencies

```sh
npm install
```

## Run the tests once

```sh
npm test
```

This runs `vitest run`.

## Run the tests in watch mode

```sh
npm run test:watch
```

Vitest re-runs the affected tests when you save a file.

## Run a single test file

```sh
npx vitest run src/lib/time.test.ts
```

Replace the path with any test file.
