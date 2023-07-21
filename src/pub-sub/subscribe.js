import { tryConnect, subscribe, processMsgs, getDefaultNatsUrl, tryDisconnect, initConnectionCheck, getConnection } from './lib.js';
import { logger } from '../helpers.js';

const _subs = [];

const initSub = async (fields) => {
  const conn = getConnection();
  if (!conn) {
    const err = Error('trying to subscribe when not connected');
    logger.error(err);
    throw err;
  }
  const sub = subscribe({ conn, subject: fields.subject.value });
  processMsgs(sub, (msg) => {
    logger.log(`[${sub.getSubject()}: ${sub.getProcessed()}]: '${msg}'`);
  });
  return sub;
};

/**
 * init form fields and form state
 */
const init = async () => {
  const fields = {
    url: document.getElementById('nats-url'),
    subject: document.getElementById('subject'),
  };

  fields.url.value = getDefaultNatsUrl();

  const actionElems = {
    status: document.getElementById('connection-status'),
    connect: document.getElementById('connect'),
    disconnect: document.getElementById('disconnect'),
    action: document.getElementById('subscribe'),
  };

  fields.url.value = getDefaultNatsUrl();

  // init listener for subscribing to a subject
  actionElems.action.addEventListener('click', async () => {
    const sub = await initSub(fields);
    if (sub) {
      _subs.push(sub);
      logger.log(`Successfully subscribed to: ${fields.subject.value}`);
    }
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
