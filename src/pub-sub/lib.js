import { connect, StringCodec } from '../nats.js';
import { swapClasses, logger } from '../helpers.js';

const sc = StringCodec();

let _conn = null;

const connectToServers = async (servers) => {
  try {
    _conn = await connect({
      servers,
    });
    return _conn;
  } catch (err) {
    const error = new Error(`unable to connect to nats. Tried servers: ${servers.join(',')}`);
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
    logger.log(`error closing:`, err);
    return;
  }
  logger.log(`successfully disconnected`);
  _conn = null;
};

export const processMsgs = async (sub, cb) => {
  for await (const m of sub) {
    const msg = sc.decode(m.data);
    logger.log(`[${sub.getProcessed()}]: ${msg}`);
    cb(msg);
  }
  logger.log('subscription closed');
};

export const subscribe = ({ conn, subject }) => {
  if (!conn) {
    logger.error(`attempting to subscribe with a null connection`);
    return null;
  }
  const sub = conn.subscribe(subject);
  return sub;
};

export const publish = async ({ conn, subject, msg }) => {
  logger.log(`publishing
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
    logger.error(err);
  }
};

export const tryDisconnect = async ({ connectButton, actionButton }) => {
  try {
    await closeConnection();
    connectButton.innerText = 'Connect';
    updateServerStatus({ isConnected: false });
    actionButton.disabled = true;
  } catch (err) {
    logger.error(`error trying to disconnect`);
  }
};
