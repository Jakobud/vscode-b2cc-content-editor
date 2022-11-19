import { Disposable, TreeItem } from "vscode";

export abstract class AbstractBaseNode implements Disposable {
	public disposables: Disposable[] = [];

	constructor(private parent?: AbstractBaseNode) {
		this.parent = parent;
	}

	abstract getTreeItem(): Promise<TreeItem> | TreeItem;

	async getChildren(element?: AbstractBaseNode): Promise<AbstractBaseNode[]> {
		return [];
	}

	dispose() {
		if (this.disposables) {
			this.disposables.forEach(d => d.dispose());
		}
	}

	getParent(): AbstractBaseNode | undefined {
		return this.parent;
	}
}
