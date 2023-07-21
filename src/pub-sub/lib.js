import { connect, StringCodec } from '../nats.js';

const sc = StringCodec();

let _conn = null;

const connectToServers = async (servers) => {
  try {
    _conn = await connect({
      servers,
    });
    console.log(`successfully connected to servers: ${servers.join(', ')}`);
    return _conn;
  } catch (err) {
    const error = new Error(`unable to connect to nats. Tried servers: ${servers.join(',')}`);
    console.log(error);
    throw error;
  }
};

export const getConnection = () => _conn;

export const closeConnection = async () => {
  // this promise indicates the client closed
  const done = _conn.closed();
  // do something with the connection

  // close the connection
  await _conn.close();
  // check if the close was OK
  const err = await done;
  if (err) {
    console.log(`error closing:`, err);
    return;
  }
  console.log(`successfully disconnected`);
  _conn = null;
};

export const processMsgs = async (sub, cb) => {
  for await (const m of sub) {
    const msg = sc.decode(m.data);
    console.log(`[${sub.getProcessed()}]: ${msg}`);
    cb(msg);
  }
  console.log('subscription closed');
};

export const subscribe = ({ conn, subject }) => {
  if (!conn) {
    console.error(`attempting to subscribe with a null connection`);
    return null;
  }
  const sub = conn.subscribe(subject);
  return sub;
};

export const publish = async ({ conn, subject, msg }) => {
  console.log(`publishing
  to subject: '${subject}'
  message: '${msg}'`);
  conn.publish(subject, sc.encode(msg));
};

/**
 * get the default value for the url field
 * when running locally, will default to docker-compose settings (ws://0.0.0.0:4224)
 * when loaded in a browser (e.g. github pages) will default to wss://demo.nats.io:8443
 */
const DEFAULT_LOCAL_URL = 'ws://0.0.0.0:4224';
const DEFAULT_DEMO_URL = 'wss://demo.nats.io:8443';
export const getDefaultNatsUrl = () => {
  const isLocal = window.location.host.includes('localhost');
  return isLocal ? DEFAULT_LOCAL_URL : DEFAULT_DEMO_URL;
};

/**
 * removes `prev` class and adds `next` class to `elem`
 */
export const swapClasses = ({ elem, prev, next }) => {
  elem.classList.remove(prev);
  elem.classList.add(next);
};

const updateServerStatus = ({ isConnected }) => {
  const elem = document.querySelector('.connected-status');
  const prev = isConnected ? 'disconnected' : 'connected';
  const next = isConnected ? 'connected' : 'disconnected';
  swapClasses({ elem, prev, next });
};

export const tryConnect = async ({ servers, connectButton, actionButton }) => {
  try {
    await connectToServers(servers);
    updateServerStatus({ isConnected: true });
    connectButton.innerText = 'Disconnect';
    actionButton.disabled = false;
  } catch (err) {
    updateServerStatus({ isConnected: false });
  }
};

export const tryDisconnect = async ({ connectButton, actionButton }) => {
  try {
    await closeConnection();
    connectButton.innerText = 'Connect';
    updateServerStatus({ isConnected: false });
    actionButton.disabled = true;
  } catch (err) {
    console.log(`error trying to disconnect`);
  }
};

// export const testPubSub = async () => {
//   const conn = await getConnection(DEFAULT_SERVERS);
//   const subject = 'hello';
//   subscribe({ conn, subject });
//   publish({ conn, subject, msg: 'world!' });
// };
