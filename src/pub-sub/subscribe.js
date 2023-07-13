import { getConnection, processMsgs, subscribe } from './lib.js';

let sub = null;

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

  console.log(`attempting to connect to server: ${fields.url.value}`);
  const conn = await getConnection([fields.url.value]);

  // init listener for subscribing to a subject
  const trigger = document.getElementById('subscribe');
  trigger.addEventListener('click', () => {
    if (sub === null) {
      sub = subscribe({ conn, subject: fields.subject.value });
      processMsgs(sub, (msg) => {
        fields.output.innerHTML += `<br/>[${sub.getProcessed()}]: ${msg}`;
      });
      trigger.innerText = 'Subscribed!';
    }
  });
};

init();
