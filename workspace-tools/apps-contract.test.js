const assert = require('assert');
const fs = require('fs');
const path = require('path');
const catalogueService = require('./app-catalogue');

const catalogue = catalogueService.loadCatalogue();
assert.strictEqual(catalogueService.validateCatalogue(catalogue), true);
assert.deepStrictEqual(catalogueService.appCodes(catalogue), [
    'agoraApparel',
    'agoraElectronics',
    'agoraTelco',
    'axis',
    'nexus'
]);

catalogueService.appCodes(catalogue).forEach(code => {
    const app = catalogue.apps[code];
    assert.strictEqual(app.name, app.packageName, code + ' app identity must match package name');
    assert(app.repository.includes(app.name + '.git'), code + ' repository must point to its own app repo');
    assert(!path.isAbsolute(app.folder), code + ' nested folder must be relative');
    assert(!app.folder.split('/').includes('..'), code + ' nested folder must not escape nodics.exp');
});

['agoraApparel', 'agoraElectronics', 'agoraTelco'].forEach(code => {
    assert.strictEqual(catalogue.apps[code].consumesPackages, undefined,
        code + ' must be self-contained and not require a shared UI source/package checkout');
    const agora = catalogueService.statusFor(catalogue.apps[code]);
    assert(agora.name.startsWith('nodics.agora.'), code + ' must be a domain-specific Agora app');
    if (agora.present) {
        assert.strictEqual(agora.packageMatches, true, 'Detected ' + code + ' package must preserve app identity');
    }
});

const dryRun = catalogueService.fetchApp(catalogue.apps.agoraApparel, 'agoraApparel', true);
assert.strictEqual(dryRun.fetched, false, 'Dry-run fetch must not clone');
const verifyDryRun = catalogueService.verifyApp(catalogue.apps.agoraApparel, 'agoraApparel', true);
assert.strictEqual(verifyDryRun.dryRun || verifyDryRun.skipped, true,
    'Dry-run verify must not execute child app checks');

const readme = fs.readFileSync(path.join(catalogueService.workspaceRoot(), 'README.md'), 'utf8');
[
    'does not take ownership',
    'Commit workspace tool changes in `nodics.exp`',
    'Commit Axis changes in `nodics.axis`',
    'Commit Agora Apparel changes in `nodics.agora.apparel`',
    'Domain storefront templates must be self-contained',
    'Do not put backend-importable data in `nodics.exp`'
].forEach(clause => {
    assert(readme.includes(clause), 'README must preserve ownership guidance: ' + clause);
});

[
    'AGENTS.md',
    'README.md'
].forEach(relativePath => {
    const content = fs.readFileSync(path.join(catalogueService.workspaceRoot(), relativePath), 'utf8')
        .replace(/\s+/g, ' ');
    [
        'Codex',
        'Claude Code',
        'GitHub Copilot',
        'repository URL',
        'does not need to run `nodics.installer` first'
    ].forEach(clause => {
        assert(content.includes(clause), relativePath + ' must preserve AI repository entry guidance: ' + clause);
    });
});

console.log('nodics.exp app catalogue contract validated');
