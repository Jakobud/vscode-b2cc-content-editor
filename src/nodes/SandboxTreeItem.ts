import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { Sandbox } from "../Sandbox";

export class SandboxTreeItem extends TreeItem {
  public sandbox;

  constructor(sandbox: Sandbox) {
    super(sandbox.name, TreeItemCollapsibleState.None);
    this.sandbox = sandbox;
  }
}
