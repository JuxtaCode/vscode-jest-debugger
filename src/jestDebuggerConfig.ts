import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { isWindows, normalizePath, quote, validateCodeLensOptions, CodeLensOption } from './util';
import { detectManager } from './detectPackageManager';

export class JestDebuggerConfig {
  private manager = detectManager();
  /**
   * The command that runs jest.
   * Defaults to: node "node_modules/.bin/jest"
   */
  public get jestCommand(): string {

    const jestCommand: string = vscode.workspace.getConfiguration().get('jestdebugger.jestCommand');
    if (jestCommand) {
      return jestCommand;
    }

    if (this.manager !== undefined) {
      return this.manager + ` jest`;
    }

    return `node ${quote(this.jestBinPath)}`;
  }

  public get changeDirectoryToWorkspaceRoot(): boolean {
    return vscode.workspace.getConfiguration().get('jestdebugger.changeDirectoryToWorkspaceRoot');
  }

  public get preserveEditorFocus(): boolean {
    return vscode.workspace.getConfiguration().get('jestdebugger.preserveEditorFocus') || false;
  }

  public get jestBinPath(): string {
    // custom
    let jestPath: string = vscode.workspace.getConfiguration().get('jestdebugger.jestPath');
    if (jestPath) {
      return jestPath;
    }

    // default
    const relativeJestBin = isWindows() ? 'node_modules/jest/bin/jest.js' : 'node_modules/.bin/jest';
    const cwd = this.cwd;

    jestPath = path.join(cwd, relativeJestBin);

    return normalizePath(jestPath);
  }

  public get debugLabel(): string {
    return vscode.workspace.getConfiguration().get('jestdebugger.debugLabel');
  }

  public get runLabel(): string {
    return vscode.workspace.getConfiguration().get('jestdebugger.runLabel');
  }

  public get cwd(): string {
    return (
      this.currentPackagePath ||
      this.currentWorkspaceFolderPath
    );
  }

  private get currentPackagePath() {
    let currentFolderPath: string = path.dirname(vscode.window.activeTextEditor.document.fileName);
    do {
      // Try to find where jest is installed relatively to the current opened file.
      // Do not assume that jest is always installed at the root of the opened project, this is not the case
      // such as in multi-module projects.
      const pkg = path.join(currentFolderPath, 'package.json');
      const jest = path.join(currentFolderPath, 'node_modules', 'jest');
      if (fs.existsSync(pkg) && fs.existsSync(jest)) {
        return currentFolderPath;
      }
      currentFolderPath = path.join(currentFolderPath, '..');
    } while (currentFolderPath !== this.currentWorkspaceFolderPath);

    return '';
  }

  public get currentWorkspaceFolderPath(): string {
    const editor = vscode.window.activeTextEditor;
    return vscode.workspace.getWorkspaceFolder(editor.document.uri).uri.fsPath;
  }

  getJestConfigPath(targetPath: string): string {
    const configPath: string = vscode.workspace.getConfiguration().get('jestdebugger.configPath');

    if (!configPath) {
      let currentFolderPath: string = targetPath || path.dirname(vscode.window.activeTextEditor.document.fileName);
      let currentFolderConfigPath: string;
      do {
        for (const configFilename of ['jest.config.js', 'jest.config.ts']) {
          currentFolderConfigPath = path.join(currentFolderPath, configFilename);

          if (fs.existsSync(currentFolderConfigPath)) {
            return currentFolderConfigPath;
          }
        }
        currentFolderPath = path.join(currentFolderPath, '..');
      } while (currentFolderPath !== this.currentWorkspaceFolderPath);
      return '';
    }

    return normalizePath(path.join(this.currentWorkspaceFolderPath, configPath));
  }

  public get runOptions(): string[] | null {
    const runOptions = vscode.workspace.getConfiguration().get('jestdebugger.runOptions');
    if (runOptions) {
      if (Array.isArray(runOptions)) {
        return runOptions;
      } else {
        vscode.window.showWarningMessage(
          'Please check your vscode settings. "jestdebugger.runOptions" must be an Array. '
        );
      }
    }
    return null;
  }

  public get debugOptions(): Partial<vscode.DebugConfiguration> {
    const debugOptions = vscode.workspace.getConfiguration().get('jestdebugger.debugOptions');
    if (debugOptions) {
      return debugOptions;
    }

    // default
    return {};
  }

  public get isCodeLensDisabled(): boolean {
    const isCodeLensDisabled: boolean = vscode.workspace.getConfiguration().get('jestdebugger.disableCodeLens');
    return isCodeLensDisabled ? isCodeLensDisabled : false;
  }

  public get codeLensOptions(): CodeLensOption[] {
    const codeLensOptions = vscode.workspace.getConfiguration().get('jestdebugger.codeLens');
    if (Array.isArray(codeLensOptions)) {
      return validateCodeLensOptions(codeLensOptions);
    }
    return [];
  }

  public get isYarnPnpSupportEnabled(): boolean {
    const isYarnPnp: boolean = vscode.workspace.getConfiguration().get('jestdebugger.enableYarnPnpSupport');
    return isYarnPnp ? isYarnPnp : false;
  }
}
