# Nodics Experience Workspace Agent Contract

`nodics.exp` is the Nodics frontend workspace and orchestration repository. It
helps discover, fetch, inspect, and verify Nodics-owned frontend applications,
but it does not own the application source code.

## AI tool GitHub entry path

A user may start from Codex, Claude Code, GitHub Copilot, or another
repository-aware AI coding tool by providing this GitHub repository URL. The
user does not need to run `nodics.installer` first for repository work.

When started from this repository URL, the AI tool must:

1. read this root `AGENTS.md`;
2. read root `README.md`;
3. inspect `apps.json` before changing frontend catalogue or workspace tooling;
4. descend into `nodics.axis/AGENTS.md`, `nodics.nexus/AGENTS.md`,
   `nodics.agora/AGENTS.md`, or the owning child application README/AGENTS
   file before app source changes;
5. use `nodics.installer` only when asked to create, repair, preflight, start,
   initialize, accept, or inspect a local customer workspace;
6. never commit child application source as `nodics.exp` workspace tooling.

## Ownership

- `nodics.exp` owns `apps.json`, workspace-level list/status/fetch/verify
  tooling, and shared frontend workspace guidance.
- Child frontend applications own their own source code, tests, package
  metadata, release behavior, and application-specific documentation.
- Backend APIs, generated contracts, CMS records, product/catalogue data,
  importable data, secrets, tenancy, and business authority remain outside this
  repository.

## Change rules

- Change `apps.json` only when registering or correcting a Nodics-owned
  frontend application catalogue entry.
- Change `tooling/` only for workspace orchestration behavior.
- Change child app source inside the child app repository context and follow
  that app's nearest `AGENTS.md`.
- Keep customer-local generated projects out of this repository unless the user
  explicitly asks for reusable template/source changes.

## Verification

- Run `npm test` after changing workspace catalogue or tooling behavior.
- If a change only updates guidance, inspect the changed markdown and confirm
  repository ownership boundaries are still clear.
