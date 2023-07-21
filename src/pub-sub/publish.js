import { tryConnect, publish, getDefaultNatsUrl, getConnection, tryDisconnect } from './lib.js';
import { logger } from '../helpers.js';

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
    const conn = getConnection();
    publish({ conn, subject: fields.subject.value, msg: fields.message.value });
    logger.log(`Successfully published message to '${fields.subject.value}':<br/>
    Message: '${fields.message.value}'`);
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
