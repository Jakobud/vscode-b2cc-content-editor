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
    checkInputs(saveButton);
  });

  const clientPasswordInput = document.getElementById("client-password");
  clientPasswordInput.addEventListener('keyup', () => {
    checkInputs(saveButton);
  });

  function checkInputs(button) {
    if (validate()) {
      button.removeAttribute('disabled');
    } else {
      button.setAttribute('disabled', 'disabled');
    }
  }

  function validate() {
    return (nameInput.value.trim().length > 0 && hostInput.value.trim().length > 0 && clientIdInput.value.trim().length > 0 && clientPasswordInput.value.trim().length > 0);
  }

  function save() {
    if (validate()) {
      vscode.postMessage({
        name: nameInput.value,
        host: hostInput.value,
        id: clientIdInput.value,
        password: clientPasswordInput.value
      });
    }
  }
}

window.addEventListener('message', event => {
  if (event.data.type === 'error') {
    let element = document.getElementById('form-error');
    element.innerHTML = event.data.message;
    element.classList.add('visible');
  }
});
