import { connectToServers, processMsgs, subscribe, getDefaultNatsUrl } from './lib.js';

let sub = null;

const initSub = async (fields) => {
  console.log(`attempting to connect to server: ${fields.url.value}`);
  const conn = await connectToServers([fields.url.value]);
  sub = subscribe({ conn, subject: fields.subject.value });
  processMsgs(sub, (msg) => {
    fields.output.innerHTML += `<br/>[${sub.getProcessed()}]: ${msg}`;
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
    output: document.getElementById('output'),
    results: document.getElementById('results'),
  };

  fields.url.value = getDefaultNatsUrl();

  // init listener for subscribing to a subject
  const trigger = document.getElementById('subscribe');
  trigger.addEventListener('click', async () => {
    if (sub === null) {
      sub = await initSub(fields);
      if (sub) {
        trigger.innerText = 'Subscribed!';
      }
    }
  });
};

init();
