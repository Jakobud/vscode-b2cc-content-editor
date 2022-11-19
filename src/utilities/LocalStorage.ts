import { ExtensionContext } from "vscode";
import { Sandbox } from "../Sandbox";

export class LocalStorage {
  private state;

  constructor(context: ExtensionContext) {
    this.state = context.globalState;
    return this;
  }

  public getSandboxes() {
    let sandboxes: Sandbox[] = [];
    this.state.get<Sandbox[]>('sandboxes', []).forEach(sandbox => {
      sandboxes.push(new Sandbox(sandbox.name, sandbox.host, sandbox.id, sandbox.password));
    });
    return sandboxes;
  }

  public async addSandbox(sandbox: Sandbox) {
    let sandboxes = this.getSandboxes();
    sandboxes.push(sandbox);
    await this.state.update('sandboxes', sandboxes);
  }
}