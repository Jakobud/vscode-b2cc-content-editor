export interface SandboxInterface {
  name: string,
  host: string,
  id: string,
  password: string,
  delete(): Promise<void>
}
