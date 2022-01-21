import { promises as fs } from "fs";
import { resolve } from "path";
import execa from "execa";
import * as glob from 'glob';
import * as vscode from 'vscode';

export type PM = "npm" | "yarn" | "pnpm" | undefined;

const cache = new Map();

function getTypeofLockFile(cwd = vscode.workspace.workspaceFolders[0].uri.fsPath): PM {
    const key = `lockfile_${cwd}`;
    if (cache.has(key)) {
        cache.get(key);
    }

    const yarn = new glob.sync(cwd + '\\yarn.lock', { mark: true });
    const npm = new glob.sync(cwd + '\\package-lock.json', { mark: true });
    const pnpm = new glob.sync(cwd + '\\pnpm-lock.yaml', { mark: true });

    let value: PM = undefined;

    if (yarn.length > 0) {
        value = "yarn";
    } else if (pnpm.length > 0) {
        value = "pnpm";
    } else if (npm.length > 0) {
        value = "npm";
    }

    cache.set(key, value);
    return value;
}

export const detectManager = ({ cwd }: { cwd?: string } = {}) => {
    const type = getTypeofLockFile(cwd);
    if (type) {
        return type;
    }

    return "node";
};

export function getNpmVersion(pm: PM) {
    return execa(pm || "npm", ["--version"]).then((res) => res.stdout);
}

export function clearCache() {
    return cache.clear();
}