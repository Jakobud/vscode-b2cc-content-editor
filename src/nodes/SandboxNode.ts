import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { AbstractBaseNode } from './AbstractBaseNode';

export class SandboxNode extends AbstractBaseNode {
	constructor(readonly message: string) {
		super();
	}

	getTreeItem() {
		const text = this.message;
		const node = new TreeItem(text, TreeItemCollapsibleState.None);
		node.tooltip = text;

		return node;
	}
}
