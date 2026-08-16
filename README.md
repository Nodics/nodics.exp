# nodics.exp

`nodics.exp` is the Nodics frontend workspace/orchestration repository.

It groups frontend applications for discovery, setup, status, and verification,
but it does not take ownership of their source code. `nodics.axis`,
`nodics.nexus`, and `nodics.agora` remain independent application repositories
with their own package names, Git history, release flow, CI, issues, tests, and
runtime behavior.

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

## Rules

- Commit workspace tooling changes in `nodics.exp`.
- Commit Axis changes in `nodics.axis`.
- Commit Nexus changes in `nodics.nexus`.
- Commit Agora changes in `nodics.agora`.
- Do not commit child application source into the `nodics.exp` repository.
- Do not put backend-importable data in `nodics.exp`.
