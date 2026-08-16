#!/usr/bin/env node
const catalogueService = require('./app-catalogue');

const args = process.argv.slice(2);
const catalogue = catalogueService.loadCatalogue();
catalogueService.validateCatalogue(catalogue);
const rows = catalogueService.appCodes(catalogue).map(code => {
    const app = catalogue.apps[code];
    return code + ' - ' + app.displayName + ' [' + app.name + ', ' + app.type + ']';
});
catalogueService.printResult(catalogueService.hasFlag(args, '--json') ?
    catalogueService.appCodes(catalogue).map(code => Object.assign({ code: code }, catalogue.apps[code])) : rows,
catalogueService.hasFlag(args, '--json'));
