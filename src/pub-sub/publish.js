import { tryConnect, publish, getDefaultNatsUrl, getConnection, tryDisconnect } from './lib.js';

const updateOutput = (fields) => {
  const output = document.getElementById('output');
  output.innerHTML = `<span>Successfully published message to '${fields.subject.value}'<span/>`;
  window.setTimeout(() => {
    output.innerHTML = '';
  }, 1500);
};

/**
 * init form fields and form state
 */
const init = async () => {
  const fields = {
    url: document.getElementById('nats-url'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message'),
  };

  fields.url.value = getDefaultNatsUrl();

  // init listener for publishing a message
  const publishButton = document.getElementById('publish');
  publishButton.addEventListener('click', async () => {
    console.log(`attempting to connect to server: ${fields.url.value}`);
    const conn = getConnection();
    publish({ conn, subject: fields.subject.value, msg: fields.message.value });
    updateOutput(fields);
  });

  // init listener for connecting to nats server
  const connectButton = document.getElementById('connect');
  connectButton.addEventListener('click', async () => {
    const shouldConnect = connectButton.innerText === 'Connect';
    if (shouldConnect) {
      tryConnect({ servers: [fields.url.value], connectButton, actionButton: publishButton });
    } else {
      tryDisconnect({ connectButton, actionButton: publishButton });
    }
  });
};

init();
