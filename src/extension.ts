import * as vscode from 'vscode';
import { AddSandboxPanel } from './panels/addSandboxPanel';
import { SandboxDataProvider } from './providers/SandboxDataProvider';
import { Sandbox } from './Sandbox';
import sandboxes from './Sandboxes';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

  await sandboxes.init(context);

  // Show the Add Sandbox panel command
  const addSandboxCommand = vscode.commands.registerCommand('b2cc-content-editor.addSandbox', () => {
    AddSandboxPanel.render(context);
  });
  context.subscriptions.push(addSandboxCommand);

  // Show Edit Sandbox panel command
  const editSandboxCommand = vscode.commands.registerCommand('b2cc-content-editor.editSandbox', sandbox => {
    console.log("EDIT SANDBOX COMMAND");
    console.log(sandbox);
  });
  context.subscriptions.push(editSandboxCommand);

  // Delete Sandbox command
  const deleteSandboxCommand = vscode.commands.registerCommand('b2cc-content-editor.deleteSandbox', () => {
    console.log("DELETE SANDBOX COMMAND");
  });
  context.subscriptions.push(deleteSandboxCommand);

  // vscode.commands.executeCommand('setContext', 'b2cc-content-editor.sandboxesWelcomeView', Object.keys(sandboxes).length > 0);

  // Show the Sandboxes in the tree view
  const sandboxDataProvider = new SandboxDataProvider();
  vscode.window.registerTreeDataProvider('b2cc-content-editor.views.sandboxes', sandboxDataProvider);

  vscode.commands.registerCommand('b2cc-content-editor.refreshSandboxes', () =>
    sandboxDataProvider.refresh()
  );
}

// This method is called when your extension is deactivated
export function deactivate() { }
