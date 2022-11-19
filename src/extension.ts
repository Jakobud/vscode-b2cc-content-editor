import * as vscode from 'vscode';
import { AddSandboxPanel } from './panels/addSandboxPanel';
import { SandboxDataProvider } from './providers/SandboxDataProvider';
import { Sandbox } from './Sandbox';
import { LocalStorage } from './utilities/LocalStorage';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let storage = new LocalStorage(context);

	// Show the Add Sandbox panel
	const addSandboxCommand = vscode.commands.registerCommand('b2cc-content-editor.addSandbox', () => {
		AddSandboxPanel.render(context);
	});
	context.subscriptions.push(addSandboxCommand);

	const editSandboxCommand = vscode.commands.registerCommand('b2cc-content-editor.editSandbox', sandbox => {
		console.log("EDIT SANDBOX COMMAND");
		console.log(sandbox);
	});
	context.subscriptions.push(editSandboxCommand);

	const deleteSandboxCommand = vscode.commands.registerCommand('b2cc-content-editor.deleteSandbox', () => {
		console.log("DELETE SANDBOX COMMAND");
	});
	context.subscriptions.push(deleteSandboxCommand);

	// vscode.commands.executeCommand('setContext', 'b2cc-content-editor.sandboxesWelcomeView', Object.keys(sandboxes).length > 0);

	// Show the Sandboxes
	// context.globalState.update('sandboxes', null);
	// let sandbox = new Sandbox("My sandbox1", "test.jake.com", "aaa", "123");
	// storage.addSandbox(sandbox);
	// console.log(storage.getSandboxes());
	// console.log('+++', storage.getSandboxes(), '+++');

	// console.log(Object.keys(sandboxes));

	// for (let c = 0; c < sandboxes.length; c++) {
	// 	const element = sandboxes[c];
	// 	console.log(typeof(element));
	// }

	const sandboxDataProvider = new SandboxDataProvider(context);
	vscode.window.registerTreeDataProvider('b2cc-content-editor.views.sandboxes', sandboxDataProvider);
}

// This method is called when your extension is deactivated
export function deactivate() { }
