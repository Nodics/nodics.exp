#!/usr/bin/env node
const catalogueService = require('./app-catalogue');

const args = process.argv.slice(2);
const catalogue = catalogueService.loadCatalogue();
catalogueService.validateCatalogue(catalogue);
const dryRun = catalogueService.hasFlag(args, '--dry-run');
const selected = catalogueService.selectedCodes(args, catalogue, catalogueService.hasFlag(args, '--all-present'));
const results = selected.map(code => catalogueService.verifyApp(catalogue.apps[code], code, dryRun));
catalogueService.printResult(results, catalogueService.hasFlag(args, '--json'));
