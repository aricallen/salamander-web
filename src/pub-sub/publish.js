import { tryConnect, publish, getDefaultNatsUrl, getConnection, tryDisconnect, initConnectionCheck } from './lib.js';
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

  const actionElems = {
    status: document.querySelector('#connection-status'),
    connect: document.getElementById('connect'),
    disconnect: document.getElementById('disconnect'),
    action: document.getElementById('publish'),
  };

  // init listener for publishing a message
  actionElems.action.addEventListener('click', async () => {
    const conn = getConnection();
    publish({ conn, subject: fields.subject.value, msg: fields.message.value });
    logger.log(`Successfully published message to '${fields.subject.value}':<br/>
    Message: '${fields.message.value}'`);
  });

  // init listener for connecting to nats server
  actionElems.connect.addEventListener('click', async () => {
    tryConnect({ servers: [fields.url.value], actionElems });
  });

  actionElems.disconnect.addEventListener('click', async () => {
    tryDisconnect({ servers: [fields.url.value], actionElems });
  });


  initConnectionCheck({ actionElems, checkInterval: 5000 });
};

init();
