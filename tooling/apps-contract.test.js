const assert = require('assert');
const fs = require('fs');
const path = require('path');
const catalogueService = require('./app-catalogue');

const catalogue = catalogueService.loadCatalogue();
assert.strictEqual(catalogueService.validateCatalogue(catalogue), true);
assert.deepStrictEqual(catalogueService.appCodes(catalogue), ['agora', 'axis', 'nexus']);

catalogueService.appCodes(catalogue).forEach(code => {
    const app = catalogue.apps[code];
    assert.strictEqual(app.name, app.packageName, code + ' app identity must match package name');
    assert(app.repository.includes(app.name + '.git'), code + ' repository must point to its own app repo');
    assert(!path.isAbsolute(app.folder), code + ' nested folder must be relative');
    assert(!app.folder.split('/').includes('..'), code + ' nested folder must not escape nodics.exp');
});

const agora = catalogueService.statusFor(catalogue.apps.agora);
assert.strictEqual(agora.name, 'nodics.agora');
if (agora.present) {
    assert.strictEqual(agora.packageMatches, true, 'Detected Agora package must preserve app identity');
}

const dryRun = catalogueService.fetchApp(catalogue.apps.agora, 'agora', true);
assert.strictEqual(dryRun.fetched, false, 'Dry-run fetch must not clone');
const verifyDryRun = catalogueService.verifyApp(catalogue.apps.agora, 'agora', true);
assert.strictEqual(verifyDryRun.dryRun || verifyDryRun.skipped, true,
    'Dry-run verify must not execute child app checks');

const readme = fs.readFileSync(path.join(catalogueService.workspaceRoot(), 'README.md'), 'utf8');
[
    'does not take ownership',
    'Commit workspace tooling changes in `nodics.exp`',
    'Commit Axis changes in `nodics.axis`',
    'Do not put backend-importable data in `nodics.exp`'
].forEach(clause => {
    assert(readme.includes(clause), 'README must preserve ownership guidance: ' + clause);
});

console.log('nodics.exp app catalogue contract validated');
