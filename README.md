# nodics.exp

`nodics.exp` is the Nodics frontend workspace/orchestration repository.

It groups frontend applications and shared frontend packages for discovery,
setup, status, and verification, but it does not take ownership of their source
code. `nodics.axis`, `nodics.nexus`, `nodics.agora.apparel`,
`nodics.agora.electronics`, `nodics.agora.telco`, and `domain.commerce.ui`
remain independent repositories with their own package names, Git history,
release flow, CI, issues, tests, and runtime behavior.

## AI tool entry

A beginner user can start from Codex, Claude Code, GitHub Copilot, or another
repository-aware AI coding tool by providing the Nodics experience repository
URL directly. The user does not need to run `nodics.installer` first when the
goal is repository exploration or source changes.

The AI tool must first read root `AGENTS.md`, then this README, then `apps.json`.
For application or shared package source changes it must continue into the
owning guidance, such as `nodics.axis/AGENTS.md`, `nodics.nexus/AGENTS.md`, the
selected `nodics.agora.*` app `AGENTS.md`, `domain.commerce.ui/AGENTS.md`, or
the nearest child application README/AGENTS file.
Use `nodics.installer` only when the goal is to create, repair, preflight,
start, initialize, accept, or inspect a local customer workspace.

## Ownership

`nodics.exp` owns:

- `apps.json`, the frontend application catalogue;
- workspace-level commands for list, status, fetch, and verify;
- shared frontend workspace guidance and tooling.

`nodics.exp` does not own:

- Axis, Nexus, Agora domain storefront, or shared UI package source;
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
├── domain.commerce.ui/
├── nodics.agora.apparel/
├── nodics.agora.electronics/
└── nodics.agora.telco/
```

Tooling also supports a sibling fallback for transitional or custom workspaces:

```text
nodicsRoot/
├── nodics.exp/
├── nodics.axis/
├── nodics.nexus/
├── domain.commerce.ui/
├── nodics.agora.apparel/
├── nodics.agora.electronics/
└── nodics.agora.telco/
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
npm run apps:fetch -- --app=agoraApparel
npm run apps:fetch -- --all
```

Verify selected present apps by running each app's own verify script:

```bash
npm run apps:verify -- --app=agoraApparel
npm run apps:verify -- --all-present
```

## Application Builder

The Nodics Application Builder should use `nodics.exp/apps.json` as the frontend
catalogue when a user chooses Axis, Nexus, a Commerce storefront, or a reusable
frontend package. Builder should ask beginner questions such as "Which commerce
domain do you want: apparel, electronics, or telco?" and then map that answer to
`nodics.agora.apparel`, `nodics.agora.electronics`, or `nodics.agora.telco`
without requiring the user to know repository names. `domain.commerce.ui` is a
shared library consumed by these storefronts; it is not a runnable storefront.

## Shared package consumption

`domain.commerce.ui` is maintained as a Nodics source repository so framework
developers can evolve shared Commerce UI contracts, renderer primitives, media
helpers, checkout/cart components, and browser-safe API client types in one
place.

Customers and partners should not need to clone `domain.commerce.ui` to run a
domain storefront. `nodics.agora.apparel`, `nodics.agora.electronics`, and
`nodics.agora.telco` must consume it as a normal versioned package dependency:

```json
{
  "dependencies": {
    "domain.commerce.ui": "^1.0.0"
  }
}
```

For Nodics framework development, maintainers may clone all source repositories
under `nodics.exp` and use local package linking/workspace overrides. That local
source layout is a maintainer convenience only; it must not become a mandatory
customer setup step.

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
Customers should not need to clone `domain.commerce.ui`; storefront templates
must receive it through package installation unless they explicitly opt into
Nodics framework source development.

## Rules

- Commit workspace tooling changes in `nodics.exp`.
- Commit Axis changes in `nodics.axis`.
- Commit Nexus changes in `nodics.nexus`.
- Commit shared Commerce UI changes in `domain.commerce.ui`.
- Commit Agora Apparel changes in `nodics.agora.apparel`.
- Commit Agora Electronics changes in `nodics.agora.electronics`.
- Commit Agora Telco changes in `nodics.agora.telco`.
- Do not commit child application source into the `nodics.exp` repository.
- Do not put backend-importable data in `nodics.exp`.
