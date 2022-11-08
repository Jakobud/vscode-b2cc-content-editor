// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { config } from 'process';
import * as vscode from 'vscode';
import { readFile } from 'fs/promises';
import { addSandbox } from './webViews';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-b2cc-content-editor" is now active!');

	let disposable = vscode.commands.registerCommand('b2cc-content-editor.addSandbox', () => {
		// vscode.window.showInformationMessage('Add a sandbox!');
		// config.b2ccContentEditor.asset.visible = true;
		const panel = vscode.window.createWebviewPanel(
			'sandboxConfiguration',
			'Sandbox',
			vscode.ViewColumn.One,
			{}
		);

		panel.webview.html = addSandbox();
	});

	context.subscriptions.push(disposable);
}

// let obj: webViews = {};

// async function getAddSandboxWebviewContent() {
// 	if (!webViews.addSandbox.html) {
// 		webViews.addSandbox.html = (await readFile('./webViews/addSandbox/addSandbox.html')).toString();
// 	}

// 	return webViews.addSandbox.html;
// }

// This method is called when your extension is deactivated
export function deactivate() { }
