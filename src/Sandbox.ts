import sandboxes from "./Sandboxes";

export class Sandbox {
  public name: string;
  public host: string;
  public id: string;
  public password: string;
  public version: string;

  public constructor(name: string, host: string, id: string, password: string, version: string) {
    this.name = name;
    this.host = host;
    this.id = id;
    this.password = password;
    this.version = version;
  }

  public async delete(): Promise<void> {
    await sandboxes.delete(this);
  }
}
