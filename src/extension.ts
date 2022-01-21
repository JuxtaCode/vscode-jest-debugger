'use strict';
import * as vscode from 'vscode';
import { JestDebugger } from './jestDebugger';
import { JestDebuggerCodeLensProvider } from './JestDebuggerCodeLensProvider';
import { JestDebuggerConfig } from './jestDebuggerConfig';

export function activate(context: vscode.ExtensionContext): void {
  const jestDebugger = new JestDebugger();
  const config = new JestDebuggerConfig();
  const codeLensProvider = new JestDebuggerCodeLensProvider(config.codeLensOptions);

  const runJest = vscode.commands.registerCommand(
    'extension.runJest',
    async (argument: Record<string, unknown> | string) => {
      if (typeof argument === 'string') {
        jestDebugger.runCurrentTest(argument);
      } else {
        jestDebugger.runCurrentTest();
      }
    }
  );
  const runJestPath = vscode.commands.registerCommand('extension.runJestPath', async (argument: vscode.Uri) =>
    jestDebugger.runTestsOnPath(argument.path)
  );
  const runJestAndUpdateSnapshots = vscode.commands.registerCommand('extension.runJestAndUpdateSnapshots', async () => {
    jestDebugger.runCurrentTest('', ['-u']);
  });
  const runJestFile = vscode.commands.registerCommand('extension.runJestFile', async () => jestDebugger.runCurrentFile());
  const debugJest = vscode.commands.registerCommand(
    'extension.debugJest',
    async (argument: Record<string, unknown> | string) => {
      if (typeof argument === 'string') {
        jestDebugger.debugCurrentTest(argument);
      } else {
        jestDebugger.debugCurrentTest();
      }
    }
  );
  const debugJestPath = vscode.commands.registerCommand('extension.debugJestPath', async (argument: vscode.Uri) =>
    jestDebugger.debugTestsOnPath(argument.path)
  );
  const runPrev = vscode.commands.registerCommand('extension.runPrevJest', async () => jestDebugger.runPreviousTest());
  const runJestFileWithCoverage = vscode.commands.registerCommand('extension.runJestFileWithCoverage', async () =>
    jestDebugger.runCurrentFile(['--coverage'])
  );

  const runJestFileWithWatchMode = vscode.commands.registerCommand('extension.runJestFileWithWatchMode', async () =>
    jestDebugger.runCurrentFile(['--watch'])
  );

  const watchJest = vscode.commands.registerCommand(
    'extension.watchJest',
    async (argument: Record<string, unknown> | string) => {
      if (typeof argument === 'string') {
        jestDebugger.runCurrentTest(argument, ['--watch']);
      } else {
        jestDebugger.runCurrentTest(undefined, ['--watch']);
      }
    }
  );

  if (!config.isCodeLensDisabled) {
    const docSelectors: vscode.DocumentFilter[] = [
      { pattern: vscode.workspace.getConfiguration().get('jestdebugger.codeLensSelector') },
    ];
    const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(docSelectors, codeLensProvider);
    context.subscriptions.push(codeLensProviderDisposable);
  }
  context.subscriptions.push(runJest);
  context.subscriptions.push(runJestAndUpdateSnapshots);
  context.subscriptions.push(runJestFile);
  context.subscriptions.push(runJestPath);
  context.subscriptions.push(debugJest);
  context.subscriptions.push(debugJestPath);
  context.subscriptions.push(runPrev);
  context.subscriptions.push(runJestFileWithCoverage);
  context.subscriptions.push(runJestFileWithWatchMode);
  context.subscriptions.push(watchJest);
}

export function deactivate(): void {
  // deactivate
}
