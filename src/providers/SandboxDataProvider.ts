import { ExtensionContext } from 'vscode';
import { BaseTreeDataProvider } from './BaseTreeDataProvider';
import { AbstractBaseNode } from '../nodes/AbstractBaseNode';
import { SandboxNode } from '../nodes/SandboxNode';
import { Sandbox } from '../Sandbox';
import { listenerCount } from 'process';

export class SandboxDataProvider extends BaseTreeDataProvider {
  private context;

  constructor(context: ExtensionContext) {
    super();

    this.context = context;
  }

  getTreeItem(element: AbstractBaseNode) {
    return element.getTreeItem();
  }

  async getChildren(element: SandboxNode | undefined) {
    let sandboxes: Sandbox[] = this.context.globalState.get('sandboxes') || [];

    console.log(sandboxes);

    // for (let c = 0; c < sandboxes.length; c++) {
    //   sandboxes[c].name = sandboxes[c]['_name'];
    // }

    // Sort Sandboxes by name
    // sandboxes.sort((a, b) => {
    //   return (a['_name'].toUpperCase() > b['_name'].toUpperCase()) ? 1 : -1;
    // });

    // for (let c = 0; c < sandboxes.length; c++) {
    //   console.log(sandboxes[c]['_name']);
    //   console.log(sandboxes[c].getName());
    // }

    // let children: any[] = [];

    // console.log(children);
    // console.log(sandboxes);

    // for (let c = 0; c < sandboxes.length; c++) {
    //   console.log('testing 123');
    //   const element = sandboxes[c];
    //   console.log(typeof(sandboxes[c]));
    //   console.log(sandboxes[c]['_name']);
    //   console.log(sandboxes[c].getName());
    //   children.push(new SandboxNode(sandboxes[c]['_name']));
    // }


    // console.log(children);

    // console.log(sandboxes);


    // console.log(sandboxes);
    // console.log(sorted);

    // const name = 'Client ABC Sandbox' as string;

    // console.log(sandboxes[name]);

    // let children: any[] = [];

    // Object.keys(sandboxes).sort().forEach((name: keyof Sandbox) => {
    //   children.push(sandboxes[name]);
    // });

    return children || [];
    // return [];
  }
}
