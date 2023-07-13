import { getConnection, publish } from './lib.js';

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

  // init listener for publishing a message
  const trigger = document.getElementById('publish');
  trigger.addEventListener('click', async () => {
    console.log(`attempting to connect to server: ${fields.url.value}`);
    const conn = await getConnection([fields.url.value]);
    publish({ conn, subject: fields.subject.value, msg: fields.message.value });
    updateOutput(fields);
  });
};

init();
