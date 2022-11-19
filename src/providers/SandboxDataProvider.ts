import { ExtensionContext } from 'vscode';
import { BaseTreeDataProvider } from './BaseTreeDataProvider';
import { AbstractBaseNode } from '../nodes/AbstractBaseNode';
import { SandboxNode } from '../nodes/SandboxNode';
import { Sandbox } from '../Sandbox';
import { listenerCount } from 'process';
import { LocalStorage } from '../utilities/LocalStorage';

export class SandboxDataProvider extends BaseTreeDataProvider {
  private context;

  constructor(context: ExtensionContext) {
    super();

    this.context = context;
  }

  getTreeItem(element: AbstractBaseNode) {
    return element.getTreeItem();
  }

  getChildren(element: SandboxNode | undefined): SandboxNode[] {
    let storage = new LocalStorage(this.context);

    let sandboxes = storage.getSandboxes();

    // Sort Sandboxes by name
    sandboxes.sort((a, b) => {
      return (a['name'].toUpperCase() > b['name'].toUpperCase()) ? 1 : -1;
    });

    let children: any[] = [];

    sandboxes.forEach(sandbox => {
      children.push(new SandboxNode(sandbox.name, sandbox.host));
    });

    return children;
  }
}
