export interface SandboxInterface {
  name: string,
  host: string,
  id: string,
  password: string,
  version: string,
  delete(): Promise<void>
}
