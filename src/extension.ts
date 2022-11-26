import * as vscode from 'vscode';
import { AddSandboxPanel } from './panels/addSandboxPanel';
import { SandboxDataProvider } from './providers/SandboxDataProvider';
import { Sandbox } from './Sandbox';
import sandboxes from './Sandboxes';

export async function activate(context: vscode.ExtensionContext) {

  await sandboxes.init(context);

  // Show the Add Sandbox panel command
  const addSandboxCommand = vscode.commands.registerCommand('b2cc-content-editor.addSandbox', () => {
    AddSandboxPanel.render(context);
  });
  context.subscriptions.push(addSandboxCommand);

  // Show Edit Sandbox panel command
  const editSandboxCommand = vscode.commands.registerCommand('b2cc-content-editor.editSandbox', async node => {
    AddSandboxPanel.render(context, node.sandbox);
  });
  context.subscriptions.push(editSandboxCommand);

  // Delete Sandbox command
  const deleteSandboxCommand = vscode.commands.registerCommand('b2cc-content-editor.deleteSandbox', async node => {
    let confirmation = await vscode.window.showInformationMessage("Delete Sandbox?", "Yes", "No");
    if (confirmation === 'Yes') {
      await node.sandbox.delete();
    }
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
