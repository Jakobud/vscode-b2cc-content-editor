import { randomUUID } from "crypto";
import { ExtensionContext, Memento } from "vscode";
import { Sandbox } from "./Sandbox";

interface SandboxInterface {
  [uuid: string] : {
    name: string,
    host: string,
    id: string,
    password: string
  }
}

class Sandboxes {
  private key = 'sandboxes';
  private state?: Memento;
  private sandboxes?: any;

  constructor() {}

  public async init(context: ExtensionContext) {
    this.state = context.globalState;
    this.sandboxes = [];
    let sandboxes: SandboxInterface = this.state.get(this.key, {});

    // Convert globalState sandbox objects to Sandbox class objects
    for (const [key, value] of Object.entries(sandboxes)) {
      let sandbox = new Sandbox(value.name, value.host, value.id, value.password);
      this.sandboxes.push(sandbox);
    }
    await this.save();
  }

  public getAll(): {} {
    return this.sandboxes || {};
  }

  public get(uuid: string): any {
    let sandbox = this.sandboxes[uuid];
    return sandbox ? sandbox : undefined;
  }

  public async add(sandbox: Sandbox) {
    let uuid = randomUUID();
    if (!this.sandboxes) {
      this.sandboxes = {};
    }
    this.sandboxes[uuid] = sandbox;
    await this.save();
  }

  public async delete(uuid: string) {
    this.sandboxes[uuid] = undefined;
    await this.save();
  }

  public async update(uuid: string, sandbox: Sandbox) {
    if (!this.sandboxes) {
      this.sandboxes = {};
    }
    if (this.sandboxes[uuid]) {
      this.sandboxes[uuid] = sandbox;
      await this.save();
    }
  }

  public async deleteAll() {
    this.sandboxes = undefined;
    await this.save();
  }

  private async save() {
    await this.state?.update(this.key, this.sandboxes);
  }
}

export default new Sandboxes();
