# nodics.exp workspace tools

This folder contains lightweight frontend workspace helpers. They read
`apps.json`, operate only on selected frontend application repositories, and
delegate verification to each app's own `package.json` scripts.

These tools must not own Axis, Nexus, or Agora source code and must not create
backend-importable data.
