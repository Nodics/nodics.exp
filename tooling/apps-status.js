#!/usr/bin/env node
const catalogueService = require('./app-catalogue');

const args = process.argv.slice(2);
const catalogue = catalogueService.loadCatalogue();
catalogueService.validateCatalogue(catalogue);
const statuses = catalogueService.appCodes(catalogue)
    .map(code => Object.assign({ code: code }, catalogueService.statusFor(catalogue.apps[code])));
if (catalogueService.hasFlag(args, '--json')) {
    catalogueService.printResult(statuses, true);
} else {
    statuses.forEach(status => {
        console.log(status.code + ' ' + (status.present ? 'present' : 'missing') +
            ' location=' + status.location +
            ' package=' + (status.packageName || '-') +
            ' branch=' + (status.branch || '-') +
            ' dirty=' + (status.dirty === null ? '-' : status.dirty));
    });
}
