# Plan 1 - Add a CONTRIBUTING file with test instructions

Process and plan status live in the [plan index](index.md).

## Sources And Decision Authority

The repository (`README.md`, `package.json`, `.github/workflows/ci.yml`) and the owner's answers on SAFE-7 are the only sources. Where they differ, the owner's answers win.

## Confirmed Design

- Adds one new file, `CONTRIBUTING.md`, at the repository root. It covers only how to run the tests.
- Does not change `README.md`, `package.json`, CI or any source file.
- Does not cover lint, build, PR conventions or a Node version.

## Recorded User Decisions

- **D-1-1** - `CONTRIBUTING.md` covers only how to run the tests: install, run once, watch mode, run a single file.
- **D-1-2** - `README.md` is left untouched. The test commands are repeated in `CONTRIBUTING.md`.
- **D-1-3** - No Node version is mentioned.
- **D-1-4** - One phase with one step.

## Approved Scope And Review Gates

In scope: `CONTRIBUTING.md`. Review gate: every documented command must be run locally and work.

## Phase Index

| Phase | Title | Status | Dependencies | File |
| --- | --- | --- | --- | --- |
| 1 | Write CONTRIBUTING.md | pending | none | [phase-1.md](phase-1.md) |

## Phase 1 - Write CONTRIBUTING.md

- 1.1 - Write CONTRIBUTING.md - pending - no dependencies.
