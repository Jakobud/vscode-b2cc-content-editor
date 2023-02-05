import * as vscode from 'vscode';
import { BaseTreeDataProvider } from './BaseTreeDataProvider';
import { AbstractBaseNode } from '../nodes/AbstractBaseNode';
import { SandboxNode } from '../nodes/SandboxNode';
import { SandboxInterface } from '../Sandbox';
import sandboxes from '../Sandboxes';
import natsort from 'natsort';

export class SandboxDataProvider extends BaseTreeDataProvider {
  constructor() {
    super();
  }

  getTreeItem(element: AbstractBaseNode) {
    // console.log(element);
    return element.getTreeItem();
  }

  getChildren(element: SandboxNode | undefined): SandboxNode[] {
    // console.log(element);
    let children: any[] = [];
    let allSandboxes: SandboxInterface[] = Object.values(sandboxes.getAll());

    const sorter = natsort({ insensitive: true});

    allSandboxes.sort((a: any, b: any) => {
      return sorter(a.name, b.name);
    });

    allSandboxes.forEach(sandbox => {
      children.push(new SandboxNode(sandbox));
    });

    return children;
  }

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}
