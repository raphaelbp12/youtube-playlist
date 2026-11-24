> Part of [plan 1](plan-v1.md). Process lives in the [plan index](index.md).

### Step 1.1 - Write CONTRIBUTING.md

Status: pending. Dependencies: none.

**Implementation prompt.** Create `CONTRIBUTING.md` at the repository root (D-1-1). It must explain, using the scripts in `package.json`: install dependencies with `npm install`; run the tests once with `npm test` (Vitest, `vitest run`); run them in watch mode with `npm run test:watch`; run a single test file, e.g. `npx vitest run src/lib/time.test.ts`. Do not mention lint, build, PR conventions or a Node version (D-1-1, D-1-3). Do not edit `README.md` or any other file (D-1-2).

**Focused checks.** Not a code step. Run each documented command in a fresh checkout and confirm it works as described, including the single-file command.

**Acceptance.** `CONTRIBUTING.md` exists, contains only test-running instructions, every command in it works, and no other file changed.
