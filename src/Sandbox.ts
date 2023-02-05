import sandboxes from "./Sandboxes";
import { JSONArray } from "./interfaces/JSON";

export interface SandboxInterface {
  name: string,
  host: string,
  id: string,
  password: string,
  version: string,
  libraries: JSONArray,
  delete(): Promise<void>,
}

export class Sandbox {
  public name: string;
  public host: string;
  public id: string;
  public password: string;
  public version: string;
  public libraries: JSONArray; 

  public constructor(
    name: string,
    host: string, 
    id: string, 
    password: string, 
    version: string, 
    libraries: JSONArray) {

    this.name = name;
    this.host = host;
    this.id = id;
    this.password = password;
    this.version = version;
    this.libraries = libraries;
  }

  public async delete(): Promise<void> {
    await sandboxes.delete(this);
  }
}
