import { readFile } from 'fs/promises';
import { resolve } from 'path';

export function addSandbox():string {
  return `<!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sandbox Configuration</title>
    <style>
      body {
        font-size: 1rem;
      }

      label {
        display: block;
        margin: 1rem 0 0.5rem 0;
      }

      input[type='text'] {
        padding: 0.5rem;
        width: 100%;
        max-width: 500px;
        font-family: monospace;
        font-size: 1rem;
        display: block;
        border-radius: 5px;
      }

      ::placeholder {
        color: rgba(0,0,0,0.5);
      }

      .hint {
        font-size: 0.9rem;
        margin-top: 0.5rem;
        font-style: italic;
      }

    </style>
  </head>

  <body>
    <h1>Add a new B2C Commerce Sandbox</h1>

    <hr/>

    <label>Host name</label>
    <input type='text' placeholder='abcd-123.sandbox.us01.dx.commercecloud.salesforce.com'/>
    <div class='hint'>Do not include the protocol (https://, etc)</div>

    <label>Client ID</label>
    <input type='text' placeholder='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' />

    <label>Client Password</label>
    <input type='text' placeholder='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' />
  </body>

  </html>`;
}
