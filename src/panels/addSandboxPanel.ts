import * as vscode from 'vscode';
import { Sandbox } from '../Sandbox';
import { getNonce } from '../utilities/getNonce';
import { getUri } from '../utilities/getUri';
import sandboxes from '../Sandboxes';

export class AddSandboxPanel {
  // public static currentPanel: AddSandboxPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, sandbox?: Sandbox) {
    this.panel = panel;

    this.panel.onDidDispose(this.dispose, null, this._disposables);

    this.panel.webview.html = this._getWebviewContent(this.panel.webview, context.extensionUri, sandbox);
  }

  // Render the AddSandboxPanel
  public static render(context: vscode.ExtensionContext, sandbox?: Sandbox) {
    const viewType = sandbox ? 'editSandboxConfiguration' : 'addSandboxConfiguration';
    const title = sandbox ? 'Edit Sandbox' : 'Add Sandbox';
    const panel = vscode.window.createWebviewPanel(viewType, title, vscode.ViewColumn.One, { enableScripts: true });

    let currentPanel = new AddSandboxPanel(panel, context, sandbox);

    // Receiving message from webview
    currentPanel.panel.webview.onDidReceiveMessage(async message => {

      if (sandbox) {
        // Edit the current sandbox
        sandbox.name = message.name;
        sandbox.host = message.host;
        sandbox.id = message.id;
        sandbox.password = message.password;
        await sandboxes.save();
      } else {
        // Add new Sandbox
        await sandboxes.add(new Sandbox(message.name, message.host, message.id, message.password));
      }

      // TODO: Update context for sandbox panel welcome message

      // Close the Add Sandbox Panel
      currentPanel.panel.dispose();
    });
  }
  // }

  // addSandboxPanel deconstructor
  public dispose() {
    // AddSandboxPanel.currentPanel = undefined;

    this.panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  // Get the content of the webview
  private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, sandbox?: Sandbox) {
    const toolkitUri = getUri(webview, extensionUri, [
      'node_modules',
      '@vscode',
      'webview-ui-toolkit',
      'dist',
      'toolkit.js'
    ]);

    const stylesUri = getUri(webview, extensionUri, ['resources', 'addSandbox', 'styles.css']);
    const scriptUri = getUri(webview, extensionUri, ['resources', 'addSandbox', 'script.js']);
    const nonce = getNonce();

    // If editing a sandbox, pass values to webview
    const sandboxName = sandbox ? sandbox.name : '';
    const sandboxHost = sandbox ? sandbox.host : '';
    const sandboxId = sandbox ? sandbox.id : '';
    const sandboxPassword = sandbox ? sandbox.password : '';
    const ocapiVersion = sandbox ? sandbox.version : '';
    const title = sandbox ? 'Edit Sandbox' : 'Add a New Sandbox';

    return /*html*/`
      <!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src ${webview.cspSource}; style-src ${webview.cspSource};">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sandbox Configuration</title>
        <link rel="stylesheet" href="${stylesUri}">
        <script type="module" src="${toolkitUri}"></script>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </head>

      <body>
        <h1>${title}</h1>

        <vscode-divider role="presentation"></vscode-divider>

        <div class='form-control'>
          <vscode-text-field id='name' name='name' placeholder="John's Sandbox, Development, Staging, etc..." value='${sandboxName}'>Sandbox Name</vscode-text-field>
          <div class='form-helper'></div>
        </div>

        <div class='form-control'>
          <vscode-text-field id='host' name='host' placeholder='abcd-123.sandbox.us01.dx.commercecloud.salesforce.com' value='${sandboxHost}'>Hostname</vscode-text-field>
          <div class='form-helper'>Do not include the protocol (https://, etc)</div>
        </div>

        <vscode-divider role="presentation"></vscode-divider>

        <h1>API Client</h1>

        <p>API Client ID's and Password's can be created by an Account Administrator in the <a href='https://documentation.b2c.commercecloud.salesforce.com/DOC1/topic/com.demandware.dochelp/content/b2c_commerce/topics/account_manager/b2c_account_manager_overview.html'>Account Manager</a>. For more information, see the <a href='https://documentation.b2c.commercecloud.salesforce.com/DOC1/index.jsp?topic=%2Fcom.demandware.dochelp%2Fcontent%2Fb2c_commerce%2Ftopics%2Faccount_manager%2Fb2c_account_manager_add_api_client_id.html'>Add an API Client documentation</a>.</p>

        <div class='form-control'>
          <vscode-text-field id='client-id' name='client-id' value='${sandboxId}'>API Client ID</vscode-text-field>
        </div>

        <div class='form-control'>
          <vscode-text-field id='client-password' name='client-password' value='${sandboxPassword}'>API Client Password</vscode-text-field>
        </div>

        <div class='form-control'>
          <vscode-text-field id='ocapi-version' name='ocapi-version' placeholder='XX.XX'value='${ocapiVersion}'>OCAPI Version</vscode-text-field>
        </div>

        <p>It's recommended to choose the latest OCAPI Version that your sandbox supports. To determine the latest version, check the footer of any Business Manager page. The version is always in the format of XX.XX, for example: 22.10 or 18.3</p>

        <vscode-divider role="presentation"></vscode-divider>

        <h3>Sandbox OCAPI Settings</h3>

        <p>After filling out the above configuration, copy/paste the following <a href='https://documentation.b2c.commercecloud.salesforce.com/DOC1/topic/com.demandware.dochelp/OCAPI/current/usage/OCAPISettings.html'>OCAPI Settings</a> in Business Manager under Administration > Site Development > Open Commerce API Settings. Choose the "Data" dropdown.</p>

        <pre id='settings'>
{
  "_v" : "",
  "clients":
  [
    {
      "client_id":"",
      "resources":
      [
        {
          "resource_id":"/libraries/*/content/*",
          "methods":["get", "patch", "put", "delete"],
          "read_attributes":"(**)",
          "write_attributes":"(**)"
        }
      ]
    }
  ]
}</pre>

        <p>These OCAPI Settings will allow Visual Studio Code to interact directly with the content assets on your Sandbox.</p>

        <vscode-divider role="presentation"></vscode-divider>

        <vscode-button appearance="primary" id='save' disabled>Save New Sandbox</vscode-button>

        <div>
          <div id='form-error'></div>
        </div>

       </body>

      </html>`;
  }
}
