import * as vscode from 'vscode';
import { Sandbox } from '../Sandbox';
import { getNonce } from '../utilities/getNonce';
import { getUri } from '../utilities/getUri';

export class AddSandboxPanel {
  public static currentPanel: AddSandboxPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    this._panel = panel;

    this._panel.onDidDispose(this.dispose, null, this._disposables);

    this._panel.webview.html = this._getWebviewContent(this._panel.webview, context.extensionUri);
  }

  // Render the AddSandboxPanel
  public static render(context: vscode.ExtensionContext) {
    if (AddSandboxPanel.currentPanel) {
      AddSandboxPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel("addSandboxConfiguration", "Add a Sandbox", vscode.ViewColumn.One, {
        enableScripts: true,
      });

      let state = context.globalState;

      AddSandboxPanel.currentPanel = new AddSandboxPanel(panel, context);

      AddSandboxPanel.currentPanel._panel.webview.onDidReceiveMessage(message => {

        // Create sandboxes global state if it doesn't exist
        if (!context.globalState.get('sandboxes')) {
          context.globalState.update('sandboxes', {});
        }

        // Get saved sandboxes
        let sandboxes: any = context.globalState.get('sandboxes');

        // Does saved sandbox already exist?
        if (!sandboxes[message.host]) {

          let sandbox = new Sandbox(message.host, message.clientId, message.clientPassword);

          sandboxes[message.host] = sandbox;
          context.globalState.update('sandboxes', sandboxes);

          // TODO: Update context for sandbox panel welcome message

          // Close the Add Sandbox Panel
          AddSandboxPanel.currentPanel?._panel.dispose();
        } else {
          // Pass error back to webview panel
          AddSandboxPanel.currentPanel?._panel.webview.postMessage({
            type: 'error',
              message: 'Sandbox configuration already exists for: ' + message.host
          });
        }
      });
    }
  }

  // addSandboxPanel deconstructor
  public dispose() {
    AddSandboxPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  // Get the content of the webview
  private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
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
        <h1>Add a New Sandbox</h1>

        <vscode-divider role="presentation"></vscode-divider>

        <div class='form-control'>
          <vscode-text-field id='host' name='host' placeholder='abcd-123.sandbox.us01.dx.commercecloud.salesforce.com'>Host Name</vscode-text-field>
          <div class='form-helper'>Do not include the protocol (https://, etc)</div>
        </div>

        <vscode-divider role="presentation"></vscode-divider>

        <h1>API Client</h1>

        <div class='form-control'>
          <vscode-text-field id='client-id' name='client-id'>API Client ID</vscode-text-field>
        </div>

        <div class='form-control'>
          <vscode-text-field id='client-password' name='client-password'>API Client Password</vscode-text-field>
        </div>

        <p>API Client ID's and Password's can be created by an Account Administrator in the <a href='https://documentation.b2c.commercecloud.salesforce.com/DOC1/topic/com.demandware.dochelp/content/b2c_commerce/topics/account_manager/b2c_account_manager_overview.html'>Account Manager</a>. For more information, see the <a href='https://documentation.b2c.commercecloud.salesforce.com/DOC1/index.jsp?topic=%2Fcom.demandware.dochelp%2Fcontent%2Fb2c_commerce%2Ftopics%2Faccount_manager%2Fb2c_account_manager_add_api_client_id.html'>Add an API Client documentation</a>.</p>

        <vscode-divider role="presentation"></vscode-divider>

        <h3>Sandbox OCAPI Settings</h3>

        <p>Once you have a Client ID and Password, they must be added to the <a href='https://documentation.b2c.commercecloud.salesforce.com/DOC1/topic/com.demandware.dochelp/OCAPI/current/usage/OCAPISettings.html'>OCAPI Settings</a> in Business Manager under Administration > Site Development > Open Commerce API Settings.</p>

        <p>These settings go under the Data type. NOT the Shop type.</p>

        <p>Update the <span class='monospace'>client_id</span> value with your unique Client ID (see above). If you are using a different OCAPI version than v22.10, update that as well.</p>

        <vscode-text-area readonly class='monospace' rows=20 cols=65 value='
{
  "_v" : "22.10",
  "clients":
  [
    {
      "client_id":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
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
}'></vscode-text-area>

        <h3>Warning about the default Client ID</h3>

        <p>By default, all B2C Commerce Sandboxes accepts the default Client ID of <span class='monospace'>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span> with a password of <span class='monospace'>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span>. Once this client is added to the OCAPI Settings with resource permissions (see above), then this Client ID can be used without the need for a unique Client ID created for you by an Account Administrator.

        <p>However, be careful with this default Client ID. Use it only for testing purposes. Once added to the Sandbox OCAPI Settings, anyone can use it to access the allowed resources via OCAPI-driven tools & scripts, even if they do not have Business Manager access.</p>

        <vscode-divider role="presentation"></vscode-divider>

        <vscode-button appearance="primary" id='save' disabled>Save New Sandbox</vscode-button>

        <div>
          <div id='form-error'></div>
        </div>

       </body>

      </html>`;
  }
}