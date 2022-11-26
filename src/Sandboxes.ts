import * as vscode from 'vscode';
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

  /**
   * Get all sandboxes
   * @returns []
   */
  public getAll(): [] {
    return this.sandboxes || [];
  }

  /**
   * Add a new Sandbox
   * @param sandbox The Sandbox being added
   */
  public async add(sandbox: Sandbox) {
    if (!this.sandboxes) {
      this.sandboxes = {};
    }
    this.sandboxes.push(sandbox);
    await this.save();
  }

  /**
   * Delete a Sandbox by reference
   * @param sandbox The Sandbox to be deleted
   */
  public async delete(sandbox: Sandbox) {
    if (this.sandboxes && this.sandboxes.indexOf(sandbox)) {
      let index = this.sandboxes.indexOf(sandbox);
      this.sandboxes.splice(index, 1);
    }
    await this.save();
  }

  /**
   * Delete all Sandboxes
   */
  public async deleteAll() {
    this.sandboxes = undefined;
    await this.save();
  }

  /**
   * Save sandboxes to extension globalState and refresh the sandbox panel list
   */
  private async save() {
    await this.state?.update(this.key, this.sandboxes);

    // Refresh the sandbox panel list
    vscode.commands.executeCommand('b2cc-content-editor.refreshSandboxes');
  }
}

export default new Sandboxes();
