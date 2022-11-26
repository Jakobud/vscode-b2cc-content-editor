import { ThemeIcon } from 'vscode';
import { Sandbox } from '../Sandbox';
import { AbstractBaseNode } from './AbstractBaseNode';
import { SandboxTreeItem } from './SandboxTreeItem';

export class SandboxNode extends AbstractBaseNode {
	private sandbox: Sandbox;

	constructor(sandbox: Sandbox) {
		super();
		this.sandbox = sandbox;
	}

	getTreeItem() {
		const node = new SandboxTreeItem(this.sandbox);
		node.tooltip = this.sandbox.name;
		node.description = this.sandbox.host;
		node.iconPath = new ThemeIcon('symbol-method');
		return node;
	}
}
