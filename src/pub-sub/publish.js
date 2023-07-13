import { getConnection, publish } from './lib.js';

/**
 * init form fields and form state
 */
const init = async () => {
  const fields = {
    url: document.getElementById('nats-url'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message'),
  };

  console.log(`attempting to connect to server: ${fields.url.value}`);
  const conn = await getConnection([fields.url.value]);

  // init listener for publishing a message
  const trigger = document.getElementById('publish');
  trigger.addEventListener('click', () => {
    publish({ conn, subject: fields.subject.value, msg: fields.message.value });
  });
};

init();
