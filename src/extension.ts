import * as vscode from 'vscode';
import { AddSandboxPanel } from './panels/addSandboxPanel';
import { SandboxDataProvider } from './providers/SandboxDataProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-b2cc-content-editor" is now active!');

	// Show the Add Sandbox panel
	const addSandboxCommand = vscode.commands.registerCommand('b2cc-content-editor.addSandbox', () => {
		AddSandboxPanel.render(context);
	});
	context.subscriptions.push(addSandboxCommand);

	// vscode.commands.executeCommand('setContext', 'b2cc-content-editor.sandboxesWelcomeView', Object.keys(sandboxes).length > 0);



	// Show the Sandboxes
	context.globalState.update('sandboxes', null);
	// let sandboxes = context.globalState.get('sandboxes') || [];

	// console.log(Object.keys(sandboxes));

	// for (let c = 0; c < sandboxes.length; c++) {
	// 	const element = sandboxes[c];
	// 	console.log(typeof(element));
	// }

	// const sandboxDataProvider = new SandboxDataProvider(context);
	// vscode.window.registerTreeDataProvider('b2cc-content-editor.views.sandboxes', sandboxDataProvider);
}

// This method is called when your extension is deactivated
export function deactivate() { }
