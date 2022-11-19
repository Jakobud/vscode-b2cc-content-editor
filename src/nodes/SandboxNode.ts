import { TreeItem, TreeItemCollapsibleState } from 'vscode';
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

		return node;
	}
}
