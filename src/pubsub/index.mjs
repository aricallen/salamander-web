import { connect, StringCodec } from '../nats.js';

const sc = StringCodec();

/**
 * TODO: allow user input to determine which servers to connect to
 */
const DEFAULT_SERVERS = ['ws://localhost:9222'];

export const getConnection = async (servers) => {
  const conn = await connect({
    servers,
  });
  return conn;
};

export const closeConnection = async (conn) => {
  // this promise indicates the client closed
  const done = conn.closed();
  // do something with the connection

  // close the connection
  await conn.close();
  // check if the close was OK
  const err = await done;
  if (err) {
    console.log(`error closing:`, err);
  }
};

const processSubMsg = async (sub) => {
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
  }
  console.log('subscription closed');
};

export const subscribe = async ({ conn, subject }) => {
  const sub = conn.subscribe(subject);
  processSubMsg(sub);
};

export const publish = async ({ conn, subject, msg }) => {
  conn.publish(subject, sc.encode(msg));
};

export const testPubSub = async () => {
  const conn = await getConnection(DEFAULT_SERVERS);
  const subject = 'hello';
  subscribe({ conn, subject });
  publish({ conn, subject, msg: 'world!' });
};

testPubSub();
