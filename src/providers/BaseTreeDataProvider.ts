import { AbstractBaseNode } from "../nodes/AbstractBaseNode";
import { TreeDataProvider, Disposable, TreeItem, ProviderResult } from "vscode";

export abstract class BaseTreeDataProvider implements TreeDataProvider<AbstractBaseNode>, Disposable {
	getTreeItem(element: AbstractBaseNode): TreeItem | Thenable<TreeItem> {
		return element.getTreeItem();
	}

	abstract getChildren(element?: AbstractBaseNode | undefined): ProviderResult<AbstractBaseNode[]>;

	refresh() {}

	dispose() {}

	getParent(element: AbstractBaseNode): ProviderResult<AbstractBaseNode> {
		return element.getParent();
	}
}
