# Nodics Experience Workspace Agent Contract

`nodics.exp` is the Nodics frontend workspace and orchestration repository. It
helps discover, fetch, inspect, and verify Nodics-owned frontend applications
and shared frontend packages, but it does not own their source code.

## AI tool GitHub entry path

A user may start from Codex, Claude Code, GitHub Copilot, or another
repository-aware AI coding tool by providing this GitHub repository URL. The
user does not need to run `nodics.installer` first for repository work.

When started from this repository URL, the AI tool must:

1. read this root `AGENTS.md`;
2. read root `README.md`;
3. inspect `apps.json` before changing frontend catalogue or workspace tools;
4. descend into `nodics.axis/AGENTS.md`, `nodics.nexus/AGENTS.md`, the selected
   `nodics.agora.*` app `AGENTS.md`, or the owning child application
   README/AGENTS file before app source changes;
5. use `nodics.installer` only when asked to create, repair, preflight, start,
   initialize, accept, or inspect a local customer workspace;
6. never commit child application source as `nodics.exp` workspace tools.

## Ownership

- `nodics.exp` owns `apps.json`, workspace-level list/status/fetch/verify
  tools, and shared frontend workspace guidance.
- Child frontend applications own their own source
  code, tests, package metadata, release behavior, and application-specific
  documentation.
- Domain storefront templates must be self-contained: renderer contracts used
  by the template live inside the owning storefront repository so a customer or
  partner can clone one selected domain app without an extra shared UI repo.
- Backend APIs, generated contracts, CMS records, product/catalogue data,
  importable data, secrets, tenancy, and business authority remain outside this
  repository.

## Change rules

- Change `apps.json` only when registering or correcting a Nodics-owned
  frontend application catalogue entry.
- Change `workspace-tools/` only for workspace orchestration behavior.
- Change child app source inside the child repository context and follow that
  repository's nearest `AGENTS.md`.
- Do not make a runnable domain storefront require a manual local shared UI
  source checkout.
- Keep customer-local generated projects out of this repository unless the user
  explicitly asks for reusable template/source changes.

## Verification

- Run `npm test` after changing workspace catalogue or workspace tool behavior.
- If a change only updates guidance, inspect the changed markdown and confirm
  repository ownership boundaries are still clear.
