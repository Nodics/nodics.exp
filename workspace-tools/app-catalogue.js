/*
    Nodics - Frontend Workspace Tooling

    Copyright (c) 2026 Nodics All rights reserved.

    This software is governed by the Nodics Source-Available Commercial License.
    You may use, copy, modify, deploy, or distribute it only as permitted by the
    root LICENSE file or a separate written agreement with Nodics.

 */

/**
 * @module nodics.exp/workspace-tools/app-catalogue
 * @description Loads the frontend application/package catalogue and provides repository-safe list, status, fetch, and verify helpers for independent child repositories.
 * @layer tooling
 * @owner nodics.exp
 * @override Workspace tools may extend catalogue fields, but must preserve child-repository ownership, selected-app execution, and delegation to each app's own package scripts.
 */
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    /** Returns the workspace root that owns this workspace-tools folder. */
    workspaceRoot: function () {
        return path.resolve(__dirname, '..');
    },

    /** Reads a `--name=value` command-line option. */
    readOption: function (args, name, defaultValue) {
        const prefix = name + '=';
        const match = (args || []).find(argument => argument.startsWith(prefix));
        return match ? match.slice(prefix.length) : defaultValue;
    },

    /** Returns whether an option flag is present. */
    hasFlag: function (args, name) {
        return (args || []).includes(name);
    },

    /** Loads the frontend app/package catalogue. */
    loadCatalogue: function () {
        const cataloguePath = path.join(this.workspaceRoot(), 'apps.json');
        return JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
    },

    /** Validates the minimum catalogue contract used by the workspace tools. */
    validateCatalogue: function (catalogue) {
        const errors = [];
        if (catalogue.contractVersion !== 1) {
            errors.push('apps.json contractVersion must be 1');
        }
        if (catalogue.workspace !== 'nodics.exp') {
            errors.push('apps.json workspace must be nodics.exp');
        }
        Object.keys(catalogue.apps || {}).forEach(code => {
            const app = catalogue.apps[code];
            ['name', 'folder', 'type', 'repository', 'packageName', 'verifyScript'].forEach(field => {
                if (!app[field]) {
                    errors.push('App `' + code + '` must define ' + field);
                }
            });
            if (app.folder && (path.isAbsolute(app.folder) || app.folder.split('/').includes('..'))) {
                errors.push('App `' + code + '` folder must be a safe nested path');
            }
        });
        if (errors.length > 0) {
            throw new Error('Invalid nodics.exp apps catalogue:\n- ' + errors.join('\n- '));
        }
        return true;
    },

    /** Returns sorted application codes. */
    appCodes: function (catalogue) {
        return Object.keys(catalogue.apps || {}).sort();
    },

    /** Resolves frontend entry selections from `--app`, `--apps`, `--all`, or `--all-present`. */
    selectedCodes: function (args, catalogue, presentOnly) {
        if (this.hasFlag(args, '--all') || this.hasFlag(args, '--all-present')) {
            const codes = this.appCodes(catalogue);
            return presentOnly ? codes.filter(code => this.statusFor(catalogue.apps[code]).present) : codes;
        }
        const selected = this.readOption(args, '--apps', '') || this.readOption(args, '--app', '');
        if (!selected) {
            throw new Error('Select a frontend app with --app=agora, --apps=agora,axis, or --all');
        }
        const codes = selected.split(',').map(value => value.trim()).filter(Boolean);
        codes.forEach(code => {
            if (!catalogue.apps[code]) {
                throw new Error('Unknown frontend catalogue entry `' + code + '`. Run npm run apps:list.');
            }
        });
        return Array.from(new Set(codes)).sort();
    },

    /** Reads JSON when a package file is available. */
    readPackage: function (directory) {
        const packagePath = path.join(directory, 'package.json');
        return fs.existsSync(packagePath) ? JSON.parse(fs.readFileSync(packagePath, 'utf8')) : null;
    },

    /** Executes a command and returns trimmed output without throwing. */
    tryExec: function (command, args, cwd) {
        try {
            return childProcess.execFileSync(command, args, { cwd: cwd, encoding: 'utf8',
                stdio: ['ignore', 'pipe', 'ignore'] }).trim();
        } catch (error) {
            return '';
        }
    },

    /** Resolves where an app/package repository exists, preferring the nested workspace folder. */
    resolveAppDirectory: function (app) {
        const nested = path.join(this.workspaceRoot(), app.folder);
        if (fs.existsSync(path.join(nested, 'package.json'))) {
            return { present: true, directory: nested, location: 'nested' };
        }
        const sibling = path.resolve(this.workspaceRoot(), app.siblingFallback || '');
        if (app.siblingFallback && fs.existsSync(path.join(sibling, 'package.json'))) {
            return { present: true, directory: sibling, location: 'sibling' };
        }
        return { present: false, directory: nested, location: 'missing' };
    },

    /** Returns status for one frontend catalogue entry. */
    statusFor: function (app) {
        const resolved = this.resolveAppDirectory(app);
        const packageJson = resolved.present ? this.readPackage(resolved.directory) : null;
        return {
            name: app.name,
            type: app.type,
            present: resolved.present,
            location: resolved.location,
            directory: resolved.directory,
            packageName: packageJson ? packageJson.name : null,
            packageMatches: packageJson ? packageJson.name === app.packageName : false,
            branch: resolved.present ? this.tryExec('git', ['rev-parse', '--abbrev-ref', 'HEAD'], resolved.directory) : null,
            dirty: resolved.present ? this.tryExec('git', ['status', '--short'], resolved.directory).length > 0 : null,
            nodeModules: resolved.present ? fs.existsSync(path.join(resolved.directory, 'node_modules')) : false,
            verifyScript: app.verifyScript
        };
    },

    /** Prints JSON or readable text consistently for workspace commands. */
    printResult: function (result, json) {
        if (json) {
            console.log(JSON.stringify(result, null, 2));
            return;
        }
        if (Array.isArray(result)) {
            result.forEach(item => console.log(item));
            return;
        }
        console.log(JSON.stringify(result, null, 2));
    },

    /** Clones a missing app/package into its nested workspace folder. */
    fetchApp: function (app, code, dryRun) {
        const status = this.statusFor(app);
        if (status.present) {
            return { code: code, fetched: false, reason: 'already-present', location: status.location,
                directory: status.directory };
        }
        if (dryRun) {
            return { code: code, fetched: false, dryRun: true, command: 'git clone ' + app.repository + ' ' +
                status.directory };
        }
        childProcess.execFileSync('git', ['clone', app.repository, status.directory], { stdio: 'inherit' });
        return { code: code, fetched: true, directory: status.directory };
    },

    /** Runs or previews one app/package's own verify script. */
    verifyApp: function (app, code, dryRun) {
        const status = this.statusFor(app);
        if (!status.present) {
            return { code: code, verified: false, skipped: true, reason: 'missing' };
        }
        if (dryRun) {
            return { code: code, verified: false, dryRun: true,
                command: 'npm run ' + app.verifyScript, directory: status.directory };
        }
        childProcess.execFileSync('npm', ['run', app.verifyScript], { cwd: status.directory, stdio: 'inherit' });
        return { code: code, verified: true, script: app.verifyScript, directory: status.directory };
    }
};
