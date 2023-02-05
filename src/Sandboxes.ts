import * as vscode from 'vscode';
import { ExtensionContext, Memento } from "vscode";
import { Sandbox } from "./Sandbox";
import { SandboxInterface } from './Sandbox';

class Sandboxes {
  private key = 'sandboxes';
  private state?: Memento;
  private sandboxes?: Sandbox[];

  constructor() {}

  public async init(context: ExtensionContext) {
    this.state = context.globalState;
    let sandboxes: SandboxInterface[] = this.state.get(this.key, []);
    
    console.log(sandboxes);

    // Convert globalState sandbox objects to Sandbox class objects
    this.sandboxes = [];
    for (const [key, value] of Object.entries(sandboxes)) {
      let sandbox = new Sandbox(value.name, value.host, value.id, value.password, value.version, value.libraries);
      this.sandboxes.push(sandbox);
    }
    await this.save();
  }

  /**
   * Get all sandboxes
   * @returns []
   */
  public getAll(): Sandbox[] {
    return this.sandboxes || [];
  }

  /**
   * Add a new Sandbox
   * @param sandbox The Sandbox being added
   */
  public async add(sandbox: Sandbox) {
    if (!this.sandboxes) {
      this.sandboxes = [];
    }
    this.sandboxes.push(sandbox);
    await this.save();
  }

  /**
   * Delete a Sandbox by reference
   * @param sandbox The Sandbox to be deleted
   */
  public async delete(sandbox: Sandbox) {
    // If the sandbox exists
    if (this.sandboxes && this.sandboxes.indexOf(sandbox) !== -1) {
      // Splice the sandbox out of the list if the array is more than 1 element
      if (this.sandboxes.length > 1) {
        let index = this.sandboxes.indexOf(sandbox);
        this.sandboxes.splice(index, 1);
      } else {
        this.sandboxes = [];
      }
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
  public async save() {
    await this.state?.update(this.key, this.sandboxes);

    // Refresh the sandbox panel list
    vscode.commands.executeCommand('b2cc-content-editor.refreshSandboxes');
  }
}

export default new Sandboxes();
