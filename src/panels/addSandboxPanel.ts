import * as vscode from 'vscode';
import { getUri } from '../utilities/getUri';

export class AddSandboxPanel {
  public static currentPanel: AddSandboxPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;

    this._panel.onDidDispose(this.dispose, null, this._disposables);

    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
  }

  public static render(extensionUri: vscode.Uri) {
    if (AddSandboxPanel.currentPanel) {
      AddSandboxPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel("addSandboxConfiguration", "Add a Sandbox", vscode.ViewColumn.One, {
        enableScripts: true,
      });

      AddSandboxPanel.currentPanel = new AddSandboxPanel(panel, extensionUri);
    }
  }

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

  private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const toolkitUri = getUri(webview, extensionUri, [
      'node_modules',
      '@vscode',
      'webview-ui-toolkit',
      'dist',
      'toolkit.js'
    ]);

    const stylesUri = getUri(webview, extensionUri, ['resources', 'styles.css']);

    return /*html*/`
      <!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="module" src="${toolkitUri}"></script>
        <title>Sandbox Configuration</title>
        <link rel="stylesheet" href="${stylesUri}">
      </head>

      <body>
        <h1>Add a new Sandbox</h1>

        <hr/>

        <div class='form-control'>
          <vscode-text-field autofocus name='host-name' placeholder='abcd-123.sandbox.us01.dx.commercecloud.salesforce.com'>Host Name</vscode-text-field>
          <div class='form-helper'>Do not include the protocol (https://, etc)</div>
        </div>

        <div class='form-control'>
          <vscode-text-field name='client-id' placeholder='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'd>Client Application ID</vscode-text-field>
        </div>

        <div class='form-control'>
          <vscode-text-field name='client-password' placeholder='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'd>Client Application Password</vscode-text-field>
        </div>

        <hr>

        <h3>Client ID creation</h3>

        <p>API Client ID's and Password's can be created by an Account Administrator in the Account Manager. For more information, see the <a href='https://documentation.b2c.commercecloud.salesforce.com/DOC1/index.jsp?topic=%2Fcom.demandware.dochelp%2Fcontent%2Fb2c_commerce%2Ftopics%2Faccount_manager%2Fb2c_account_manager_add_api_client_id.html'>Add an API Client page</a> in the <a href='https://documentation.b2c.commercecloud.salesforce.com/DOC1/index.jsp'>B2C Commerce Documentation</a>.</p>

        <h3>OCAPI Sandbox configuration</h3>

        <p>

        https://documentation.b2c.commercecloud.salesforce.com/DOC1/topic/com.demandware.dochelp/OCAPI/current/usage/OCAPISettings.html

      </body>

      </html>`;
  }
}