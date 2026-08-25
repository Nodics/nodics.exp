# nodics.exp

`nodics.exp` is the Nodics frontend workspace/orchestration repository.

It groups frontend applications for discovery, setup, status, and verification,
but it does not take ownership of their source code. `nodics.axis`,
`nodics.nexus`, and `nodics.agora` remain independent application repositories
with their own package names, Git history, release flow, CI, issues, tests, and
runtime behavior.

## AI tool entry

A beginner user can start from Codex, Claude Code, GitHub Copilot, or another
repository-aware AI coding tool by providing the Nodics experience repository
URL directly. The user does not need to run `nodics.installer` first when the
goal is repository exploration or source changes.

The AI tool must first read root `AGENTS.md`, then this README, then `apps.json`.
For application source changes it must continue into the owning app guidance,
such as `nodics.axis/AGENTS.md`, `nodics.nexus/AGENTS.md`,
`nodics.agora/AGENTS.md`, or the nearest child application README/AGENTS file.
Use `nodics.installer` only when the goal is to create, repair, preflight,
start, initialize, accept, or inspect a local customer workspace.

## Ownership

`nodics.exp` owns:

- `apps.json`, the frontend application catalogue;
- workspace-level commands for list, status, fetch, and verify;
- shared frontend workspace guidance and tooling.

`nodics.exp` does not own:

- Axis, Nexus, or Agora application source;
- app-specific releases or CI;
- backend APIs, Commerce/domain logic, CMS records, product/catalogue data, or
  any backend-importable data.

## Layout

The target nested layout is:

```text
nodics.exp/
├── package.json
├── README.md
├── apps.json
├── tooling/
├── nodics.axis/
├── nodics.nexus/
└── nodics.agora/
```

Tooling also supports a sibling fallback for transitional or custom workspaces:

```text
nodicsRoot/
├── nodics.exp/
├── nodics.axis/
├── nodics.nexus/
└── nodics.agora/
```

The preferred local layout is now the nested layout. The fallback exists so
older checkouts and customer workspaces can migrate without a hard break.

## Commands

List available frontend applications:

```bash
npm run apps:list
```

Show which apps are present and where they were found:

```bash
npm run apps:status
npm run apps:status -- --json
```

Fetch a missing nested app repository:

```bash
npm run apps:fetch -- --app=agora
npm run apps:fetch -- --all
```

Verify selected present apps by running each app's own verify script:

```bash
npm run apps:verify -- --app=agora
npm run apps:verify -- --all-present
```

## Application Builder

The Nodics Application Builder should use `nodics.exp/apps.json` as the frontend
catalogue when a user chooses Axis, Nexus, or Agora. Builder may ask beginner
questions such as "Do you need a storefront?" and then map that answer to
`nodics.agora` without requiring the user to know repository names.

## Template repository governance

The `nodics.exp` registration model is a Nodics-owned template and framework
governance rule. It applies to repositories maintained under the Nodics
organization for reusable framework experiences, partner starter templates, and
customer-project templates that Nodics publishes as reference assets.

When Nodics adds a new reusable experience app under `github.com/Nodics`, the
app must be registered in `apps.json` and kept as an independent repository.
That creates two explicit release surfaces:

- the app repository owns its source, tests, release history, and CI;
- `nodics.exp` owns only catalogue discovery, setup/status/verification
  tooling, and local workspace orchestration.

This rule must not be applied as a restriction on real customer-owned projects.
Customers and delivery teams may keep their actual projects in their own Git
organizations, monorepos, polyrepos, workspace layouts, CI systems, naming
schemes, and release processes. They should consume Nodics framework contracts,
generated outputs, template examples, and documented extension points, but they
do not need to change or publish anything under `github.com/Nodics`.

## Rules

- Commit workspace tooling changes in `nodics.exp`.
- Commit Axis changes in `nodics.axis`.
- Commit Nexus changes in `nodics.nexus`.
- Commit Agora changes in `nodics.agora`.
- Do not commit child application source into the `nodics.exp` repository.
- Do not put backend-importable data in `nodics.exp`.
