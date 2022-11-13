export class Sandbox {
  private host: string;
  private id: string;
  private password: string;

  public constructor(host: string, id: string, password: string) {
    this.host = host;
    this.id = id;
    this.password = password;
  }
}
