const vscode = acquireVsCodeApi();

window.addEventListener('load', main);

function main() {
  const saveButton = document.getElementById("save");
  saveButton.addEventListener("click", save);

  const nameInput = document.getElementById("name");
  nameInput.addEventListener('keyup', () => {
    checkInputs(saveButton);
  });

  const hostInput = document.getElementById("host");
  hostInput.addEventListener('keyup', () => {
    checkInputs(saveButton);
  });

  const clientIdInput = document.getElementById("client-id");
  clientIdInput.addEventListener('keyup', () => {
    generateSettingsString();
    checkInputs(saveButton);
  });

  const clientPasswordInput = document.getElementById("client-password");
  clientPasswordInput.addEventListener('keyup', () => {
    checkInputs(saveButton);
  });

  const ocapiVersionInput = document.getElementById("ocapi-version");
  ocapiVersionInput.addEventListener('keyup', () => {
    generateSettingsString();
    checkInputs(saveButton);
  });

  function checkInputs(button) {
    if (validate()) {
      button.removeAttribute('disabled');
    } else {
      button.setAttribute('disabled', 'disabled');
    }
  }

  checkInputs(saveButton);

  function validate() {
    return (nameInput.value.trim().length > 0 && hostInput.value.trim().length > 0 && clientIdInput.value.trim().length > 0 && clientPasswordInput.value.trim().length > 0);
  }

  function save() {
    if (validate()) {
      vscode.postMessage({
        name: nameInput.value.trim(),
        host: hostInput.value.trim(),
        id: clientIdInput.value.trim(),
        password: clientPasswordInput.value.trim(),
        version: ocapiVersionInput.value.trim(),
        libraries: {}
      });
    }
  }

  const settings = document.getElementById('settings');
  function generateSettingsString() {
    settings.innerHTML = settingsString.replace('##version##', ocapiVersionInput.value).replace('##client_id##', clientIdInput.value);
  }
  generateSettingsString();

  const nextButtons = document.querySelectorAll('vscode-button.next');
  nextButtons.forEach(button => {
    button.addEventListener('click', function () {
      alert('test')
      document.querySelector('vscode-panel-tab[aria-selected="true"]').nextElementSibling.click();
    });
  });

  const prevButtons = document.querySelectorAll('vscode-button.prev');
  prevButtons.forEach(button => {
    button.addEventListener('click', function () {
      document.querySelector('vscode-panel-tab[aria-selected="true"]').previousElementSibling.click();
    });
  });

}

window.addEventListener('message', event => {
  if (event.data.type === 'error') {
    let element = document.getElementById('form-error');
    element.innerHTML = event.data.message;
    element.classList.add('visible');
  }
});

const settingsString = `
{
  "_v" : "##version##",
  "clients":
  [
    {
      "client_id":"##client_id##",
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
}`
