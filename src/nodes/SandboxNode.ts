import { TreeItem, TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import { AbstractBaseNode } from './AbstractBaseNode';

export class SandboxNode extends AbstractBaseNode {
	private text;
	private description;

	constructor(text: string, description: string) {
		super();
		this.text = text;
		this.description = description;
	}

	getTreeItem() {
		const node = new TreeItem(this.text, TreeItemCollapsibleState.None);
		node.tooltip = this.text;
		node.description = this.description;
		node.iconPath = new ThemeIcon('symbol-method');

		return node;
	}
}
