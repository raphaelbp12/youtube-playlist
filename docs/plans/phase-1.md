> Part of [plan 1](plan-v1.md). Process lives in the [plan index](index.md).

### Step 1.1 - Write CONTRIBUTING.md

Status: complete. Dependencies: none.

**Implementation prompt.** Create `CONTRIBUTING.md` at the repository root (D-1-1). It must explain, using the scripts in `package.json`: install dependencies with `npm install`; run the tests once with `npm test` (Vitest, `vitest run`); run them in watch mode with `npm run test:watch`; run a single test file, e.g. `npx vitest run src/lib/time.test.ts`. Do not mention lint, build, PR conventions or a Node version (D-1-1, D-1-3). Do not edit `README.md` or any other file (D-1-2).

**Focused checks.** Not a code step. Run each documented command in a fresh checkout and confirm it works as described, including the single-file command.

**Acceptance.** `CONTRIBUTING.md` exists, contains only test-running instructions, every command in it works, and no other file changed.

**Execution and verification.**

- Changed: added `CONTRIBUTING.md` (install, run once, watch mode, single file). No other source or doc file changed besides this record and the statuses.
- Checks: `npm test` passed (8 files, 86 tests); `npx vitest run src/lib/time.test.ts` passed (26 tests); `npm run test:watch` started under a 20 s timeout without a TTY, ran the suite (86 passed) and exited 0; `npm run lint` exit 0.
- Acceptance: file exists (`CONTRIBUTING.md`); only test instructions, no lint, build, PR or Node version; every command ran as documented; README, `package.json`, CI and sources untouched.
